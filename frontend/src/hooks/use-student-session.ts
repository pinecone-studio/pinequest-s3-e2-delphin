import { useSyncExternalStore } from "react";

const STUDENT_SESSION_EVENT = "student-session-change";

type StudentSession = {
  studentClass: string;
  studentId: string;
  studentName: string;
};

const emptyStudentSession: StudentSession = {
  studentClass: "",
  studentId: "",
  studentName: "",
};

let cachedStudentSession = emptyStudentSession;

function readStudentSession(): StudentSession {
  return {
    studentClass: localStorage.getItem("studentClass") ?? "",
    studentId: localStorage.getItem("studentId") ?? "",
    studentName: localStorage.getItem("studentName") ?? "",
  };
}

function getStudentSessionSnapshot(): StudentSession {
  if (typeof window === "undefined") {
    return emptyStudentSession;
  }

  const nextStudentSession = readStudentSession();
  const hasChanged =
    nextStudentSession.studentClass !== cachedStudentSession.studentClass ||
    nextStudentSession.studentId !== cachedStudentSession.studentId ||
    nextStudentSession.studentName !== cachedStudentSession.studentName;

  if (hasChanged) {
    cachedStudentSession = nextStudentSession;
  }

  return cachedStudentSession;
}

function subscribeToStudentSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(STUDENT_SESSION_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(STUDENT_SESSION_EVENT, handleChange);
  };
}

export function notifyStudentSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  cachedStudentSession = readStudentSession();
  window.dispatchEvent(new Event(STUDENT_SESSION_EVENT));
}

export function useStudentSession() {
  return useSyncExternalStore(
    subscribeToStudentSession,
    getStudentSessionSnapshot,
    () => emptyStudentSession,
  );
}
