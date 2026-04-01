"use client"

import { type ChangeEvent, useCallback, useEffect, useState } from "react"
import { notifyStudentSessionChange } from "@/hooks/use-student-session"
import { deleteUpload, listUploads, uploadFile } from "@/lib/uploads-api"

const fallbackBio = "Би ирээдүйд Дизайнер болно."

const studentDefaultBios: Record<string, string> = {
  "Бат-Оргил.Э": "Шалгалтын урсгал, интерфэйсийг нягталж буй шүүгчийн дэмо хэрэглэгч.",
  "Эрдэнэгомбо.М": "Хариу өгөх явц болон тайлангийн туршлагыг шалгаж буй шүүгчийн профайл.",
  "Анар.Т": "Сурагчийн нэвтрэлт, шалгалт эхлүүлэх алхмуудыг турших шүүгч.",
  "Болор.Э": "Шалгалтын харагдац, ойлгомжтой байдлыг ажиглаж буй шүүгчийн дэмо профайл.",
  "Буяндэлгэр.Т": "Дашбоард болон шалгалтын урсгалын хэрэглээг туршиж буй шүүгч.",
  "Өсөхбаяр.Ж": "Оноо, тайлан, сурагчийн туршлагыг үнэлэхэд ашиглах дэмо хэрэглэгч.",
  "Түвшин.О": "Шалгалтын тогтвортой байдал, навигацыг шалгах шүүгчийн профайл.",
  "Өгөөмөр.Л": "Презентацын үеэр сурагчийн дүрээр шалгалт өгөх шүүгчийн профайл.",
}

export type StudentProfileState = {
  name: string
  bio: string
  image: string
  imageUploadId: string
}

function getNameStorageKey(studentId: string) {
  return `studentProfileName:${studentId || "anonymous"}`
}

function getBioStorageKey(studentId: string) {
  return `studentProfileBio:${studentId || "anonymous"}`
}

function getAvatarStorageKey(studentId: string) {
  return `studentProfileImageUploadId:${studentId || "anonymous"}`
}

function buildAvatarContentUrl(uploadId: string) {
  return `/api/backend/uploads/${uploadId}/content`
}

function getDefaultBio(studentName: string) {
  return studentDefaultBios[studentName] || fallbackBio
}

function getStoredProfile(studentId: string, studentName: string): StudentProfileState {
  const defaultBio = getDefaultBio(studentName)

  if (typeof window === "undefined") {
    return { name: studentName, bio: defaultBio, image: "", imageUploadId: "" }
  }

  const imageUploadId = studentId ? localStorage.getItem(getAvatarStorageKey(studentId)) || "" : ""
  const storedName = studentId ? localStorage.getItem(getNameStorageKey(studentId)) || "" : ""
  const storedBio = studentId ? localStorage.getItem(getBioStorageKey(studentId)) || "" : ""

  return {
    name: storedName || studentName,
    bio: storedBio || defaultBio,
    image: imageUploadId ? buildAvatarContentUrl(imageUploadId) : "",
    imageUploadId,
  }
}

export function useStudentDashboardProfile(studentId: string, studentName: string) {
  const [profile, setProfile] = useState<StudentProfileState>(() => getStoredProfile(studentId, studentName))
  const [draft, setDraft] = useState<StudentProfileState>(() => getStoredProfile(studentId, studentName))
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const defaultBio = getDefaultBio(studentName)

  const persistProfile = useCallback((nextProfile: StudentProfileState) => {
    if (studentId) {
      localStorage.setItem(getNameStorageKey(studentId), nextProfile.name)
      localStorage.setItem(getBioStorageKey(studentId), nextProfile.bio)
    }

    localStorage.setItem("studentName", nextProfile.name)

    if (studentId && nextProfile.imageUploadId) {
      localStorage.setItem(getAvatarStorageKey(studentId), nextProfile.imageUploadId)
    } else if (studentId) {
      localStorage.removeItem(getAvatarStorageKey(studentId))
    }

    notifyStudentSessionChange()
    setProfile(nextProfile)
  }, [studentId])

  useEffect(() => {
    const nextProfile = getStoredProfile(studentId, studentName)
    setProfile(nextProfile)
    setDraft(nextProfile)
  }, [studentId, studentName])

  useEffect(() => {
    if (!studentId) return

    let isMounted = true

    const loadAvatar = async () => {
      try {
        const uploads = await listUploads(`student-avatars/${studentId}`)
        const latestAvatar = uploads[0]
        if (!isMounted || !latestAvatar) return

        const nextProfile = {
          ...getStoredProfile(studentId, studentName),
          image: buildAvatarContentUrl(latestAvatar.id),
          imageUploadId: latestAvatar.id,
        }

        persistProfile(nextProfile)
        setDraft(nextProfile)
      } catch (error) {
        console.warn("Failed to load student avatar from R2.", error)
      }
    }

    void loadAvatar()
    return () => {
      isMounted = false
    }
  }, [persistProfile, studentId, studentName])

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, saveImmediately = false) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !studentId) return

    setIsUploadingImage(true)
    try {
      const nextUpload = await uploadFile({ file, fileName: file.name, folder: `student-avatars/${studentId}` })
      const nextProfile = { ...draft, image: buildAvatarContentUrl(nextUpload.id), imageUploadId: nextUpload.id }

      setDraft(nextProfile)

      if (profile.imageUploadId && profile.imageUploadId !== nextUpload.id) {
        try {
          await deleteUpload(profile.imageUploadId)
        } catch (error) {
          console.warn("Failed to delete previous student avatar from R2.", error)
        }
      }

      if (saveImmediately) persistProfile(nextProfile)
    } catch (error) {
      console.warn("Failed to upload student avatar to R2.", error)
    } finally {
      setIsUploadingImage(false)
    }
  }

  return { defaultBio, draft, isUploadingImage, persistProfile, profile, setDraft, handleImageChange }
}
