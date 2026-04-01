"use client";

import type { ScheduleEntry } from "@/components/teacher/exam-builder-types";
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
import { classes } from "@/lib/mock-data";

type ExamBuilderScheduleEditorProps = {
  onAddScheduleEntry: () => void;
  onRemoveScheduleEntry: (index: number) => void;
  onScheduleEntryChange: (
    index: number,
    field: keyof ScheduleEntry,
    value: string,
  ) => void;
  scheduleEntries: ScheduleEntry[];
};

export function ExamBuilderScheduleEditor({
  onAddScheduleEntry,
  onRemoveScheduleEntry,
  onScheduleEntryChange,
  scheduleEntries,
}: ExamBuilderScheduleEditorProps) {
  return (
    <div className="border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-foreground">Шалгалт товлох</Label>
          <p className="text-sm text-muted-foreground">
            Сонголттой. Хоосон орхивол шалгалт бэлэн болсон төлөвт хадгалагдана.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddScheduleEntry}>
          Ангийн хуваарь нэмэх
        </Button>
      </div>

      {scheduleEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Одоогоор анги товлоогүй байна.</p>
      ) : (
        <div className="space-y-3">
          {scheduleEntries.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
              <Select
                value={entry.classId}
                onValueChange={(value) => onScheduleEntryChange(index, "classId", value)}
              >
                <SelectTrigger className="h-11 w-40">
                  <SelectValue placeholder="Анги" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CLASSES_OPTION}>Бүх анги</SelectItem>
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
                onChange={(event) => onScheduleEntryChange(index, "date", event.target.value)}
                className="h-11 w-40"
              />
              <Input
                type="time"
                value={entry.time}
                onChange={(event) => onScheduleEntryChange(index, "time", event.target.value)}
                className="h-11 w-32"
              />
              <Button variant="ghost" size="sm" onClick={() => onRemoveScheduleEntry(index)}>
                Устгах
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
