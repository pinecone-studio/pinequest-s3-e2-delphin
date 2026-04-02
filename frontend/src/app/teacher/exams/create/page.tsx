"use client";

import { TeacherExamPreparationFlow } from "@/components/teacher/teacher-exam-preparation-flow";
import { TeacherPageShell } from "@/components/teacher/teacher-page-primitives";

export default function CreateExamPage() {
  return (
    <TeacherPageShell className="space-y-5">
      <TeacherExamPreparationFlow showStandaloneHeader />
    </TeacherPageShell>
  );
}
