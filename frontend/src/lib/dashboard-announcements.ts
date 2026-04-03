"use client"

export type DashboardAnnouncement = {
  authorImage?: string
  authorName?: string
  authorSubject?: string
  id: string
  classId: string
  createdAt: string
  message: string
}

const STORAGE_KEY = "teacherDashboardAnnouncements"
const EVENT_NAME = "teacher-dashboard-announcements-change"

function readAllAnnouncements() {
  if (typeof window === "undefined") return [] as DashboardAnnouncement[]
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as DashboardAnnouncement[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getDashboardAnnouncements(targetClassId?: string) {
  const announcements = readAllAnnouncements()
  if (!targetClassId) return announcements
  return announcements.filter((item) => item.classId === "all" || item.classId === targetClassId)
}

export function subscribeDashboardAnnouncements(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined
  window.addEventListener("storage", onChange)
  window.addEventListener(EVENT_NAME, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(EVENT_NAME, onChange)
  }
}

export function saveDashboardAnnouncement(input: { classId: string; message: string }) {
  if (typeof window === "undefined") return
  const nextItem: DashboardAnnouncement = {
    authorImage:
      localStorage.getItem("teacherProfileImage") ||
      localStorage.getItem("teacherAvatar") ||
      localStorage.getItem("teacherImage") ||
      "",
    authorName: localStorage.getItem("teacherName") || "",
    authorSubject: localStorage.getItem("teacherSubject") || "",
    id: crypto.randomUUID(),
    classId: input.classId,
    createdAt: new Date().toISOString(),
    message: input.message.trim(),
  }
  const nextItems = [nextItem, ...readAllAnnouncements()].slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems))
  window.dispatchEvent(new Event(EVENT_NAME))
}
