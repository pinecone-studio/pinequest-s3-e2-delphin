"use client";

import { ExamBuilderScheduleEditor } from "@/components/teacher/exam-builder-schedule-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScheduleEntry } from "@/components/teacher/exam-builder-types";
import { type Exam } from "@/lib/mock-data";

type QuestionCounts = Record<
  "multiple-choice" | "true-false" | "matching" | "ordering" | "short-answer",
  number
>;

export function ExamBuilderSummaryCard({
  duration,
  examTitle,
  hideExamTitleField = false,
  hideScheduleEditor = false,
  hideSettingsControls = false,
  onAddScheduleEntry,
  onDurationChange,
  onRemoveScheduleEntry,
  onReportReleaseModeChange,
  onScheduleEntryChange,
  onExamTitleChange,
  questionCounts,
  questionTotal,
  reportReleaseMode,
  scheduleEntries,
  totalPoints,
}: {
  duration: number;
  examTitle: string;
  hideExamTitleField?: boolean;
  hideScheduleEditor?: boolean;
  hideSettingsControls?: boolean;
  onAddScheduleEntry: () => void;
  onDurationChange: (value: number) => void;
  onExamTitleChange: (value: string) => void;
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
      <CardContent className="space-y-5">
        {hideExamTitleField ? null : (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Шалгалтын нэр
            </Label>
            <Input
              placeholder="Шалгалтын нэр"
              value={examTitle}
              onChange={(event) => onExamTitleChange(event.target.value)}
              className="h-11 w-full md:max-w-[420px]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3 xl:grid-cols-5">
          <SummaryStat label="Асуулт" value={questionTotal} />
          <SummaryStat label="Нийт оноо" value={totalPoints} />
          <SummaryStat
            label="Сонгох хариулттай"
            value={questionCounts["multiple-choice"]}
          />
          <SummaryStat label="Үнэн / Худал" value={questionCounts["true-false"]} />
          <SummaryStat label="Харгалзуулах" value={questionCounts["matching"]} />
          <SummaryStat label="Дараалуулах" value={questionCounts["ordering"]} />
          <SummaryStat
            label="Богино хариулт"
            value={questionCounts["short-answer"]}
          />
        </div>

        {hideSettingsControls ? null : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Хугацаа (минут)
              </Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
                className="h-11 w-full md:max-w-[220px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Сурагчдад дүн харагдах хугацаа
              </Label>
              <Select
                value={reportReleaseMode}
                onValueChange={(value) =>
                  onReportReleaseModeChange(value as Exam["reportReleaseMode"])
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Дүн харагдах хугацааг сонгоно уу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="after-all-classes-complete">
                    Товлогдсон бүх анги дууссаны дараа
                  </SelectItem>
                  <SelectItem value="immediately">
                    Сурагч илгээмэгц шууд
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {hideScheduleEditor ? null : (
          <ExamBuilderScheduleEditor
            onAddScheduleEntry={onAddScheduleEntry}
            onRemoveScheduleEntry={onRemoveScheduleEntry}
            onScheduleEntryChange={onScheduleEntryChange}
            scheduleEntries={scheduleEntries}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
