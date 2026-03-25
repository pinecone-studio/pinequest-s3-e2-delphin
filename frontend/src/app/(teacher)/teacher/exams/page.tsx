"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exams } from "@/lib/mock-data";

export default function ExamsPage() {
  const draftExams = exams.filter(e => e.status === "draft");
  const scheduledExams = exams.filter(e => e.status === "scheduled");
  const completedExams = exams.filter(e => e.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-muted-foreground">Create and manage your exams</p>
        </div>
        <Link href="/teacher/exams/create">
          <Button>Create New Exam</Button>
        </Link>
      </div>

      {/* Scheduled Exams */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Scheduled Exams</h2>
        {scheduledExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No scheduled exams
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledExams.map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription>
                        {exam.questions.length} questions, {exam.duration} min
                      </CardDescription>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exam.scheduledClasses.map(sc => (
                      <div key={`${exam.id}-${sc.classId}`} className="text-sm flex justify-between">
                        <span className="font-medium">{sc.classId}</span>
                        <span className="text-muted-foreground">{sc.date} at {sc.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Exams */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Completed Exams</h2>
        {completedExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No completed exams
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedExams.map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription>
                        {exam.questions.length} questions, {exam.duration} min
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exam.scheduledClasses.map(sc => (
                      <div key={`${exam.id}-${sc.classId}`} className="text-sm">
                        <Link 
                          href={`/teacher/classes/${sc.classId}/exam/${exam.id}`}
                          className="hover:underline"
                        >
                          {sc.classId} - {sc.date} - View Results
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Drafts */}
      {draftExams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Drafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftExams.map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription>
                        {exam.questions.length} questions
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">Continue Editing</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
