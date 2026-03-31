"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { FileQuestion, Loader2 } from "lucide-react";

type QuestionBankResultsProps = {
  categories: QuestionBankCategory[];
  isLoading: boolean;
};

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "easy") return "Хөнгөн";
  if (difficulty === "standard") return "Дунд";
  return "Хэцүү";
}

export function QuestionBankResults({
  categories,
  isLoading,
}: QuestionBankResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Асуултын санг ачаалж байна...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Асуулт олдсонгүй</p>
          <p className="text-sm">
            Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="space-y-3">
            <div>
              <CardTitle>{category.name}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {category.topics.map((topic) => (
                  <Badge key={topic.id} variant="secondary">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.topics.map((topic) => (
              <div key={topic.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{topic.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.questions.length} асуулт
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {topic.questions.map((question) => (
                    <div key={question.id} className="rounded-md border bg-background p-3">
                      <p className="font-medium">{question.question}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge variant="secondary">
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        <span>{question.points} оноо</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
