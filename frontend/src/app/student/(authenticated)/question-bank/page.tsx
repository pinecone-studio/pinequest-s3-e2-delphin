"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockTests } from "@/lib/mock-data"
import { teacher } from "@/lib/mock-data-helpers"

// In a real app, this would be a list of teachers
const teachers = [teacher]

export default function StudentQuestionBankPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")

  const filteredTests = selectedTeacher 
    ? mockTests.filter(t => t.teacherId === selectedTeacher)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Асуултын Сан</h1>
        <p className="text-muted-foreground">Багшийн байршуулсан жишиг шалгалтуудыг эндээс үзнэ</p>
      </div>

      {/* Teacher Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Багш Сонгох</CardTitle>
          <CardDescription>Жишиг шалгалтуудыг харах багшаа сонгоно уу</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Багш сонгох" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} - {t.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Mock Tests */}
      {selectedTeacher ? (
        filteredTests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Энэ багшид хараахан жишиг шалгалт алга
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <Link key={test.id} href={`/student/question-bank/${test.id}`}>
                <Card className="h-full cursor-pointer hover:border-foreground transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    <CardDescription>Оруулсан огноо: {test.uploadedAt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{test.fileType.toUpperCase()}</Badge>
                      <span className="text-sm text-muted-foreground">{test.fileName}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Жишиг шалгалтуудыг харахын тулд багшаа сонгоно уу
          </CardContent>
        </Card>
      )}
    </div>
  )
}
