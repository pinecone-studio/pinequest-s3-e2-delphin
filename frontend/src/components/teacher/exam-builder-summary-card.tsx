"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CLASSES_OPTION } from "@/lib/exams-api";
import { classes, type Exam } from "@/lib/mock-data";
import type { ScheduleEntry } from "@/components/teacher/exam-builder-types";
type QuestionCounts = Record<"multiple-choice" | "true-false" | "short-answer" | "essay", number>;

export function ExamBuilderSummaryCard({
  duration,
  onAddScheduleEntry,
  onDurationChange,
  onRemoveScheduleEntry,
  onReportReleaseModeChange,
  onScheduleEntryChange,
  questionCounts,
  questionTotal,
  reportReleaseMode,
  scheduleEntries,
  totalPoints,
}: {
  duration: number;
  onAddScheduleEntry: () => void;
  onDurationChange: (value: number) => void;
  onRemoveScheduleEntry: (index: number) => void;
  onReportReleaseModeChange: (value: Exam["reportReleaseMode"]) => void;
  onScheduleEntryChange: (
    index: number,
    field: keyof ScheduleEntry,
    value: string,
  ) => void;
  questionCounts: QuestionCounts;
  questionTotal: number;
  reportReleaseMode: Exam["reportReleaseMode"];
  scheduleEntries: ScheduleEntry[];
  totalPoints: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Шалгалтын хураангуй</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <SummaryStat label="Асуулт" value={questionTotal} />
          <SummaryStat label="Нийт оноо" value={totalPoints} />
          <SummaryStat label="Сонгох хариулттай" value={questionCounts["multiple-choice"]} />
          <SummaryStat label="Үнэн/Худал" value={questionCounts["true-false"]} />
        </div>
        <div className="flex items-center gap-4">
          <Label>Хугацаа (минут)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
            className="w-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Сурагчдад шалгалтын дүн харагдах хугацаа</Label>
          <Select
            value={reportReleaseMode}
            onValueChange={(value) =>
              onReportReleaseModeChange(value as Exam["reportReleaseMode"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Шалгалтын дүн харагдах хугацааг сонгоно уу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="after-all-classes-complete">
                Товлогдсон бүх анги дууссаны дараа
              </SelectItem>
              <SelectItem value="immediately">
                Сурагч бүр илгээсний дараа
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <Label>Шалгалт товлох</Label>
            <Button variant="outline" size="sm" onClick={onAddScheduleEntry}>
              Ангийн хуваарь нэмэх
            </Button>
          </div>

          {scheduleEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Одоогоор анги товлоогүй байна
            </p>
          ) : (
            <div className="space-y-3">
              {scheduleEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Select
                    value={entry.classId}
                    onValueChange={(value) =>
                      onScheduleEntryChange(index, "classId", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Анги" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_CLASSES_OPTION}>
                        Бүх анги
                      </SelectItem>
                      {classes.map((classEntry) => (
                        <SelectItem key={classEntry.id} value={classEntry.id}>
                          {classEntry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      onScheduleEntryChange(index, "date", e.target.value)
                    }
                    className="w-40"
                  />
                  <Input
                    type="time"
                    value={entry.time}
                    onChange={(e) =>
                      onScheduleEntryChange(index, "time", e.target.value)
                    }
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveScheduleEntry(index)}
                  >
                    Устгах
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 bg-muted rounded-lg">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
