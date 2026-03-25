"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuestionBankTests } from "@/hooks/use-question-bank-tests";
import { teacherPersonas } from "@/lib/demo-personas";

export default function StudentQuestionBankPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teacherPersonas[0]?.id ?? "");
  const filteredTests = useQuestionBankTests().filter((test) => test.teacherId === selectedTeacher);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <p className="text-muted-foreground">Access mock tests uploaded by your teachers</p>
      </div>

      {/* Teacher Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Teacher</CardTitle>
          <CardDescription>Choose a teacher to view their mock tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teacherPersonas.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Mock Tests */}
      {filteredTests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No mock tests available from this teacher yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <Link key={test.id} href={`/student/question-bank/${test.id}`}>
              <Card className="h-full cursor-pointer transition-colors hover:border-foreground">
                <CardHeader>
                  <CardTitle className="text-base">{test.name}</CardTitle>
                  <CardDescription>Uploaded on {test.uploadedAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{test.fileType.toUpperCase()}</Badge>
                    <span className="text-sm text-muted-foreground">{test.fileName}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
