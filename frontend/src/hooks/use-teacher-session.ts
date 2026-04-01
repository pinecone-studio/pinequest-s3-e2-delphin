'use client'

import * as React from 'react'

type TeacherSession = {
  teacherEmail: string
  teacherId: string
  teacherName: string
  teacherSubject: string
}

const TEACHER_SESSION_EVENT = 'teacher-session-change'

const EMPTY_SESSION: TeacherSession = {
  teacherEmail: '',
  teacherId: '',
  teacherName: '',
  teacherSubject: '',
}

let cachedSession: TeacherSession = EMPTY_SESSION

function notifyTeacherSessionChange() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(TEACHER_SESSION_EVENT))
}

function readTeacherSession(): TeacherSession {
  if (typeof window === 'undefined') {
    return EMPTY_SESSION
  }

  const nextSession = {
    teacherEmail: localStorage.getItem('teacherEmail') || '',
    teacherId: localStorage.getItem('teacherId') || '',
    teacherName: localStorage.getItem('teacherName') || '',
    teacherSubject: localStorage.getItem('teacherSubject') || '',
  }

  if (
    cachedSession.teacherEmail === nextSession.teacherEmail &&
    cachedSession.teacherId === nextSession.teacherId &&
    cachedSession.teacherName === nextSession.teacherName &&
    cachedSession.teacherSubject === nextSession.teacherSubject
  ) {
    return cachedSession
  }

  cachedSession = nextSession
  return cachedSession
}

export function useTeacherSession() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      window.addEventListener('storage', onStoreChange)
      window.addEventListener(TEACHER_SESSION_EVENT, onStoreChange)

      return () => {
        window.removeEventListener('storage', onStoreChange)
        window.removeEventListener(TEACHER_SESSION_EVENT, onStoreChange)
      }
    },
    readTeacherSession,
    () => EMPTY_SESSION,
  )
}

export { notifyTeacherSessionChange }
