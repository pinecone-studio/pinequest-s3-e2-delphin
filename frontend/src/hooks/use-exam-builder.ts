'use client'

import { useState } from 'react'
import type { Exam } from '@/lib/mock-data'
import type { ScheduleEntry } from '@/components/teacher/exam-builder-types'
import {
  defaultAIQuestionTypeCounts,
  type AIQuestionTypeCounts,
} from '@/components/teacher/ai-question-generator-dialog-types'
import {
  createPreparedAiQuestions,
  createQuestion,
  getPreparedAIQuestionTypeCounts,
} from '@/hooks/ai-question-builder'
import { useAiSourceFiles } from '@/hooks/use-ai-source-files'

export function useExamBuilder() {
  const [examTitle, setExamTitle] = useState('')
  const [questions, setQuestions] = useState<ReturnType<typeof createQuestion>[]>([])
  const [duration, setDuration] = useState(60)
  const aiSourceFiles = useAiSourceFiles()
  const [reportReleaseMode, setReportReleaseMode] =
    useState<Exam['reportReleaseMode']>('after-all-classes-complete')
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiQuestionTypeCounts, setAiQuestionTypeCounts] =
    useState<AIQuestionTypeCounts>(defaultAIQuestionTypeCounts)
  const [selectedMockTests, setSelectedMockTests] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([])

  const addQuestion = (type: Parameters<typeof createQuestion>[0]) => {
    setQuestions((current) => [...current, createQuestion(type, `new-${Date.now()}`)])
  }
  const updateQuestion = (id: string, updates: Partial<(typeof questions)[number]>) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, ...updates } : question)))
  }
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId || !question.options) return question
        const options = [...question.options]
        options[optionIndex] = value
        return { ...question, options }
      }),
    )
  }
  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id))
  }
  const generateAIQuestions = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 3200))
    setAiQuestionTypeCounts(getPreparedAIQuestionTypeCounts())
    setQuestions((current) => [...current, ...createPreparedAiQuestions()])
    setIsGenerating(false)
    setShowAIDialog(false)
  }
  const addScheduleEntry = () => {
    setScheduleEntries((current) =>
      current.some((entry) => !entry.classId && !entry.date && !entry.time)
        ? current
        : [...current, { classId: '', date: '', time: '' }],
    )
  }
  const updateScheduleEntry = (index: number, field: keyof ScheduleEntry, value: string) => {
    setScheduleEntries((current) => {
      const updated = [...current]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }
  const removeScheduleEntry = (index: number) => {
    setScheduleEntries((current) => current.filter((_, entryIndex) => entryIndex !== index))
  }

  return {
    ...aiSourceFiles,
    addQuestion,
    addScheduleEntry,
    aiQuestionTypeCounts,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    questions,
    reportReleaseMode,
    removeQuestion,
    removeScheduleEntry,
    scheduleEntries,
    selectedMockTests,
    setAiQuestionTypeCounts,
    setDuration,
    setExamTitle,
    setQuestions,
    setReportReleaseMode,
    setScheduleEntries,
    setSelectedMockTests,
    setShowAIDialog,
    showAIDialog,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  }
}
