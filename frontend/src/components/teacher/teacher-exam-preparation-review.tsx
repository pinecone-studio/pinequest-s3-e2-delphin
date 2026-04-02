"use client";

import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";

export function TeacherExamPreparationReview({
  addQuestion,
  questions,
  removeQuestion,
  updateOption,
  updateQuestion,
}: {
  addQuestion: Parameters<typeof ExamBuilderQuestionList>[0]["onAddQuestion"];
  questions: Parameters<typeof ExamBuilderQuestionList>[0]["questions"];
  removeQuestion: Parameters<typeof ExamBuilderQuestionList>[0]["onRemoveQuestion"];
  updateOption: Parameters<typeof ExamBuilderQuestionList>[0]["onUpdateOption"];
  updateQuestion: Parameters<typeof ExamBuilderQuestionList>[0]["onUpdateQuestion"];
}) {
  return (
    <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
      <div className="space-y-4">
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[#303959]">Шалгалтын асуултуудыг нягтлах</h2>
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
              Асуулт сонгоход энд автоматаар нэмэгдэнэ.
            </div>
          ) : (
            <div className="space-y-4">
              <ExamBuilderQuestionList allowAddQuestion={false} onAddQuestion={addQuestion} onRemoveQuestion={removeQuestion} onUpdateOption={updateOption} onUpdateQuestion={updateQuestion} questions={questions} />
            </div>
          )}
        </div>
      </div>
    </TeacherSurfaceCard>
  );
}
