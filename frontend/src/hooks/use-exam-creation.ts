'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { NewQuestion, ScheduleEntry } from '@/components/teacher/exam-builder-types'
import { toast } from '@/hooks/use-toast'
import { buildCreateExamPayload, createExam } from '@/lib/exams-api'
import { validateExamPayloadInput } from '@/lib/exam-validation'

type SubmitMode = 'draft' | 'scheduled'

export function useExamCreation({
  duration,
  examTitle,
  questions,
  reportReleaseMode,
  scheduleEntries,
}: {
  duration: number
  examTitle: string
  questions: NewQuestion[]
  reportReleaseMode: 'after-all-classes-complete' | 'immediately'
  scheduleEntries: ScheduleEntry[]
}) {
  const router = useRouter()
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const [submitMode, setSubmitMode] = React.useState<SubmitMode | null>(null)

  const isSubmitting = submitMode !== null
  const canSaveDraft = examTitle.trim().length > 0 && !isSubmitting
  const canScheduleExam =
    examTitle.trim().length > 0 &&
    questions.length > 0 &&
    scheduleEntries.length > 0 &&
    !isSubmitting

  const submitExam = React.useCallback(
    async (status: SubmitMode) => {
      setSubmissionError(null)
      setSubmitMode(status)

      try {
        const validationErrors = validateExamPayloadInput({
          duration,
          questions,
          scheduleEntries,
          status,
        })

        if (validationErrors.length > 0) {
          throw new Error(validationErrors[0])
        }

        const payload = buildCreateExamPayload({
          duration,
          examTitle,
          questions,
          reportReleaseMode,
          scheduleEntries,
          status,
        })

        await createExam(payload)

        toast({
          title: status === 'draft' ? 'Draft saved' : 'Exam created',
          description:
            status === 'draft'
              ? 'Your exam draft was saved to the backend.'
              : 'Your scheduled exam was created successfully.',
        })
        router.push('/teacher/exams')
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Something went wrong while saving the exam.'

        setSubmissionError(message)
        toast({
          title: 'Could not save exam',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setSubmitMode(null)
      }
    },
    [duration, examTitle, questions, reportReleaseMode, router, scheduleEntries],
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
