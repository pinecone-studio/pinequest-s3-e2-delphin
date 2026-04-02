"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function CreateExamSubmitActions(props: {
  canSubmit: boolean;
  submitMode: "draft" | "ready" | "scheduled" | null;
  onSubmit: () => void;
}) {
  const { canSubmit, submitMode, onSubmit } = props;

  return (
    <div className="flex flex-wrap justify-end gap-3">
      <Button onClick={onSubmit} disabled={!canSubmit}>
        {submitMode === "ready" ? <Spinner className="mr-2" /> : null}
        Шалгалтаа хадгалах
      </Button>
    </div>
  );
}
