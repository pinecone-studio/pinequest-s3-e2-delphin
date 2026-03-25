import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Exam } from "@/lib/mock-data";

type StudentExamsSectionProps = {
  studentClass: string;
};

type TodaysExamsSectionProps = StudentExamsSectionProps & {
  countdowns: Record<string, number>;
  todaysExams: Exam[];
  formatCountdown: (seconds: number) => string;
};

type UpcomingExamsSectionProps = StudentExamsSectionProps & {
  upcomingExams: Exam[];
};

function getStudentSchedule(exam: Exam, studentClass: string) {
  return exam.scheduledClasses.find(
    (scheduledClass) => scheduledClass.classId === studentClass,
  );
}

export function TodaysExamsSection({
  countdowns,
  formatCountdown,
  studentClass,
  todaysExams,
}: TodaysExamsSectionProps) {
  if (todaysExams.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Today&apos;s Exams</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {todaysExams.map((exam) => {
          const schedule = getStudentSchedule(exam, studentClass);
          const countdown = countdowns[exam.id];
          const isCountdownLoaded = countdown !== undefined;
          const isReady = countdown === 0;

          return (
            <Card
              key={exam.id}
              className={isCountdownLoaded && isReady ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>
                      {schedule?.time} - {exam.duration} minutes
                    </CardDescription>
                  </div>
                  <Badge
                    variant={isCountdownLoaded && isReady ? "default" : "secondary"}
                  >
                    {isReady ? "Ready" : "Upcoming"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    {isCountdownLoaded && isReady ? (
                      <div className="text-2xl font-bold text-primary">
                        Exam is ready!
                      </div>
                    ) : isCountdownLoaded ? (
                      <>
                        <div className="mb-1 text-sm text-muted-foreground">
                          Starts in
                        </div>
                        <div className="text-3xl font-bold font-mono">
                          {formatCountdown(countdown)}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-muted-foreground">
                        Checking schedule...
                      </div>
                    )}
                  </div>
                  <Link href={`/student/exams/${exam.id}`}>
                    <Button className="w-full" disabled={!isCountdownLoaded || !isReady}>
                      {isCountdownLoaded && isReady ? "Take Exam" : "View Details"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function UpcomingExamsSection({
  studentClass,
  upcomingExams,
}: UpcomingExamsSectionProps) {
  if (upcomingExams.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Upcoming Exams</h2>
      <div className="space-y-3">
        {upcomingExams.map((exam) => {
          const schedule = getStudentSchedule(exam, studentClass);

          return (
            <Card key={exam.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {schedule?.date} at {schedule?.time} ({exam.duration} min)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exam.questions.length} questions</Badge>
                    <Link href={`/student/exams/${exam.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
