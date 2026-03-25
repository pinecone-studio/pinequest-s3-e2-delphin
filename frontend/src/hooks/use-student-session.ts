'use client'

import * as React from 'react'

type StudentSession = {
  studentId: string
  studentClass: string
  studentName: string
}

const EMPTY_SESSION: StudentSession = {
  studentId: '',
  studentClass: '',
  studentName: '',
}

let cachedSession: StudentSession = EMPTY_SESSION

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
    () => () => undefined,
    readStudentSession,
    () => EMPTY_SESSION,
  )
}
