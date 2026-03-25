import { useSyncExternalStore } from "react";

const TEACHER_SESSION_EVENT = "teacher-session-change";

type TeacherSession = {
  teacherId: string;
  teacherName: string;
  teacherSubject: string;
};

const emptyTeacherSession: TeacherSession = {
  teacherId: "",
  teacherName: "",
  teacherSubject: "",
};

let cachedTeacherSession = emptyTeacherSession;

function readTeacherSession(): TeacherSession {
  return {
    teacherId: localStorage.getItem("teacherId") ?? "",
    teacherName: localStorage.getItem("teacherName") ?? "",
    teacherSubject: localStorage.getItem("teacherSubject") ?? "",
  };
}

function getTeacherSessionSnapshot() {
  if (typeof window === "undefined") {
    return emptyTeacherSession;
  }

  const nextTeacherSession = readTeacherSession();
  const hasChanged =
    nextTeacherSession.teacherId !== cachedTeacherSession.teacherId ||
    nextTeacherSession.teacherName !== cachedTeacherSession.teacherName ||
    nextTeacherSession.teacherSubject !== cachedTeacherSession.teacherSubject;

  if (hasChanged) {
    cachedTeacherSession = nextTeacherSession;
  }

  return cachedTeacherSession;
}

function subscribeToTeacherSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(TEACHER_SESSION_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(TEACHER_SESSION_EVENT, onStoreChange);
  };
}

export function notifyTeacherSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  cachedTeacherSession = readTeacherSession();
  window.dispatchEvent(new Event(TEACHER_SESSION_EVENT));
}

export function useTeacherSession() {
  return useSyncExternalStore(
    subscribeToTeacherSession,
    getTeacherSessionSnapshot,
    () => emptyTeacherSession,
  );
}
