import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CountdownParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

type ExamCountdownDisplayProps = {
  countdownParts: CountdownParts;
  examDuration: number;
  examTitle: string;
  hasCountdown: boolean;
  isFullscreen: boolean;
  isReady: boolean;
  onCloseFullscreen: () => void;
  onOpenFullscreen: () => void;
  onTakeExam: () => void;
  questionCount: number;
};

function CountdownClock({ countdownParts }: { countdownParts: CountdownParts }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {[
        ["Hours", countdownParts.hours],
        ["Minutes", countdownParts.minutes],
        ["Seconds", countdownParts.seconds],
      ].map(([label, value], index) => (
        <div key={label} className="flex items-center gap-4">
          <div className="text-center">
            <div className="rounded-lg bg-muted px-4 py-2 text-4xl font-bold font-mono md:px-6 md:py-4 md:text-7xl">
              {value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">
              {label}
            </div>
          </div>
          {index < 2 && (
            <div className="text-2xl font-bold text-muted-foreground md:text-5xl">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ExamCountdownDisplay({
  countdownParts,
  examDuration,
  examTitle,
  hasCountdown,
  isFullscreen,
  isReady,
  onCloseFullscreen,
  onOpenFullscreen,
  onTakeExam,
  questionCount,
}: ExamCountdownDisplayProps) {
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={onCloseFullscreen}
        >
          Exit Fullscreen
        </button>
        <h1 className="mb-2 text-3xl font-bold">{examTitle}</h1>
        {isReady ? (
          <div className="text-center">
            <div className="mb-8 text-6xl font-bold text-primary">
              Exam is Ready!
            </div>
            <Button className="px-8 py-6 text-xl" onClick={onTakeExam} size="lg">
              Take Exam Now
            </Button>
          </div>
        ) : hasCountdown ? (
          <>
            <div className="mb-4 text-muted-foreground">Exam starts in</div>
            <div className="mb-8">
              <CountdownClock countdownParts={countdownParts} />
            </div>
            <Button className="opacity-50" disabled size="lg">
              Waiting for exam to start...
            </Button>
          </>
        ) : (
          <div className="font-medium text-muted-foreground">
            Checking schedule...
          </div>
        )}
        <div className="mt-12 text-center text-muted-foreground">
          <p>Duration: {examDuration} minutes</p>
          <p>Questions: {questionCount}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={isReady ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>{isReady ? "Exam is Ready!" : "Time Until Exam"}</CardTitle>
        <CardDescription>
          {isReady
            ? "You can now take the exam"
            : "The take exam button will be available when the countdown reaches zero"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasCountdown && isReady ? (
          <div className="py-4 text-center">
            <div className="mb-4 text-4xl font-bold text-primary">Start Now!</div>
            <Button onClick={onTakeExam} size="lg">
              Take Exam
            </Button>
          </div>
        ) : hasCountdown ? (
          <div className="space-y-4">
            <CountdownClock countdownParts={countdownParts} />
            <div className="flex justify-center gap-4">
              <Button onClick={onOpenFullscreen} variant="outline">
                View Fullscreen
              </Button>
              <Button disabled>Take Exam (Locked)</Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Checking schedule...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuestionTypeBadges({
  questionTypeCounts,
}: {
  questionTypeCounts: Array<{ count: number; type: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {questionTypeCounts.map(({ count, type }) => (
        <Badge key={type} variant="outline">
          {type}: {count}
        </Badge>
      ))}
    </div>
  );
}
