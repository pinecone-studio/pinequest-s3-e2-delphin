'use client'

import * as React from 'react'

type StudentSession = {
  studentId: string
  studentClass: string
  studentName: string
}

const STUDENT_SESSION_EVENT = 'student-session-change'

const EMPTY_SESSION: StudentSession = {
  studentId: '',
  studentClass: '',
  studentName: '',
}

let cachedSession: StudentSession = EMPTY_SESSION

function notifyStudentSessionChange() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(STUDENT_SESSION_EVENT))
}

function readStudentSession(): StudentSession {
  if (typeof window === 'undefined') {
    return EMPTY_SESSION
  }

  const nextSession = {
    studentId: localStorage.getItem('studentId') || '',
    studentClass: localStorage.getItem('studentClass') || '',
    studentName: localStorage.getItem('studentName') || '',
  }

  if (
    cachedSession.studentId === nextSession.studentId &&
    cachedSession.studentClass === nextSession.studentClass &&
    cachedSession.studentName === nextSession.studentName
  ) {
    return cachedSession
  }

  cachedSession = nextSession
  return cachedSession
}

export function useStudentSession() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      window.addEventListener('storage', onStoreChange)
      window.addEventListener(STUDENT_SESSION_EVENT, onStoreChange)

      return () => {
        window.removeEventListener('storage', onStoreChange)
        window.removeEventListener(STUDENT_SESSION_EVENT, onStoreChange)
      }
    },
    readStudentSession,
    () => EMPTY_SESSION,
  )
}

export { notifyStudentSessionChange }
