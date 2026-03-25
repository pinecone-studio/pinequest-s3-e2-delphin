"use client";

import { Button } from "@/components/ui/button";
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
import { type QuestionType, type ScheduleEntry } from "@/components/teacher/exam-builder-types";
import { type Class } from "@/lib/mock-data";

type ExamBuilderSummaryCardProps = {
  classes: Class[];
  duration: number;
  onAddScheduleEntry: () => void;
  onDurationChange: (value: number) => void;
  onRemoveScheduleEntry: (index: number) => void;
  onUpdateScheduleEntry: (index: number, field: keyof ScheduleEntry, value: string) => void;
  questionCounts: Record<QuestionType, number>;
  scheduleEntries: ScheduleEntry[];
  totalPoints: number;
  totalQuestions: number;
};

export function ExamBuilderSummaryCard({
  classes,
  duration,
  onAddScheduleEntry,
  onDurationChange,
  onRemoveScheduleEntry,
  onUpdateScheduleEntry,
  questionCounts,
  scheduleEntries,
  totalPoints,
  totalQuestions,
}: ExamBuilderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold">{questionCounts["multiple-choice"]}</div>
            <div className="text-sm text-muted-foreground">Multiple Choice</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold">{questionCounts["true-false"]}</div>
            <div className="text-sm text-muted-foreground">True/False</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(event) => onDurationChange(parseInt(event.target.value, 10) || 60)}
            className="w-24"
          />
        </div>
        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <Label>Schedule Exam</Label>
            <Button variant="outline" size="sm" onClick={onAddScheduleEntry}>
              Add Class Schedule
            </Button>
          </div>
          {scheduleEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes scheduled yet</p>
          ) : (
            <div className="space-y-3">
              {scheduleEntries.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  <Select
                    value={entry.classId}
                    onValueChange={(value) => onUpdateScheduleEntry(index, "classId", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(event) => onUpdateScheduleEntry(index, "date", event.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="time"
                    value={entry.time}
                    onChange={(event) => onUpdateScheduleEntry(index, "time", event.target.value)}
                    className="w-32"
                  />
                  <Button variant="ghost" size="sm" onClick={() => onRemoveScheduleEntry(index)}>
                    Remove
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
