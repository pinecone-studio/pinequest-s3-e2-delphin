"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StudentTestViewer } from "@/components/student/student-test-viewer"
import { mockTests } from "@/lib/mock-data"

export default function StudentTestViewerPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const test = mockTests.find(t => t.id === testId)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  if (!test) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <Link href="/student/question-bank">
          <Button className="mt-4">Асуултын Сан руу Буцах</Button>
        </Link>
      </div>
    )
  }

  const handleDownload = () => {
    // In real app, this would download the actual file
    alert(`${test.fileName} файлыг татаж байна...`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="mb-3">
        <Link href="/student/question-bank" className="text-sm text-muted-foreground hover:underline">
          &larr; Буцах
        </Link>
      </div>
      <StudentTestViewer
        currentPage={currentPage}
        onDownload={handleDownload}
        onPageChange={setCurrentPage}
        onPrint={handlePrint}
        onZoomChange={setZoom}
        test={test}
        zoom={zoom}
      />
    </div>
  )
}
