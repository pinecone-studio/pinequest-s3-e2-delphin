'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type QuestionStat = {
  correctCount: number
  failRate: number
  question: string
  questionId: string
  totalCount: number
  type: string
}

function getQuestionTypeLabel(type: string) {
  if (type === 'multiple-choice') return 'Сонгох хариулттай'
  if (type === 'true-false') return 'Үнэн/Худал'
  if (type === 'short-answer') return 'Богино хариулт'
  if (type === 'essay') return 'Эсээ'
  return type
}

export function TeacherQuestionAnalysisCard({
  questionStats,
}: {
  questionStats: QuestionStat[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Асуултын шинжилгээ</CardTitle>
        <CardDescription>Алдааны хувиар өндөрөөс нам руу эрэмбэлсэн асуултууд</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questionStats.map((stat, index) => (
            <div key={stat.questionId} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">А{index + 1}.</span>
                    <Badge variant="outline" className="text-xs">{getQuestionTypeLabel(stat.type)}</Badge>
                  </div>
                  <p className="text-sm mt-1">{stat.question}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-destructive">
                    {Math.round(stat.failRate)}% алдааны хувь
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.correctCount}/{stat.totalCount} зөв
                  </div>
                </div>
              </div>
              <Progress value={100 - stat.failRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
