"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { classes, mockTests, type ExamQuestion } from "@/lib/mock-data"

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'

interface NewQuestion extends Omit<ExamQuestion, 'id'> {
  id: string
}

export default function CreateExamPage() {
  const router = useRouter()
  const [examTitle, setExamTitle] = useState("")
  const [questions, setQuestions] = useState<NewQuestion[]>([])
  const [duration, setDuration] = useState(60)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  
  // AI Generation form
  const [aiQuestionCount, setAiQuestionCount] = useState(10)
  const [aiMCCount, setAiMCCount] = useState(5)
  const [aiTFCount, setAiTFCount] = useState(3)
  const [aiShortCount, setAiShortCount] = useState(2)
  const [selectedMockTests, setSelectedMockTests] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Schedule form
  const [scheduleEntries, setScheduleEntries] = useState<{classId: string, date: string, time: string}[]>([])

  const addQuestion = (type: QuestionType) => {
    const newQuestion: NewQuestion = {
      id: `new-${Date.now()}`,
      type,
      question: '',
      points: type === 'essay' ? 15 : type === 'short-answer' ? 10 : type === 'true-false' ? 5 : 10,
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true-false' ? 'True' : '',
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<NewQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const generateAIQuestions = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const generated: NewQuestion[] = []
    
    // Generate MC questions
    for (let i = 0; i < aiMCCount; i++) {
      generated.push({
        id: `ai-mc-${Date.now()}-${i}`,
        type: 'multiple-choice',
        question: `AI Generated Multiple Choice Question ${i + 1}: What is the correct answer for this topic?`,
        options: ['Option A - First choice', 'Option B - Second choice', 'Option C - Third choice', 'Option D - Fourth choice'],
        correctAnswer: 'Option A - First choice',
        points: 10,
      })
    }
    
    // Generate TF questions
    for (let i = 0; i < aiTFCount; i++) {
      generated.push({
        id: `ai-tf-${Date.now()}-${i}`,
        type: 'true-false',
        question: `AI Generated True/False Question ${i + 1}: This statement about the topic is correct.`,
        correctAnswer: 'True',
        points: 5,
      })
    }
    
    // Generate Short Answer questions
    for (let i = 0; i < aiShortCount; i++) {
      generated.push({
        id: `ai-sa-${Date.now()}-${i}`,
        type: 'short-answer',
        question: `AI Generated Short Answer Question ${i + 1}: Briefly explain this concept.`,
        correctAnswer: 'Expected answer',
        points: 10,
      })
    }
    
    setQuestions([...questions, ...generated])
    setIsGenerating(false)
    setShowAIDialog(false)
  }

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, { classId: '', date: '', time: '' }])
  }

  const updateScheduleEntry = (index: number, field: string, value: string) => {
    const updated = [...scheduleEntries]
    updated[index] = { ...updated[index], [field]: value }
    setScheduleEntries(updated)
  }

  const removeScheduleEntry = (index: number) => {
    setScheduleEntries(scheduleEntries.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // In a real app, this would save to the database
    console.log({
      title: examTitle,
      questions,
      duration,
      scheduleEntries,
    })
    alert('Exam created successfully! Students will be notified.')
    router.push('/teacher/exams')
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const questionCounts = {
    'multiple-choice': questions.filter(q => q.type === 'multiple-choice').length,
    'true-false': questions.filter(q => q.type === 'true-false').length,
    'short-answer': questions.filter(q => q.type === 'short-answer').length,
    'essay': questions.filter(q => q.type === 'essay').length,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Exams
          </Link>
          <h1 className="text-2xl font-bold mt-2">Create New Exam</h1>
        </div>
        <Button onClick={() => setShowAIDialog(true)}>
          Prepare Questions with AI
        </Button>
      </div>

      {/* Exam Title */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Untitled Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
          />
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{question.type}</Badge>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
                  className="w-20 h-8"
                />
                <span className="text-sm text-muted-foreground">points</span>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Question ${index + 1}`}
              value={question.question}
              onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
              className="resize-none"
            />
            
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      value={option}
                      onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                  <Select
                    value={question.correctAnswer}
                    onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((opt, i) => (
                        <SelectItem key={i} value={opt || `Option ${String.fromCharCode(65 + i)}`}>
                          {String.fromCharCode(65 + i)}: {opt || '(empty)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {question.type === 'true-false' && (
              <div className="flex items-center gap-4">
                <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                <Select
                  value={question.correctAnswer}
                  onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="True">True</SelectItem>
                    <SelectItem value="False">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(question.type === 'short-answer' || question.type === 'essay') && (
              <div className="border-b border-dashed" />
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add Question Buttons */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground mb-3">Add Question</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => addQuestion('multiple-choice')}>
              Multiple Choice
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('true-false')}>
              True/False
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('short-answer')}>
              Short Answer
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('essay')}>
              Essay
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{questionCounts['multiple-choice']}</div>
              <div className="text-sm text-muted-foreground">Multiple Choice</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{questionCounts['true-false']}</div>
              <div className="text-sm text-muted-foreground">True/False</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              className="w-24"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <Label>Schedule Exam</Label>
              <Button variant="outline" size="sm" onClick={addScheduleEntry}>
                Add Class Schedule
              </Button>
            </div>
            
            {scheduleEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled yet</p>
            ) : (
              <div className="space-y-3">
                {scheduleEntries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Select
                      value={entry.classId}
                      onValueChange={(value) => updateScheduleEntry(index, 'classId', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateScheduleEntry(index, 'date', e.target.value)}
                      className="w-40"
                    />
                    <Input
                      type="time"
                      value={entry.time}
                      onChange={(e) => updateScheduleEntry(index, 'time', e.target.value)}
                      className="w-32"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeScheduleEntry(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push('/teacher/exams')}>
          Save as Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!examTitle || questions.length === 0 || scheduleEntries.length === 0}
        >
          Create & Notify Students
        </Button>
      </div>

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Questions with AI</DialogTitle>
            <DialogDescription>
              Configure how many questions of each type to generate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select content from Question Bank</Label>
              <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
                {mockTests.map(test => (
                  <div key={test.id} className="flex items-center gap-2">
                    <Checkbox
                      id={test.id}
                      checked={selectedMockTests.includes(test.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMockTests([...selectedMockTests, test.id])
                        } else {
                          setSelectedMockTests(selectedMockTests.filter(id => id !== test.id))
                        }
                      }}
                    />
                    <label htmlFor={test.id} className="text-sm">{test.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Multiple Choice</Label>
                <Input
                  type="number"
                  value={aiMCCount}
                  onChange={(e) => setAiMCCount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>True/False</Label>
                <Input
                  type="number"
                  value={aiTFCount}
                  onChange={(e) => setAiTFCount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Short Answer</Label>
                <Input
                  type="number"
                  value={aiShortCount}
                  onChange={(e) => setAiShortCount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Questions</Label>
                <div className="h-9 flex items-center px-3 border rounded-md bg-muted">
                  {aiMCCount + aiTFCount + aiShortCount}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)}>
              Cancel
            </Button>
            <Button onClick={generateAIQuestions} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
