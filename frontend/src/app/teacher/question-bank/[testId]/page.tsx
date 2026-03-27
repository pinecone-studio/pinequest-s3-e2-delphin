"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StudentTestViewer } from "@/components/student/student-test-viewer"
import { mockTests } from "@/lib/mock-data"

export default function TestViewerPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const test = mockTests.find(t => t.id === testId)
  const [currentPage, setCurrentPage] = useState(1)

  if (!test) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <Link href="/teacher/question-bank">
          <Button className="mt-4">Асуултын сан руу буцах</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <Link href="/teacher/question-bank" className="text-sm text-muted-foreground hover:underline">
          &larr; Буцах
        </Link>
      </div>
      <StudentTestViewer
        currentPage={currentPage}
        onDownload={() => window.alert(`${test.fileName} файлыг татаж байна...`)}
        onPageChange={setCurrentPage}
        onPrint={() => window.print()}
        onZoomChange={() => {}}
        test={test}
        zoom={100}
      />
    </div>
  )
}
