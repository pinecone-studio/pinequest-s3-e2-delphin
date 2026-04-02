"use client"

import { type ChangeEvent, useCallback, useEffect, useState } from "react"
import { notifyStudentSessionChange } from "@/hooks/use-student-session"
import { deleteUpload, listUploads, uploadFile } from "@/lib/uploads-api"

const fallbackBio = "Би ирээдүйд Дизайнер болно."

const legacyJudgeDefaultBios: Record<string, string> = {
  "Бат-Оргил.Э": "Шалгалтын урсгал, интерфэйсийг нягталж буй шүүгчийн дэмо хэрэглэгч.",
  "Эрдэнэгомбо.М": "Хариу өгөх явц болон тайлангийн туршлагыг шалгаж буй шүүгчийн профайл.",
  "Анар.Т": "Сурагчийн нэвтрэлт, шалгалт эхлүүлэх алхмуудыг турших шүүгч.",
  "Болор.Э": "Шалгалтын харагдац, ойлгомжтой байдлыг ажиглаж буй шүүгчийн дэмо профайл.",
  "Буяндэлгэр.Т": "Дашбоард болон шалгалтын урсгалын хэрэглээг туршиж буй шүүгч.",
  "Өсөхбаяр.Ж": "Оноо, тайлан, сурагчийн туршлагыг үнэлэхэд ашиглах дэмо хэрэглэгч.",
  "Түвшин.О": "Шалгалтын тогтвортой байдал, навигацыг шалгах шүүгчийн профайл.",
  "Өгөөмөр.Л": "Презентацын үеэр сурагчийн дүрээр шалгалт өгөх шүүгчийн профайл.",
}

const studentDefaultBios: Record<string, string> = {
  "Бат-Оргил.Э": "Би ирээдүйд Deputy Director Officer болмоор байна.",
  "Эрдэнэгомбо.М": "Би ирээдүйд CTO for Education болмоор байна.",
  "Анар.Т": "Би ирээдүйд Business Development Manager болмоор байна.",
  "Билгүүндөл.Б": "Би ирээдүйд Software Engineer болмоор байна.",
  "Буяндэлгэр.Т": "Би ирээдүйд Digital Product Development Manager болмоор байна.",
  "Өсөхбаяр.Ж": "Би ирээдүйд Chief Product Officer болмоор байна.",
  "Түвшин.О": "Би ирээдүйд Chief Technology Officer болмоор байна.",
  "Өгөөмөр.Л": "Би ирээдүйд Engineering Manager болмоор байна.",
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

function getLegacyDefaultBio(studentName: string) {
  return legacyJudgeDefaultBios[studentName] || ""
}

function getStoredProfile(studentId: string, studentName: string): StudentProfileState {
  const defaultBio = getDefaultBio(studentName)

  if (typeof window === "undefined") {
    return { name: studentName, bio: defaultBio, image: "", imageUploadId: "" }
  }

  const imageUploadId = studentId ? localStorage.getItem(getAvatarStorageKey(studentId)) || "" : ""
  const rawStoredName = studentId ? localStorage.getItem(getNameStorageKey(studentId)) || "" : ""
  const rawStoredBio = studentId ? localStorage.getItem(getBioStorageKey(studentId)) || "" : ""
  const legacyDefaultBio = getLegacyDefaultBio(studentName)
  const storedName =
    studentId === "judge4" && rawStoredName === "Болор.Э" ? studentName : rawStoredName
  const storedBio =
    rawStoredBio === legacyDefaultBio || rawStoredBio === legacyJudgeDefaultBios["Болор.Э"]
      ? defaultBio
      : rawStoredBio

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
      const previousUploadId = profile.imageUploadId
      const nextUpload = await uploadFile({ file, fileName: file.name, folder: `student-avatars/${studentId}` })
      const nextProfile = { ...draft, image: buildAvatarContentUrl(nextUpload.id), imageUploadId: nextUpload.id }

      setDraft(nextProfile)
      if (saveImmediately) persistProfile(nextProfile)

      if (previousUploadId && previousUploadId !== nextUpload.id) {
        try {
          await deleteUpload(previousUploadId)
        } catch (error) {
          console.warn("Failed to delete previous student avatar from R2.", error)
        }
      }
    } catch (error) {
      console.warn("Failed to upload student avatar to R2.", error)
    } finally {
      setIsUploadingImage(false)
    }
  }

  return { defaultBio, draft, isUploadingImage, persistProfile, profile, setDraft, handleImageChange }
}
