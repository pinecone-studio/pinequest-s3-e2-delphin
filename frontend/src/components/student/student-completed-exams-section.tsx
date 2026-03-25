import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMockDateTime } from "@/lib/date-utils";
import type { ExamResult } from "@/lib/mock-data";

type CompletedExamsSectionProps = {
  completedResults: ExamResult[];
  findExamTitle: (examId: string) => string;
};

export function StudentCompletedExamsSection({
  completedResults,
  findExamTitle,
}: CompletedExamsSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Completed Exams</h2>
      {completedResults.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No completed exams yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {completedResults.map((result) => {
            const percentage = Math.round((result.score / result.totalPoints) * 100);

            return (
              <Card key={`${result.examId}-${result.studentId}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{findExamTitle(result.examId)}</div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {formatMockDateTime(result.submittedAt)}
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
                      <div className="mt-1 text-sm text-muted-foreground">
                        {result.score}/{result.totalPoints} points
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
