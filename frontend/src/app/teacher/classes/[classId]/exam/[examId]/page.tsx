"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { exams, getClassById, getExamResults, getQuestionStats, getStudentById } from "@/lib/mock-data"

export default function ExamStatsPage({ 
  params 
}: { 
  params: Promise<{ classId: string; examId: string }> 
}) {
  const { classId, examId } = use(params)
  const classData = getClassById(classId)
  const exam = exams.find(e => e.id === examId)
  const results = getExamResults(examId, classId)
  const questionStats = getQuestionStats(examId)

  if (!classData || !exam) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <Link href={`/teacher/classes/${classId}`}>
          <Button className="mt-4">Back to Class</Button>
        </Link>
      </div>
    )
  }

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / results.length)
    : 0

  const highestScore = results.length > 0 
    ? Math.max(...results.map(r => (r.score / r.totalPoints) * 100))
    : 0

  const lowestScore = results.length > 0 
    ? Math.min(...results.map(r => (r.score / r.totalPoints) * 100))
    : 0

  const downloadStats = () => {
    const data = {
      exam: exam.title,
      class: classData.name,
      date: exam.scheduledClasses.find(sc => sc.classId === classId)?.date,
      statistics: {
        totalStudents: results.length,
        averageScore: avgScore,
        highestScore: Math.round(highestScore),
        lowestScore: Math.round(lowestScore),
      },
      questionAnalysis: questionStats.map(q => ({
        question: q.question,
        type: q.type,
        correctAnswers: q.correctCount,
        totalAnswers: q.totalCount,
        failRate: Math.round(q.failRate) + '%',
      })),
      studentResults: results.map(r => {
        const student = getStudentById(r.studentId)
        return {
          studentName: student?.name,
          score: r.score,
          totalPoints: r.totalPoints,
          percentage: Math.round((r.score / r.totalPoints) * 100) + '%',
        }
      }),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exam.title}-${classData.name}-stats.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href={`/teacher/classes/${classId}`} 
            className="text-sm text-muted-foreground hover:underline"
          >
            &larr; Back to {classData.name}
          </Link>
          <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
          <p className="text-muted-foreground">Statistics for {classData.name}</p>
        </div>
        <Button onClick={downloadStats}>Download Report</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Submissions</CardDescription>
            <CardTitle className="text-3xl">{results.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Highest Score</CardDescription>
            <CardTitle className="text-3xl">{Math.round(highestScore)}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lowest Score</CardDescription>
            <CardTitle className="text-3xl">{Math.round(lowestScore)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Most Failed Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
          <CardDescription>Questions sorted by fail rate (highest to lowest)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionStats.map((stat, index) => (
              <div key={stat.questionId} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Q{index + 1}.</span>
                      <Badge variant="outline" className="text-xs">{stat.type}</Badge>
                    </div>
                    <p className="text-sm mt-1">{stat.question}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-destructive">
                      {Math.round(stat.failRate)}% fail rate
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.correctCount}/{stat.totalCount} correct
                    </div>
                  </div>
                </div>
                <Progress value={100 - stat.failRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Results */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>Individual scores for this exam</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(result => {
                const student = getStudentById(result.studentId)
                const percentage = Math.round((result.score / result.totalPoints) * 100)
                return (
                  <TableRow key={result.studentId}>
                    <TableCell className="font-medium">{student?.name}</TableCell>
                    <TableCell>{result.score}/{result.totalPoints}</TableCell>
                    <TableCell>
                      <Badge variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}>
                        {percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(result.submittedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
