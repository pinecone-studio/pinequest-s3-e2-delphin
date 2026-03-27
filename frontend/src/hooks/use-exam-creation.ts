"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type {
  NewQuestion,
  ScheduleEntry,
} from "@/components/teacher/exam-builder-types"
import { toast } from "@/hooks/use-toast"
import {
  buildCreateExamPayload,
  createExam,
  updateExam,
} from "@/lib/exams-api"
import { validateExamPayloadInput, type ExamValidationSection } from "@/lib/exam-validation"

type SubmitMode = "draft" | "scheduled"

export function useExamCreation({
  duration,
  examId,
  examTitle,
  mode = "create",
  onValidationError,
  questions,
  reportReleaseMode,
  scheduleEntries,
}: {
  duration: number
  examId?: string
  examTitle: string
  mode?: "create" | "edit"
  onValidationError?: (section: ExamValidationSection) => void
  questions: NewQuestion[]
  reportReleaseMode: "after-all-classes-complete" | "immediately"
  scheduleEntries: ScheduleEntry[]
}) {
  const router = useRouter()
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const [submitMode, setSubmitMode] = React.useState<SubmitMode | null>(null)

  const isSubmitting = submitMode !== null
  const canSaveDraft = !isSubmitting
  const canScheduleExam = !isSubmitting

  const submitExam = React.useCallback(
    async (status: SubmitMode) => {
      setSubmissionError(null)
      setSubmitMode(status)

      try {
        const validationErrors = validateExamPayloadInput({
          examTitle,
          duration,
          questions,
          scheduleEntries,
          status,
        })

        if (validationErrors.length > 0) {
          onValidationError?.(validationErrors[0].section)
          throw new Error(validationErrors[0].message)
        }

        const payload = buildCreateExamPayload({
          duration,
          examTitle,
          questions,
          reportReleaseMode,
          scheduleEntries,
          status,
        })

        if (mode === "edit" && examId) {
          await updateExam(examId, payload)
        } else {
          await createExam(payload)
        }

        toast({
          title:
            mode === "edit"
              ? status === "draft"
                ? "Ноорог амжилттай шинэчлэгдлээ"
                : "Шалгалт амжилттай шинэчлэгдлээ"
              : status === "draft"
                ? "Ноорог амжилттай хадгалагдлаа"
                : "Шалгалт амжилттай үүслээ",
          description:
            mode === "edit"
              ? status === "draft"
                ? "Шалгалтын ноорог амжилттай шинэчлэгдлээ."
                : "Товлогдсон шалгалт амжилттай шинэчлэгдлээ."
              : status === "draft"
                ? "Шалгалтын ноорог амжилттай хадгалагдлаа."
                : "Шалгалт амжилттай үүсэж, товлогдлоо.",
        })

        await new Promise((resolve) => setTimeout(resolve, 150))
        router.push("/teacher/exams")
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Шалгалтыг хадгалах үед алдаа гарлаа."

        setSubmissionError(message)
        toast({
          title: "Шалгалтыг хадгалж чадсангүй",
          description: message,
          variant: "destructive",
        })
      } finally {
        setSubmitMode(null)
      }
    },
    [
      duration,
      examId,
      examTitle,
      mode,
      onValidationError,
      questions,
      reportReleaseMode,
      router,
      scheduleEntries,
    ],
  )

  return {
    canSaveDraft,
    canScheduleExam,
    isSubmitting,
    submissionError,
    submitExam,
    submitMode,
  }
}
