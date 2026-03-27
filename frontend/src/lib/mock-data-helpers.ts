import {
  classes,
  examResults,
  exams,
  students,
  type Exam,
} from "@/lib/mock-data";

export const classSchedule = [
  {
    classId: "10A",
    day: "Даваа",
    time: "09:00-10:30",
    subject: "Математик",
  },
  {
    classId: "10A",
    day: "Лхагва",
    time: "09:00-10:30",
    subject: "Математик",
  },
  {
    classId: "10B",
    day: "Даваа",
    time: "14:00-15:30",
    subject: "Математик",
  },
  {
    classId: "10B",
    day: "Пүрэв",
    time: "14:00-15:30",
    subject: "Математик",
  },
  {
    classId: "10C",
    day: "Мягмар",
    time: "11:00-12:30",
    subject: "Математик",
  },
  {
    classId: "10C",
    day: "Баасан",
    time: "11:00-12:30",
    subject: "Математик",
  },
];

export const teacher = {
  id: "teacher1",
  name: "Амарбаясгалан",
  email: "amarbaysgalan@school.com",
  subject: "Математик",
};

export function getClassById(id: string) {
  return classes.find((courseClass) => courseClass.id === id);
}

export function getStudentById(id: string) {
  return students.find((student) => student.id === id);
}

export function getExamsForClass(classId: string) {
  return exams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === classId),
  );
}

export function getExamResults(examId: string, classId?: string) {
  const results = examResults.filter((result) => result.examId === examId);
  if (!classId) {
    return results;
  }

  const classStudentIds = students
    .filter((student) => student.classId === classId)
    .map((student) => student.id);

  return results.filter((result) => classStudentIds.includes(result.studentId));
}

export function getQuestionStats(examId: string) {
  const exam = exams.find((entry) => entry.id === examId);
  if (!exam) return [];

  const results = examResults.filter((result) => result.examId === examId);

  return exam.questions
    .map((question) => {
      const answers = results.flatMap((result) =>
        result.answers.filter((answer) => answer.questionId === question.id),
      );
      const correctCount = answers.filter((answer) => answer.isCorrect).length;
      const totalCount = answers.length;

      return {
        questionId: question.id,
        question: question.question,
        type: question.type,
        correctCount,
        totalCount,
        failRate:
          totalCount > 0 ? ((totalCount - correctCount) / totalCount) * 100 : 0,
      };
    })
    .sort((left, right) => right.failRate - left.failRate);
}

function getScheduleEndTime(date: string, time: string, duration: number) {
  const start = new Date(`${date}T${time}:00`);
  return new Date(start.getTime() + duration * 60 * 1000);
}

export function getExamReportReleaseDate(exam: Exam) {
  if (exam.reportReleaseMode === "immediately") {
    return null;
  }

  return exam.scheduledClasses.reduce<Date | null>((latest, schedule) => {
    const endTime = getScheduleEndTime(
      schedule.date,
      schedule.time,
      exam.duration,
    );
    if (!latest || endTime > latest) {
      return endTime;
    }

    return latest;
  }, null);
}

export function isExamReportAvailable(examId: string) {
  const exam = exams.find((entry) => entry.id === examId);
  if (!exam) {
    return false;
  }

  if (exam.reportReleaseMode === "immediately") {
    return true;
  }

  const releaseDate = getExamReportReleaseDate(exam);
  if (!releaseDate) {
    return false;
  }

  return new Date() >= releaseDate;
}
