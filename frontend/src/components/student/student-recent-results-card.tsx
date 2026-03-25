import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMockDate } from "@/lib/date-utils";
import type { ExamResult } from "@/lib/mock-data";

type StudentRecentResultsCardProps = {
  findExamTitle: (examId: string) => string;
  results: ExamResult[];
};

export function StudentRecentResultsCard({
  findExamTitle,
  results,
}: StudentRecentResultsCardProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
        <CardDescription>Your exam scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => {
            const percentage = Math.round((result.score / result.totalPoints) * 100);

            return (
              <div
                key={`${result.examId}-${result.studentId}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{findExamTitle(result.examId)}</div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {formatMockDate(result.submittedAt.split("T")[0])}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      percentage >= 70
                        ? "default"
                        : percentage >= 50
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {percentage}%
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {result.score}/{result.totalPoints}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
