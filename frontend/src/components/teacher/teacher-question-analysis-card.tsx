import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type QuestionStat = {
  correctCount: number;
  failRate: number;
  question: string;
  questionId: string;
  totalCount: number;
  type: string;
};

export function TeacherQuestionAnalysisCard({
  questionStats,
}: {
  questionStats: QuestionStat[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Analysis</CardTitle>
        <CardDescription>Questions sorted by fail rate (highest to lowest)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questionStats.map((stat, index) => (
            <div key={stat.questionId} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Q{index + 1}.</span>
                    <Badge className="text-xs" variant="outline">
                      {stat.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm">{stat.question}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-destructive">
                    {Math.round(stat.failRate)}% fail rate
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.correctCount}/{stat.totalCount} correct
                  </div>
                </div>
              </div>
              <Progress className="h-2" value={100 - stat.failRate} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
