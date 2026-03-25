"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useQuestionBankTests } from "@/hooks/use-question-bank-tests";

export default function StudentTestViewerPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const test = useQuestionBankTests().find((questionBankTest) => questionBankTest.id === testId);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 5;
  const questionNumber = (offset: number) => (currentPage - 1) * 3 + offset;

  if (!test) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Test not found</h1>
        <Link href="/student/question-bank">
          <Button className="mt-4">Back to Practice Materials</Button>
        </Link>
      </div>
    );
  }

  const handleDownload = () => alert(`Downloading ${test.fileName}...`);
  const handlePrint = () => window.print();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <Link href="/student/question-bank" className="text-sm text-muted-foreground hover:underline">
            &larr; Back
          </Link>
          <span className="font-medium">{test.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <Slider value={[zoom]} onValueChange={([value]) => setZoom(value)} min={50} max={200} step={10} className="w-24" />
            <span className="w-12 text-sm">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>Download</Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>Print</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 border-r bg-muted/20 p-2 overflow-auto">
          <div className="space-y-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors ${
                  currentPage === i + 1
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "hover:bg-muted"
                }`}
              >
                <div className="text-center">
                  <div className="mb-1 text-[10px] text-muted-foreground">Page</div>
                  <div className="font-medium">{i + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/10 p-4">
          <div className="flex items-center gap-4 mb-4 sticky top-0 bg-background/80 backdrop-blur py-2 px-4 rounded-full border">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
              &larr; Prev
            </Button>
            <span className="text-sm">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
              Next &rarr;
            </Button>
          </div>

          <Card
            className="bg-background shadow-lg p-8 transition-transform origin-top"
            style={{
              width: `${595 * (zoom / 100)}px`,
              minHeight: `${842 * (zoom / 100)}px`,
            }}
          >
            <div className="h-full flex flex-col" style={{ fontSize: `${zoom}%` }}>
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
                      <h3 className="font-medium mb-2">Question {questionNumber(1)}</h3>
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
                      <h3 className="font-medium mb-2">Question {questionNumber(2)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <div className="mt-2 ml-4 text-sm space-y-1">
                        <p>A) True</p>
                        <p>B) False</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Question {questionNumber(3)}</h3>
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
        </div>
      </div>
    </div>
  );
}
