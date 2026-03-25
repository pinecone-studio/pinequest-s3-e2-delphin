export type TeacherPersona = {
  id: string;
  name: string;
  subject: string;
  email: string;
};

export type StudentPersona = {
  id: string;
  name: string;
  classId: string;
  email: string;
};

export const teacherPersonas: TeacherPersona[] = [
  { id: "teacher-math", name: "Math Teacher", subject: "Mathematics", email: "math@school.com" },
  { id: "teacher-english", name: "English Teacher", subject: "English", email: "english@school.com" },
];

export const studentPersonas: StudentPersona[] = [
  { id: "s1", name: "Lucy", classId: "10A", email: "lucy@school.com" },
  { id: "s6", name: "David", classId: "10B", email: "david@school.com" },
];

export const defaultTeacherPersona = teacherPersonas[0];
export const defaultStudentPersona = studentPersonas[0];

const studentDisplayMap: Record<string, Pick<StudentPersona, "email" | "name">> = {
  s1: { name: "Lucy", email: "lucy@school.com" },
  s6: { name: "David", email: "david@school.com" },
};

export function persistTeacherSession(teacher: TeacherPersona) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("teacherId", teacher.id);
  localStorage.setItem("teacherName", teacher.name);
  localStorage.setItem("teacherSubject", teacher.subject);
}

export function persistStudentSession(student: StudentPersona) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("studentId", student.id);
  localStorage.setItem("studentName", student.name);
  localStorage.setItem("studentClass", student.classId);
}

export function getTeacherPersonaById(id: string) {
  return teacherPersonas.find((teacher) => teacher.id === id) ?? defaultTeacherPersona;
}

export function getDisplayStudentName(studentId: string, fallback = "Unknown student") {
  return studentDisplayMap[studentId]?.name ?? fallback;
}

export function getDisplayStudentEmail(studentId: string, fallback = "") {
  return studentDisplayMap[studentId]?.email ?? fallback;
}
