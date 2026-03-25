"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getClassById, getExamsForClass, getExamResults } from "@/lib/mock-data"

function getSemesterLabel(date: string) {
  const [yearString, monthString] = date.split("-")
  const year = Number(yearString)
  const month = Number(monthString)
  const semester = month >= 1 && month <= 6 ? 1 : 2
  return `Semester ${semester} ${year}`
}

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  const classData = getClassById(classId)
  const classExams = getExamsForClass(classId)
  const completedExams = classExams.filter(e => e.status === 'completed')
  const semesterOptions = useMemo(() => {
    const labels = completedExams
      .map((exam) => exam.scheduledClasses.find((sc) => sc.classId === classId)?.date)
      .filter((date): date is string => Boolean(date))
      .map(getSemesterLabel)

    return Array.from(new Set(labels)).sort((a, b) => b.localeCompare(a))
  }, [classId, completedExams])
  const [selectedSemester, setSelectedSemester] = useState("all")
  const visibleCompletedExams = useMemo(() => {
    if (selectedSemester === "all") {
      return completedExams
    }

    return completedExams.filter((exam) => {
      const examDate = exam.scheduledClasses.find((sc) => sc.classId === classId)?.date
      return examDate ? getSemesterLabel(examDate) === selectedSemester : false
    })
  }, [classId, completedExams, selectedSemester])

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Class not found</h1>
        <Link href="/teacher/classes">
          <Button className="mt-4">Back to Classes</Button>
        </Link>
      </div>
    )
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
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Exam History</h2>
              <p className="text-sm text-muted-foreground">Filter completed exams by semester</p>
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All semesters</SelectItem>
                {semesterOptions.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {visibleCompletedExams.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No completed exams found for {selectedSemester}.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCompletedExams.map(exam => {
              const schedule = exam.scheduledClasses.find(sc => sc.classId === classId)
              const results = getExamResults(exam.id, classId)
              const avgScore = results.length > 0 
                ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / results.length)
                : 0

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
                      <div className="flex flex-wrap items-center gap-2">
                        {schedule?.date ? (
                          <Badge variant="outline">{getSemesterLabel(schedule.date)}</Badge>
                        ) : null}
                        <Badge variant="secondary">Avg: {avgScore}%</Badge>
                        <Badge variant="outline">{results.length} submissions</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
            </div>
          )}
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
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-muted-foreground">{student.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
