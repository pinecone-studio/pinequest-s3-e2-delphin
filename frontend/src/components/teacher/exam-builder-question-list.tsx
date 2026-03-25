'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { NewQuestion, QuestionType } from '@/components/teacher/exam-builder-types'

export function ExamBuilderQuestionList({
  onAddQuestion,
  onRemoveQuestion,
  onUpdateOption,
  onUpdateQuestion,
  questions,
}: {
  onAddQuestion: (type: QuestionType) => void
  onRemoveQuestion: (id: string) => void
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void
  questions: NewQuestion[]
}) {
  return (
    <>
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-semibold">Question {index + 1}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {question.type.replace('-', ' ')}
                  </div>
                </div>
                <Badge variant="outline">{question.type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" value={question.points} onChange={(e) => onUpdateQuestion(question.id, { points: parseInt(e.target.value) || 0 })} className="w-20 h-8" />
                <span className="text-sm text-muted-foreground">points</span>
                <Button variant="ghost" size="sm" onClick={() => onRemoveQuestion(question.id)}>Remove</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder={`Write question ${index + 1}`} value={question.question} onChange={(e) => onUpdateQuestion(question.id, { question: e.target.value })} className="resize-none" />
            {question.type === 'multiple-choice' && question.options ? (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">{String.fromCharCode(65 + optionIndex)}</div>
                    <Input placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChange={(e) => onUpdateOption(question.id, optionIndex, e.target.value)} className="flex-1" />
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                  <Select value={question.correctAnswer} onValueChange={(value) => onUpdateQuestion(question.id, { correctAnswer: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={option || `Option ${String.fromCharCode(65 + optionIndex)}`}>
                          {String.fromCharCode(65 + optionIndex)}: {option || '(empty)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
            {question.type === 'true-false' ? (
              <div className="flex items-center gap-4">
                <Label className="text-sm text-muted-foreground">Correct Answer:</Label>
                <Select value={question.correctAnswer} onValueChange={(value) => onUpdateQuestion(question.id, { correctAnswer: value })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="True">True</SelectItem>
                    <SelectItem value="False">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {(question.type === 'short-answer' || question.type === 'essay') ? <div className="border-b border-dashed" /> : null}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground mb-3">Add Question</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('multiple-choice')}>Multiple Choice</Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('true-false')}>True/False</Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('short-answer')}>Short Answer</Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('essay')}>Essay</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
