'use client'

import { useState } from 'react'
import type { Exam } from '@/lib/mock-data'
import type { NewQuestion, QuestionType, ScheduleEntry } from '@/components/teacher/exam-builder-types'

function createQuestion(type: QuestionType, id: string): NewQuestion {
  return {
    id,
    type,
    question: '',
    points:
      type === 'essay' ? 15 : type === 'short-answer' ? 10 : type === 'true-false' ? 5 : 10,
    options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
    correctAnswer: type === 'true-false' ? 'True' : '',
  }
}

function createAiQuestions(
  mcCount: number,
  tfCount: number,
  shortCount: number,
): NewQuestion[] {
  const seed = Date.now()
  return [
    ...Array.from({ length: mcCount }, (_, index) =>
      createQuestion('multiple-choice', `ai-mc-${seed}-${index}`),
    ).map((question, index) => ({
      ...question,
      question: `AI Generated Multiple Choice Question ${index + 1}: What is the correct answer for this topic?`,
      options: [
        'Option A - First choice',
        'Option B - Second choice',
        'Option C - Third choice',
        'Option D - Fourth choice',
      ],
      correctAnswer: 'Option A - First choice',
    })),
    ...Array.from({ length: tfCount }, (_, index) =>
      createQuestion('true-false', `ai-tf-${seed}-${index}`),
    ).map((question, index) => ({
      ...question,
      question: `AI Generated True/False Question ${index + 1}: This statement about the topic is correct.`,
    })),
    ...Array.from({ length: shortCount }, (_, index) =>
      createQuestion('short-answer', `ai-sa-${seed}-${index}`),
    ).map((question, index) => ({
      ...question,
      question: `AI Generated Short Answer Question ${index + 1}: Briefly explain this concept.`,
      correctAnswer: 'Expected answer',
    })),
  ]
}

export function useExamBuilder() {
  const [examTitle, setExamTitle] = useState('')
  const [questions, setQuestions] = useState<NewQuestion[]>([])
  const [duration, setDuration] = useState(60)
  const [reportReleaseMode, setReportReleaseMode] =
    useState<Exam['reportReleaseMode']>('after-all-classes-complete')
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiMCCount, setAiMCCount] = useState(5)
  const [aiTFCount, setAiTFCount] = useState(3)
  const [aiShortCount, setAiShortCount] = useState(2)
  const [selectedMockTests, setSelectedMockTests] = useState<string[]>([])
  const [selectedAiSourceFiles, setSelectedAiSourceFiles] = useState<File[]>([])
  const [isAiSourceDragging, setIsAiSourceDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([])

  const addQuestion = (type: QuestionType) => {
    setQuestions((current) => [...current, createQuestion(type, `new-${Date.now()}`)])
  }

  const updateQuestion = (id: string, updates: Partial<NewQuestion>) => {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, ...updates } : question)),
    )
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
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setQuestions((current) => [
      ...current,
      ...createAiQuestions(aiMCCount, aiTFCount, aiShortCount),
    ])
    setIsGenerating(false)
    setShowAIDialog(false)
  }

  const addAiSourceFiles = (files: FileList | File[]) => {
    const nextFiles = Array.from(files).filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx'),
    )

    if (nextFiles.length === 0) {
      return
    }

    setSelectedAiSourceFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.size}`))
      const uniqueFiles = nextFiles.filter((file) => !seen.has(`${file.name}-${file.size}`))
      return [...current, ...uniqueFiles]
    })
  }

  const removeAiSourceFile = (fileName: string) => {
    setSelectedAiSourceFiles((current) => current.filter((file) => file.name !== fileName))
  }

  const addScheduleEntry = () => {
    setScheduleEntries((current) => [...current, { classId: '', date: '', time: '' }])
  }

  const updateScheduleEntry = (
    index: number,
    field: keyof ScheduleEntry,
    value: string,
  ) => {
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
    addQuestion,
    addScheduleEntry,
    aiMCCount,
    aiShortCount,
    aiTFCount,
    duration,
    examTitle,
    generateAIQuestions,
    addAiSourceFiles,
    isGenerating,
    isAiSourceDragging,
    questions,
    reportReleaseMode,
    removeQuestion,
    removeAiSourceFile,
    removeScheduleEntry,
    scheduleEntries,
    selectedAiSourceFiles,
    selectedMockTests,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
    setDuration,
    setExamTitle,
    setIsAiSourceDragging,
    setReportReleaseMode,
    setSelectedMockTests,
    setShowAIDialog,
    showAIDialog,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  }
}
