"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getClassById,
  getExamResults,
  getExamsForClass,
} from "@/lib/mock-data-helpers"

function getSemesterLabel(date: string) {
  const [yearString, monthString] = date.split("-")
  const year = Number(yearString)
  const month = Number(monthString)
  const semester = month >= 1 && month <= 6 ? 1 : 2
  return `${semester}-р улирал ${year}`
}

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  const classData = getClassById(classId)
  const classExams = getExamsForClass(classId)
  const completedExams = classExams.filter((exam) => exam.status === "completed")
  const semesterOptions = useMemo(() => {
    const labels = completedExams
      .map((exam) => exam.scheduledClasses.find((schedule) => schedule.classId === classId)?.date)
      .filter((date): date is string => Boolean(date))
      .map(getSemesterLabel)

    return Array.from(new Set(labels)).sort((left, right) => right.localeCompare(left))
  }, [classId, completedExams])
  const [selectedSemester, setSelectedSemester] = useState("all")

  const visibleCompletedExams = useMemo(() => {
    if (selectedSemester === "all") {
      return completedExams
    }

    return completedExams.filter((exam) => {
      const examDate = exam.scheduledClasses.find((schedule) => schedule.classId === classId)?.date
      return examDate ? getSemesterLabel(examDate) === selectedSemester : false
    })
  }, [classId, completedExams, selectedSemester])

  if (!classData) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Анги олдсонгүй</h1>
        <Link href="/teacher/classes">
          <Button className="mt-4">Ангиуд руу буцах</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/classes" className="text-sm text-muted-foreground hover:underline">
            &larr; Ангиуд руу буцах
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.students.length} сурагч бүртгэлтэй</p>
        </div>
      </div>

      {completedExams.length > 0 ? (
        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Шалгалтын түүх</h2>
              <p className="text-sm text-muted-foreground">Дууссан шалгалтуудыг улирлаар шүүнэ. Доорх товчоор үнэлгээний хуудас руу орно.</p>
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Улирлаар шүүх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх улирал</SelectItem>
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
                {selectedSemester} улиралд дууссан шалгалт олдсонгүй.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleCompletedExams.map((exam) => {
                const schedule = exam.scheduledClasses.find((scheduleEntry) => scheduleEntry.classId === classId)
                const results = getExamResults(exam.id, classId)
                const avgScore = results.length > 0
                  ? Math.round(results.reduce((sum, result) => sum + (result.score / result.totalPoints) * 100, 0) / results.length)
                  : 0

                return (
                  <Card key={exam.id} className="border-sky-100 shadow-sm transition-colors hover:border-sky-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base">{exam.title}</CardTitle>
                          <CardDescription>
                            {schedule?.date} {schedule?.time}
                          </CardDescription>
                        </div>
                        <div className="rounded-full bg-sky-100 p-2 text-sky-700">
                          <ClipboardCheck className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {schedule?.date ? (
                          <Badge variant="outline">{getSemesterLabel(schedule.date)}</Badge>
                        ) : null}
                        <Badge variant="secondary">Дундаж: {avgScore}%</Badge>
                        <Badge variant="outline">{results.length} илгээлт</Badge>
                      </div>

                      <Button asChild className="w-full justify-between">
                        <Link href={`/teacher/classes/${classId}/exam/${exam.id}`}>
                          Үр дүн, үнэлгээ харах
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Сурагчдын жагсаалт</CardTitle>
          <CardDescription>{classData.name}-д бүртгэлтэй бүх сурагч</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Имэйл</TableHead>
                <TableHead>Сурагчийн ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.students.map((student) => (
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
