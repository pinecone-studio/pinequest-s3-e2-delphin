'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import type { MockTest } from '@/lib/mock-data'
import { demoTestContentById } from '@/lib/student-test-content'

export function StudentTestViewer({
  currentPage,
  onPageChange,
  onDownload,
  onPrint,
  test,
  zoom,
  onZoomChange,
}: {
  currentPage: number
  onPageChange: (page: number | ((page: number) => number)) => void
  onDownload: () => void
  onPrint: () => void
  test: MockTest
  zoom: number
  onZoomChange: (value: number) => void
}) {
  const content = demoTestContentById[test.id] ?? demoTestContentById.mt1
  const totalPages = content.pages.length + 1
  const pageQuestions = currentPage > 1 ? content.pages[currentPage - 2] ?? [] : []

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <span className="font-medium">{test.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Томруулах:</span>
            <Slider value={[zoom]} onValueChange={([value]) => onZoomChange(value)} min={50} max={200} step={10} className="w-24" />
            <span className="text-sm w-12">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>Татах</Button>
            <Button variant="outline" size="sm" onClick={onPrint}>Хэвлэх</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 border-r bg-muted/20 p-2 overflow-auto">
          <div className="space-y-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={currentPage === index + 1 ? 'w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors border-primary bg-primary/10 ring-2 ring-primary' : 'w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors hover:bg-muted'}
              >
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground mb-1">Хуудас</div>
                  <div className="font-medium">{index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/10 p-4">
          <div className="flex items-center gap-4 mb-4 sticky top-0 bg-background/80 backdrop-blur py-2 px-4 rounded-full border">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange((page) => page - 1)}>
              &larr; Өмнөх
            </Button>
            <span className="text-sm">Хуудас <strong>{currentPage}</strong> / <strong>{totalPages}</strong></span>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange((page) => page + 1)}>
              Дараах &rarr;
            </Button>
          </div>

          <Card className="bg-background shadow-lg p-8 transition-transform origin-top" style={{ width: `${595 * (zoom / 100)}px`, minHeight: `${842 * (zoom / 100)}px` }}>
            <div className="h-full flex flex-col" style={{ fontSize: `${zoom}%` }}>
              {currentPage === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-xl font-bold mb-2">{test.name}</h1>
                    <p className="text-muted-foreground">Хугацаа: {content.duration}</p>
                    <p className="text-muted-foreground">Нийт оноо: {content.totalMarks}</p>
                  </div>
                  <div className="border-t pt-6 space-y-4">
                    <h2 className="font-semibold">Заавар:</h2>
                    <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                      {content.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {pageQuestions.map((question, index) => (
                    <QuestionBlock
                      key={`${test.id}-${currentPage}-${index}`}
                      number={(currentPage - 2) * 3 + index + 1}
                      options={question.options}
                      text={question.text}
                    />
                  ))}
                </div>
              )}
              <div className="mt-auto text-center text-sm text-muted-foreground">
                Хуудас {currentPage} / {totalPages}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
function QuestionBlock({
  number,
  options,
  text,
}: {
  number: number
  options?: string[]
  text: string
}) {
  return (
    <div>
      <h3 className="font-medium mb-2">Асуулт {number}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
      {options ? (
        <div className="mt-2 ml-4 text-sm space-y-1">
          {options.map((option) => <p key={option}>{option}</p>)}
        </div>
      ) : (
        <div className="mt-2 border-b border-dashed h-12" />
      )}
    </div>
  )
}
