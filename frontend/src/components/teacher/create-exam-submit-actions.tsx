"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function CreateExamSubmitActions(props: {
  canMarkReady: boolean
  canSaveDraft: boolean
  canScheduleExam: boolean
  submitMode: "draft" | "ready" | "scheduled" | null
  onSubmitDraft: () => void
  onSubmitReady: () => void
  onSubmitScheduled: () => void
}) {
  const {
    canMarkReady,
    canSaveDraft,
    canScheduleExam,
    submitMode,
    onSubmitDraft,
    onSubmitReady,
    onSubmitScheduled,
  } = props

  return (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onSubmitDraft} disabled={!canSaveDraft}>
        {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
        Ноорог болгон хадгалах
      </Button>
      <Button variant="secondary" onClick={onSubmitReady} disabled={!canMarkReady}>
        {submitMode === "ready" ? <Spinner className="mr-2" /> : null}
        Бэлэн болгож хадгалах
      </Button>
      <Button onClick={onSubmitScheduled} disabled={!canScheduleExam}>
        {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
        Товлож хадгалах
      </Button>
    </div>
  )
}
