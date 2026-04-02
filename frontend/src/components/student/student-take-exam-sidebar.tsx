"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StudentTakeExamSidebar(props: {
  answeredCount: number
  totalQuestions: number
  completionPercent: number
  unansweredCount: number
  isSubmitting: boolean
  onSubmit: () => void
  onBack: () => void
}) {
  const {
    answeredCount,
    totalQuestions,
    completionPercent,
    unansweredCount,
    isSubmitting,
    onSubmit,
    onBack,
  } = props

  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <Card className="rounded-[18px] border-[#E6F2FF] bg-white shadow-[0_8px_24px_rgba(41,49,56,0.08)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#293138]">Явц</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6F7982]">Хариулсан</span>
              <span className="font-semibold text-[#293138]">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <Progress value={completionPercent} className="h-3 bg-[#E6F2FF]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#E6F2FF] p-4">
              <div className="text-sm text-[#007FFF]">Хариулсан</div>
              <div className="mt-1 text-2xl font-bold text-[#003366]">{answeredCount}</div>
            </div>
            <div className="rounded-2xl bg-[#FFF6F0] p-4">
              <div className="text-sm text-[#007FFF]">Үлдсэн</div>
              <div className="mt-1 text-2xl font-bold text-[#003366]">{unansweredCount}</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-[#6F7982]">
            Илгээхээс өмнө хариулаагүй асуулт үлдсэн эсэхийг шалгаарай.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[18px] border-[#CCE5FF] bg-[#003366] text-white shadow-[0_10px_24px_rgba(0,25,51,0.2)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Шалгалт дуусгах</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-[#E6F2FF]">
            Илгээсний дараа хариултыг хадгалж тайлан руу шилжинэ.
          </p>
          <div className="grid gap-3">
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-white text-[#293138] hover:bg-[#E6F2FF]"
            >
              {isSubmitting ? "Илгээж байна..." : "Шалгалт илгээх"}
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              className="h-11 rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Буцах
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

