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
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Асуултын шинжилгээ</CardTitle>
        <CardDescription>
          Асуултуудыг багшийн үүсгэсэн дарааллаар нь харуулж, тус бүрийн гүйцэтгэлийг нэг
          дороос харна.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          {questionStats.map((stat, index) => (
            <div
              key={stat.questionId}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Асуулт {index + 1}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getQuestionTypeLabel(stat.type)}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{stat.question}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {Math.round(stat.failRate)}%
                  </div>
                  <div className="text-xs text-slate-500">алдааны хувь</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Зөв хариулсан</span>
                  <span>
                    {stat.correctCount}/{stat.totalCount}
                  </span>
                </div>
                <Progress value={100 - stat.failRate} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
