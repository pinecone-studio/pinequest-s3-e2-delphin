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
          &larr; Back to Exams
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit Scheduled Exam</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onOpenAIDialog}>
          Prepare Questions with AI
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
          Delete Exam
        </Button>
      </div>
    </div>
  );
}
