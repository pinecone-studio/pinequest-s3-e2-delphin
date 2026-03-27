'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ExamResult } from '@/lib/mock-data'
import { getStudentById } from '@/lib/mock-data-helpers'

export function TeacherExamResultsTable({
  results,
}: {
  results: ExamResult[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сурагчдын үр дүн</CardTitle>
        <CardDescription>Энэ шалгалтын сурагч бүрийн оноо</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сурагч</TableHead>
              <TableHead>Оноо</TableHead>
              <TableHead>Хувь</TableHead>
              <TableHead>Илгээсэн огноо</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              const student = getStudentById(result.studentId)
              const percentage = Math.round((result.score / result.totalPoints) * 100)
              const variant =
                percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'

              return (
                <TableRow key={result.studentId}>
                  <TableCell className="font-medium">{student?.name}</TableCell>
                  <TableCell>{result.score}/{result.totalPoints}</TableCell>
                  <TableCell><Badge variant={variant}>{percentage}%</Badge></TableCell>
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
  )
}
