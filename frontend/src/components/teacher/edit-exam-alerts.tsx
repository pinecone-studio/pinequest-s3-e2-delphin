"use client";

import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EditExamAlerts({
  loadError,
  submissionError,
}: {
  loadError: string | null;
  submissionError: string | null;
}) {
  return (
    <>
      {loadError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Шалгалтыг ачаалж чадсангүй</AlertTitle>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      ) : null}
      {submissionError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Хадгалж чадсангүй</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
