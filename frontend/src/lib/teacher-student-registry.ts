import { classes as baseClasses } from "@/lib/mock-data"
import type { Class, Student } from "@/lib/mock-data-types"
import { requestBackendJson } from "@/lib/backend-fetch"

const TEACHER_STUDENT_REGISTRY_KEY = "teacherStudentRegistry"

export type TeacherStudentRegistrationInput = {
  classId: string
  name: string
  registerNumber: string
  birthDate: string
  school: string
  classLabel: string
  studentCode: string
  guardianPhone: string
  email: string
}

type StoredStudentRegistration = TeacherStudentRegistrationInput & {
  password: string
}

function canUseStorage() {
  return typeof window !== "undefined"
}

function readStoredRegistrations() {
  if (!canUseStorage()) return [] as StoredStudentRegistration[]

  try {
    const raw = window.localStorage.getItem(TEACHER_STUDENT_REGISTRY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredStudentRegistration[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStoredRegistrations(entries: StoredStudentRegistration[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(TEACHER_STUDENT_REGISTRY_KEY, JSON.stringify(entries))
}

function toStudent(entry: StoredStudentRegistration): Student {
  return {
    id: entry.studentCode,
    name: entry.name,
    email: entry.email,
    password: entry.password,
    classId: entry.classId,
  }
}

export function getTeacherManagedClasses() {
  const stored = readStoredRegistrations()
  return mergeTeacherManagedStudents(baseClasses, stored.map(toStudent))
}

export async function registerTeacherStudent(input: TeacherStudentRegistrationInput) {
  const password = input.registerNumber.slice(-8) || input.studentCode || "student123"
  const newEntry: StoredStudentRegistration = {
    ...input,
    password,
  }

  const existing = readStoredRegistrations().filter(
    (entry) => entry.studentCode !== newEntry.studentCode && entry.email !== newEntry.email,
  )
  const nextEntries = [...existing, newEntry]
  writeStoredRegistrations(nextEntries)

  try {
    await requestBackendJson("/students", {
      method: "POST",
      body: {
        id: newEntry.studentCode,
        studentId: newEntry.studentCode,
        code: newEntry.studentCode,
        name: newEntry.name,
        registerNumber: newEntry.registerNumber,
        birthDate: newEntry.birthDate,
        school: newEntry.school,
        classId: newEntry.classId,
        classLabel: newEntry.classLabel,
        guardianPhone: newEntry.guardianPhone,
        email: newEntry.email,
        password,
      },
      fallbackMessage: "Сурагчийн бүртгэлийг backend дээр хадгалж чадсангүй.",
    })
  } catch {
    // Keep the local registration even if a backend student endpoint is unavailable.
  }

  return mergeTeacherManagedStudents(baseClasses, nextEntries.map(toStudent))
}

function mergeTeacherManagedStudents(classList: Class[], managedStudents: Student[]) {
  return classList.map((classItem) => {
    const mergedStudents = [
      ...classItem.students,
      ...managedStudents.filter((student) => student.classId === classItem.id),
    ]

    const dedupedStudents = mergedStudents.filter(
      (student, index, array) =>
        array.findIndex(
          (candidate) => candidate.id === student.id || candidate.email === student.email,
        ) === index,
    )

    return {
      ...classItem,
      students: dedupedStudents,
    }
  })
}
