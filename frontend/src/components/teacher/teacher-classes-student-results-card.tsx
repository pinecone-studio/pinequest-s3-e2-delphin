"use client";

import { useEffect, useMemo, useState } from "react";
import { StudentResultDialog } from "@/components/teacher/teacher-classes-student-result-dialog";
import { StudentResultRow } from "@/components/teacher/teacher-classes-student-result-row";
import { normalizeSubjectLabel } from "@/components/teacher/teacher-classes-student-results-utils";
import type { StudentExamResult } from "@/lib/teacher-classes-side-panel-data";
import type { TeacherExam } from "@/lib/teacher-exams";
import { teachers } from "@/lib/mock-data";
import { CalendarDays, Clock3, FileText } from "lucide-react";

export function TeacherClassesStudentResultsCard(props: {
  className: string;
  date: string;
  results: StudentExamResult[];
  selectedExam: TeacherExam | null;
  time: string;
}) {
  const { className, date, results, selectedExam, time } = props;
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [teacherSubject, setTeacherSubject] = useState(() => teachers[0]?.subject ?? "");

  useEffect(() => {
    const storedSubject = window.localStorage.getItem("teacherSubject")?.trim();
    if (storedSubject) {
      setTeacherSubject(storedSubject);
    }
  }, []);

  useEffect(() => {
    if (selectedStudentId && !results.some((result) => result.studentId === selectedStudentId)) {
      setSelectedStudentId(null);
    }
  }, [results, selectedStudentId]);

  const selectedResult = useMemo(
    () => results.find((result) => result.studentId === selectedStudentId) ?? null,
    [results, selectedStudentId],
  );

  return (
    <>
      <section className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">Шалгалтын дүн</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#a6b0c5]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
            {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
            Өнөөдөр · {time}
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
            {selectedExam?.title ?? "Шалгалт"}
          </span>
        </div>

        <p className="mt-4 text-[15px] font-medium text-[#6b77a4]">{className} сурагчдын шалгалтын дүн</p>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {results.map((result) => (
            <StudentResultRow
              key={result.studentId}
              result={result}
              onClick={() => setSelectedStudentId(result.studentId)}
            />
          ))}
        </div>
      </section>

      <StudentResultDialog
        open={Boolean(selectedResult)}
        result={selectedResult}
        selectedExam={selectedExam}
        subjectLabel={normalizeSubjectLabel(teacherSubject)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedStudentId(null);
          }
        }}
      />
    </>
  );
}
