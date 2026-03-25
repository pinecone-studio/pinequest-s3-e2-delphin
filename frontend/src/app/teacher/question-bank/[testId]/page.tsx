"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockTests } from "@/lib/mock-data"

export default function TestViewerPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const test = mockTests.find(t => t.id === testId)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5 // Mock page count

  if (!test) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Test not found</h1>
        <Link href="/teacher/question-bank">
          <Button className="mt-4">Back to Question Bank</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <Link href="/teacher/question-bank" className="text-sm text-muted-foreground hover:underline">
            &larr; Back
          </Link>
          <span className="font-medium">{test.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download
          </Button>
          <Button variant="outline" size="sm">
            Print
          </Button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/10 p-4">
        {/* Page Navigation */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>

        {/* A4 Page Mock */}
        <Card className="w-full max-w-[595px] aspect-[1/1.414] bg-background shadow-lg p-8">
          <div className="h-full flex flex-col">
            {currentPage === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold mb-2">{test.name}</h1>
                  <p className="text-muted-foreground">Duration: 60 minutes</p>
                  <p className="text-muted-foreground">Total Marks: 100</p>
                </div>
                <div className="border-t pt-6 space-y-4">
                  <h2 className="font-semibold">Instructions:</h2>
                  <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Read all questions carefully before answering</li>
                    <li>Write your answers clearly and legibly</li>
                    <li>Show all working for calculation questions</li>
                    <li>Check your answers before submitting</li>
                  </ul>
                </div>
                <div className="mt-auto text-center text-sm text-muted-foreground">
                  Page 1 of {totalPages}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Question {(currentPage - 1) * 3 + 1}</h3>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="mt-2 ml-4 text-sm space-y-1">
                      <p>A) Option one</p>
                      <p>B) Option two</p>
                      <p>C) Option three</p>
                      <p>D) Option four</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Question {(currentPage - 1) * 3 + 2}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <div className="mt-2 ml-4 text-sm space-y-1">
                      <p>A) True</p>
                      <p>B) False</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Question {(currentPage - 1) * 3 + 3}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
                    </p>
                    <div className="mt-2 border-b border-dashed h-12"></div>
                  </div>
                </div>
                <div className="mt-auto text-center text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Page Thumbnails */}
        <div className="flex items-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-14 border rounded text-xs flex items-center justify-center transition-colors ${
                currentPage === i + 1 ? 'border-primary bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
