"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDisplayStudentEmail, getDisplayStudentName } from "@/lib/demo-personas";
import { getClassById } from "@/lib/mock-data";
import { getExamsForClass, getExamResults } from "@/lib/high-school-data";

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const classData = getClassById(classId);
  const classExams = getExamsForClass(classId);
  const completedExams = classExams.filter(e => e.status === "completed");

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Class not found</h1>
        <Link href="/teacher/classes">
          <Button className="mt-4">Back to Classes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/classes" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Classes
          </Link>
          <h1 className="text-2xl font-bold mt-2">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.students.length} students enrolled</p>
        </div>
      </div>

      {/* Exam History Cards */}
      {completedExams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Exam History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedExams.map(exam => {
              const schedule = exam.scheduledClasses.find(sc => sc.classId === classId);
              const results = getExamResults(exam.id, classId);
              const avgScore = results.length > 0 
                ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / results.length)
                : 0;

              return (
                <Link key={exam.id} href={`/teacher/classes/${classId}/exam/${exam.id}`}>
                  <Card className="cursor-pointer hover:border-foreground transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription>
                        {schedule?.date} at {schedule?.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Avg: {avgScore}%</Badge>
                        <Badge variant="outline">{results.length} submissions</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>All students enrolled in {classData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.students.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {getDisplayStudentName(student.id, student.name)}
                  </TableCell>
                  <TableCell>{getDisplayStudentEmail(student.id, student.email)}</TableCell>
                  <TableCell className="text-muted-foreground">{student.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
