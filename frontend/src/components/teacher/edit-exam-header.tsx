"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function EditExamHeader({
  isDeleting,
  isLoading,
  onDeleteClick,
  onOpenAIDialog,
}: {
  isDeleting: boolean;
  isLoading: boolean;
  onDeleteClick: () => void;
  onOpenAIDialog: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link
          href="/teacher/exams"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Шалгалтууд руу буцах
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Товлогдсон шалгалтыг засах</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onOpenAIDialog}>
          AI ашиглан асуулт бэлтгэх
        </Button>
        <Button
          variant="destructive"
          onClick={onDeleteClick}
          disabled={isDeleting || isLoading}
        >
          {isDeleting ? (
            <Spinner className="mr-2" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Шалгалт устгах
        </Button>
      </div>
    </div>
  );
}
