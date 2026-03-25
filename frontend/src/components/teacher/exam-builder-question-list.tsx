"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type NewQuestion, type QuestionType } from "@/components/teacher/exam-builder-types";

const questionTypeLabels: Record<QuestionType, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True/False",
  "short-answer": "Short Answer",
  essay: "Essay",
};

type ExamBuilderQuestionListProps = {
  onAddQuestion: (type: QuestionType) => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  questions: NewQuestion[];
};

function getOptionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export function ExamBuilderQuestionList({
  onAddQuestion,
  onRemoveQuestion,
  onUpdateOption,
  onUpdateQuestion,
  questions,
}: ExamBuilderQuestionListProps) {
  return (
    <>
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{question.type}</Badge>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={question.points}
                  onChange={(event) =>
                    onUpdateQuestion(question.id, {
                      points: parseInt(event.target.value, 10) || 0,
                    })
                  }
                  className="h-8 w-20"
                />
                <span className="text-sm text-muted-foreground">points</span>
                <Button variant="ghost" size="sm" onClick={() => onRemoveQuestion(question.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Question ${index + 1}`}
              value={question.question}
              onChange={(event) =>
                onUpdateQuestion(question.id, { question: event.target.value })
              }
              className="resize-none"
            />
            {question.type === "multiple-choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                      {getOptionLabel(optionIndex)}
                    </div>
                    <Input
                      placeholder={`Option ${getOptionLabel(optionIndex)}`}
                      value={option}
                      onChange={(event) =>
                        onUpdateOption(question.id, optionIndex, event.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                  <Select
                    value={question.correctAnswer}
                    onValueChange={(value) =>
                      onUpdateQuestion(question.id, { correctAnswer: value })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, optionIndex) => (
                        <SelectItem
                          key={optionIndex}
                          value={option || `Option ${getOptionLabel(optionIndex)}`}
                        >
                          {getOptionLabel(optionIndex)}: {option || "(empty)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {question.type === "true-false" && (
              <div className="flex items-center gap-4">
                <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                <Select
                  value={question.correctAnswer}
                  onValueChange={(value) => onUpdateQuestion(question.id, { correctAnswer: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="True">True</SelectItem>
                    <SelectItem value="False">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {(question.type === "short-answer" || question.type === "essay") && (
              <div className="border-b border-dashed" />
            )}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="py-4">
          <p className="mb-3 text-sm text-muted-foreground">Add Question</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(questionTypeLabels) as QuestionType[]).map((type) => (
              <Button key={type} variant="outline" size="sm" onClick={() => onAddQuestion(type)}>
                {questionTypeLabels[type]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
