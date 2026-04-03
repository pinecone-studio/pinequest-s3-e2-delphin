import { Injectable } from '@nestjs/common';
import type { Exam } from '../exams/exams.types';
import type { StudentExamAnswer } from './student-exam-results.types';

type AiQuestion = {
  answer: string;
  correctAnswer: string;
  question: string;
  questionId: string;
  type: Exam['questions'][number]['type'];
};

type AiGrade = {
  explanation: string;
  isCorrect: boolean;
  questionId: string;
};

type AiGradeCandidate = {
  explanation?: string;
  isCorrect?: boolean;
  questionId?: string;
};

@Injectable()
export class StudentExamGradingService {
  async grade(exam: Exam, answers: Record<string, string>) {
    const aiAnswers = exam.questions
      .filter((question) => isAiQuestion(question.type))
      .filter(
        (question) =>
          (answers[question.id] ?? '').trim() && question.correctAnswer,
      )
      .map((question) => ({
        questionId: question.id,
        question: question.question,
        type: question.type,
        correctAnswer: question.correctAnswer ?? '',
        answer: answers[question.id] ?? '',
      }));
    const aiGrades = await this.evaluateWithAi(aiAnswers).catch(
      (): AiGrade[] => [],
    );
    const aiMap = new Map<string, AiGrade>(
      aiGrades.map((item) => [item.questionId, item]),
    );

    return exam.questions.map((question) => {
      const answer = answers[question.id] ?? '';
      if (!answer.trim())
        return {
          questionId: question.id,
          answer,
          isCorrect: null,
        } satisfies StudentExamAnswer;
      const aiGrade = aiMap.get(question.id);
      return aiGrade
        ? toGradedAnswer(
            question.id,
            answer,
            question.points,
            aiGrade.isCorrect,
            aiGrade.explanation,
          )
        : gradeWithRules(
            question.id,
            question.type,
            question.question,
            answer,
            question.correctAnswer ?? '',
            question.points,
          );
    });
  }

  private async evaluateWithAi(questions: AiQuestion[]): Promise<AiGrade[]> {
    const apiKeys = getOpenAiApiKeys();
    if (apiKeys.length === 0 || questions.length === 0) return [];

    let lastError: Error | null = null;
    for (const apiKey of apiKeys) {
      try {
        const response = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: process.env.OPENAI_GRADING_MODEL?.trim() || 'gpt-4.1-mini',
            instructions:
              'You are grading student exam answers. Decide only correct or wrong. Every explanation must be in natural Mongolian, educational, and step-by-step. Mention: 1) what the question is asking, 2) the correct answer, 3) a short reasoning process to solve it, 4) why the student answer is right or wrong. Keep each explanation to 3-5 short sentences. Return JSON only in the form {"results":[{"questionId":"...","isCorrect":true,"explanation":"..."}]}.',
            input: JSON.stringify({ questions }),
          }),
        });
        if (!response.ok) {
          lastError = new Error(
            `OpenAI grading failed with ${response.status}`,
          );
          continue;
        }
        const payload = (await response.json()) as Record<string, unknown>;
        const rawText = extractOutputText(payload);
        if (!rawText) return [];
        return (
          (JSON.parse(rawText) as { results?: AiGradeCandidate[] }).results ??
          []
        )
          .filter(isAiGrade)
          .map((item) => ({
            questionId: item.questionId,
            isCorrect: item.isCorrect,
            explanation:
              typeof item.explanation === 'string' ? item.explanation : '',
          }));
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error('OpenAI grading failed');
      }
    }

    if (lastError) throw lastError;
    return [];
  }
}

function gradeWithRules(
  questionId: string,
  type: Exam['questions'][number]['type'],
  question: string,
  answer: string,
  correctAnswer: string,
  points: number,
): StudentExamAnswer {
  const isCorrect = compareAnswers(answer, correctAnswer);
  const explanation = buildRuleExplanation(
    type,
    question,
    answer,
    correctAnswer,
    isCorrect,
  );
  return toGradedAnswer(questionId, answer, points, isCorrect, explanation);
}

function buildRuleExplanation(
  type: Exam['questions'][number]['type'],
  question: string,
  answer: string,
  correctAnswer: string,
  isCorrect: boolean,
) {
  const label = type === 'fill' ? 'нөхөх' : 'автомат';
  if (isCorrect) {
    return [
      `Энэ ${label} асуулт нь "${question}" гэж асууж байна.`,
      `Зөв хариу нь "${correctAnswer}" бөгөөд таны оруулсан "${answer}" хариулт түүнтэй таарч байна.`,
      `Иймээс бодолтын гол үр дүн зөв гарсан гэж үнэллээ.`,
    ].join(' ');
  }

  return [
    `Энэ асуултын зорилго нь "${question}" даалгаврын зөв хариуг олох юм.`,
    `Зөв хариу нь "${correctAnswer}" байх ёстой боловч та "${answer}" гэж хариулсан байна.`,
    `Тиймээс таны хариулт эцсийн зөв үр дүнтэй таарахгүй байна.`,
    `Дахин бодохдоо асуултаас яг юу шаардаж байгааг тодруулж, гарсан хариугаа зөв хариутай тулгаж шалгаарай.`,
  ].join(' ');
}

function toGradedAnswer(
  questionId: string,
  answer: string,
  points: number,
  isCorrect: boolean,
  explanation: string,
): StudentExamAnswer {
  return {
    questionId,
    answer,
    isCorrect,
    awardedPoints: isCorrect ? points : 0,
    reviewStatus: isCorrect ? 'auto-correct' : 'auto-wrong',
    explanation,
  };
}

function getOpenAiApiKeys() {
  const preferred = ['OPENAI_API_KEY', 'OPENAI_API_KEY_2', 'OPENAI_API_KEY_3'];
  const discovered = Object.keys(process.env)
    .filter((key) => key.startsWith('OPENAI_API_KEY'))
    .filter((key) => !preferred.includes(key))
    .sort();
  return [...preferred, ...discovered]
    .map((key) => process.env[key]?.trim())
    .filter((value): value is string => Boolean(value));
}

function isAiGrade(
  item: AiGradeCandidate,
): item is { explanation?: string; isCorrect: boolean; questionId: string } {
  return (
    typeof item.questionId === 'string' && typeof item.isCorrect === 'boolean'
  );
}

function compareAnswers(answer: string, correctAnswer: string) {
  const normalizedAnswer = normalizeAnswer(answer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  if (!normalizedAnswer || !normalizedCorrect) return false;
  if (normalizedAnswer === normalizedCorrect) return true;
  const numericAnswer = parseNumericValue(normalizedAnswer);
  const numericCorrect = parseNumericValue(normalizedCorrect);
  return numericAnswer !== null && numericCorrect !== null
    ? Math.abs(numericAnswer - numericCorrect) < 0.0001
    : false;
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseNumericValue(value: string) {
  if (/^-?\d+(\.\d+)?%$/.test(value))
    return Number(value.replace('%', '')) / 100;
  if (/^-?\d+\/\d+$/.test(value)) {
    const [left, right] = value.split('/').map(Number);
    return right ? left / right : null;
  }
  const numeric = Number(value.replace(/,/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

function extractOutputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === 'string') return payload.output_text;
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    const content = Array.isArray((item as { content?: unknown[] }).content)
      ? ((item as { content?: unknown[] }).content ?? [])
      : [];
    for (const part of content) {
      if (typeof (part as { text?: unknown }).text === 'string')
        return (part as { text: string }).text;
    }
  }
  return '';
}

function isAiQuestion(type: Exam['questions'][number]['type']) {
  return type === 'fill' || type === 'short-answer';
}
