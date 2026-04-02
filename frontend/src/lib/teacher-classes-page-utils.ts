import type { Class } from "@/lib/mock-data-types"
import { isMatchingDemoClassId } from "@/lib/teacher-class-detail"
import type { TeacherExam } from "@/lib/teacher-exams"

export function getPreferredClassId(classList: Class[], examList: TeacherExam[]) {
  const classWithCompletedExams = classList.find((classItem) =>
    examList.some(
      (exam) =>
        exam.status === "completed" &&
        exam.scheduledClasses.some((schedule) => isMatchingDemoClassId(schedule.classId, classItem.id)),
    ),
  )

  return classWithCompletedExams?.id ?? classList[0]?.id ?? ""
}
