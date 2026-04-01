"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CreateExamPageHeader({ onOpenAi }: { onOpenAi?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Шалгалтууд руу буцах
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Шинэ шалгалт үүсгэх</h1>
      </div>
      {onOpenAi ? <Button onClick={onOpenAi}>AI ашиглан асуулт бэлтгэх</Button> : null}
    </div>
  )
}
