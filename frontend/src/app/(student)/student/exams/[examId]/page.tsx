"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ExamCountdownDisplay,
  QuestionTypeBadges,
} from "@/components/student/exam-countdown-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentSession } from "@/hooks/use-student-session";
import { exams } from "@/lib/mock-data";

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: secs.toString().padStart(2, "0"),
  };
}

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`);
  const now = new Date();
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000);
  return diff > 0 ? diff : 0;
}

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);
  const { studentClass } = useStudentSession();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const exam = exams.find(e => e.id === examId);
  const schedule = exam?.scheduledClasses.find(sc => sc.classId === studentClass);

  useEffect(() => {
    if (!schedule) {
      return;
    }

    const updateCountdown = () => {
      setCountdown(getSecondsUntil(schedule.date, schedule.time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  if (!exam) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Exams
          </Link>
          <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Exam not available</CardTitle>
            <CardDescription>
              This exam is not currently scheduled for your class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/student/exams">
              <Button>Back to Exams</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasCountdown = countdown !== null;
  const isReady = countdown === 0;
  const countdownParts = formatCountdown(countdown ?? 0);
  const questionTypeCounts = Array.from(new Set(exam.questions.map(q => q.type))).map(
    (type) => ({
      count: exam.questions.filter((question) => question.type === type).length,
      type,
    }),
  );

  const handleTakeExam = () => {
    alert("Starting exam... (This would redirect to the actual exam interface)");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ExamCountdownDisplay
        countdownParts={countdownParts}
        examDuration={exam.duration}
        examTitle={exam.title}
        hasCountdown={hasCountdown}
        isFullscreen={isFullscreen}
        isReady={isReady}
        onCloseFullscreen={() => setIsFullscreen(false)}
        onOpenFullscreen={() => setIsFullscreen(true)}
        onTakeExam={handleTakeExam}
        questionCount={exam.questions.length}
      />
      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to Exams
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{schedule?.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{schedule?.time}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{exam.duration} minutes</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Questions</div>
              <div className="font-medium">{exam.questions.length}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Question Types</div>
            <QuestionTypeBadges questionTypeCounts={questionTypeCounts} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Make sure you have a stable internet connection</li>
            <li>Read each question carefully before answering</li>
            <li>You cannot pause once the exam starts</li>
            <li>The exam will auto-submit when time runs out</li>
            <li>Do not refresh or close the browser during the exam</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
