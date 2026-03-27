"use client"

import { type ChangeEvent, useState } from "react"
import { Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notifyStudentSessionChange } from "@/hooks/use-student-session"

const defaultBio = "Би ирээдүйд Дизайнер болно."
const storageKeys = { bio: "studentProfileBio", image: "studentProfileImage" } as const

type Props = { studentName: string }
type Profile = { name: string; bio: string; image: string }

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getStoredProfile(studentName: string): Profile {
  if (typeof window === "undefined") return { name: studentName, bio: defaultBio, image: "" }

  return {
    name: localStorage.getItem("studentName") || studentName,
    bio: localStorage.getItem(storageKeys.bio) || defaultBio,
    image: localStorage.getItem(storageKeys.image) || "",
  }
}

export function StudentDashboardProfileCard({ studentName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile>(() => getStoredProfile(studentName))
  const [draft, setDraft] = useState<Profile>(() => getStoredProfile(studentName))

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () =>
      setDraft((current) => ({ ...current, image: String(reader.result || "") }))
    reader.readAsDataURL(file)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) setDraft(profile)
    setIsOpen(open)
  }

  const handleSave = () => {
    const nextProfile = {
      name: draft.name.trim() || studentName,
      bio: draft.bio.trim() || defaultBio,
      image: draft.image,
    }

    localStorage.setItem("studentName", nextProfile.name)
    localStorage.setItem(storageKeys.bio, nextProfile.bio)
    if (nextProfile.image) localStorage.setItem(storageKeys.image, nextProfile.image)
    else localStorage.removeItem(storageKeys.image)

    notifyStudentSessionChange()
    setProfile(nextProfile)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="h-[100px] w-full max-w-[780px] rounded-[24px] border border-[#cfe5ff] bg-white p-[21px] shadow-[0_10px_24px_rgba(102,157,214,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-[21px]">
            <Avatar className="h-[60px] w-[60px] border-[3px] border-[#d6e8ff]">
              <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-[#68a8ff] text-lg font-bold text-white">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-sans text-[18px] font-semibold text-[#1f2937]">
                {profile.name}
              </p>
              <p className="mt-1 truncate font-sans text-[14px] italic text-[#5B646F]">
                &quot;{profile.bio}&quot;
              </p>
            </div>
          </div>

          <DialogTrigger asChild>
            <button
              type="button"
              className="rounded-full p-2 text-slate-700 transition hover:bg-[#edf5ff]"
              aria-label="Профайл засах"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="rounded-[24px] border-[#d8eaff] bg-white p-6 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Профайл засах</DialogTitle>
          <DialogDescription>
            Зураг, нэр, bio мэдээллээ student талдаа шинэчилнэ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-profile-image">Зураг</Label>
            <Input
              id="student-profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-name">Нэр</Label>
            <Input
              id="student-profile-name"
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-bio">Bio</Label>
            <Textarea
              id="student-profile-bio"
              value={draft.bio}
              onChange={(event) =>
                setDraft((current) => ({ ...current, bio: event.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Болих
          </Button>
          <Button type="button" onClick={handleSave}>
            Хадгалах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
