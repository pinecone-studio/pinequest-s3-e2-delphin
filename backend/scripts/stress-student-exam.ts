type IpMode = 'shared-ip' | 'unique-ip';
type Phase = 'reads' | 'attempts' | 'results' | 'full';
type Options = {
  baseUrl: string;
  examId: string;
  classId: string;
  students: number;
  concurrency: number;
  ipMode: IpMode;
  phase: Phase;
};

type Sample = {
  ok: boolean;
  status: number;
  durationMs: number;
};
function includesPhase(current: Phase, expected: Exclude<Phase, 'full'>) {
  return current === expected || current === 'full';
}
function readOption(name: string, fallback?: string) {
  const prefix = `--${name}=`;
  const cliValue = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return cliValue ? cliValue.slice(prefix.length) : fallback;
}
function parseOptions(): Options {
  return {
    baseUrl: readOption('baseUrl', process.env.STRESS_BASE_URL || 'http://127.0.0.1:3001/api')!,
    examId: readOption('examId', process.env.STRESS_EXAM_ID || 'codex-stress-exam')!,
    classId: readOption('classId', process.env.STRESS_CLASS_ID || '10B')!,
    students: Number(readOption('students', process.env.STRESS_STUDENTS || '50')),
    concurrency: Number(readOption('concurrency', process.env.STRESS_CONCURRENCY || '10')),
    ipMode: (readOption('ipMode', process.env.STRESS_IP_MODE || 'shared-ip') as IpMode),
    phase: (readOption('phase', process.env.STRESS_PHASE || 'full') as Phase),
  };
}
function buildIp(index: number, mode: IpMode) {
  return mode === 'shared-ip' ? '203.0.113.10' : `198.51.100.${(index % 250) + 1}`;
}
function percentile(values: number[], ratio: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))]!;
}
async function postJson(url: string, payload: unknown, ip: string): Promise<Sample> {
  const startedAt = performance.now();
  const response = await fetch(url, {
    method: payload ? 'POST' : 'GET',
    headers: {
      'x-forwarded-for': ip,
      ...(payload ? { 'content-type': 'application/json' } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return {
    ok: response.ok,
    status: response.status,
    durationMs: Math.round(performance.now() - startedAt),
  };
}
async function runWorker(index: number, options: Options): Promise<Sample[]> {
  const studentId = `stress-student-${index + 1}`;
  const studentName = `Stress Student ${index + 1}`;
  const ip = buildIp(index, options.ipMode);
  const timestamp = new Date().toISOString();
  const samples: Sample[] = [];
  if (includesPhase(options.phase, 'reads')) {
    samples.push(await postJson(`${options.baseUrl}/exams`, null, ip));
    samples.push(
      await postJson(
        `${options.baseUrl}/student-exam-results?examId=${options.examId}&studentId=${studentId}`,
        null,
        ip,
      ),
    );
  }
  if (includesPhase(options.phase, 'attempts')) {
    samples.push(
      await postJson(
        `${options.baseUrl}/student-exam-attempts`,
        {
          examId: options.examId,
          studentId,
          studentName,
          classId: options.classId,
          status: 'in_progress',
          startedAt: timestamp,
          submittedAt: null,
        },
        ip,
      ),
    );
  }
  if (includesPhase(options.phase, 'results')) {
    samples.push(
      await postJson(
        `${options.baseUrl}/student-exam-results`,
        {
          examId: options.examId,
          studentId,
          studentName,
          classId: options.classId,
          answers: [
            {
              questionId: 'stress-q1',
              answer: 'A',
              isCorrect: true,
              awardedPoints: 1,
              reviewStatus: 'auto-correct',
            },
          ],
          score: 1,
          totalPoints: 1,
          submittedAt: timestamp,
        },
        ip,
      ),
    );
  }
  return samples;
}
async function runPool(options: Options) {
  const allSamples: Sample[] = [];
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < options.students) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      const samples = await runWorker(currentIndex, options);
      allSamples.push(...samples);
    }
  }
  const startedAt = performance.now();
  await Promise.all(
    Array.from({ length: Math.min(options.concurrency, options.students) }, () => worker()),
  );
  const totalDurationMs = Math.round(performance.now() - startedAt);
  return { allSamples, totalDurationMs };
}
function printSummary(options: Options, samples: Sample[], totalDurationMs: number) {
  const okCount = samples.filter((sample) => sample.ok).length;
  const rateLimited = samples.filter((sample) => sample.status === 429).length;
  const durations = samples.map((sample) => sample.durationMs);
  const averageDuration = Math.round(
    durations.reduce((sum, value) => sum + value, 0) / Math.max(durations.length, 1),
  );
  console.log('');
  console.log('Stress test summary');
  console.log(`baseUrl: ${options.baseUrl}`);
  console.log(`phase: ${options.phase}`);
  console.log(`students: ${options.students}`);
  console.log(`concurrency: ${options.concurrency}`);
  console.log(`ipMode: ${options.ipMode}`);
  console.log(`requests sent: ${samples.length}`);
  console.log(`success: ${okCount}`);
  console.log(`failed: ${samples.length - okCount}`);
  console.log(`429 rate-limited: ${rateLimited}`);
  console.log(`total duration: ${totalDurationMs}ms`);
  console.log(`avg latency: ${averageDuration}ms`);
  console.log(`p50 latency: ${percentile(durations, 0.5)}ms`);
  console.log(`p95 latency: ${percentile(durations, 0.95)}ms`);
  console.log(`max latency: ${Math.max(...durations, 0)}ms`);
}
async function main() {
  const options = parseOptions();
  console.log(`Starting stress test against ${options.baseUrl}`);
  const { allSamples, totalDurationMs } = await runPool(options);
  printSummary(options, allSamples, totalDurationMs);
}
void main().catch((error) => {
  console.error('Stress test failed');
  console.error(error);
  process.exitCode = 1;
});
