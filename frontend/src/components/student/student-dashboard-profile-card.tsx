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

const STORAGE_KEYS = {
  bio: "studentProfileBio",
  image: "studentProfileImage",
} as const

const defaultBio = "Би ирээдүйд Дизайнер болно."

type StudentDashboardProfileCardProps = {
  studentName: string
}

type ProfileState = {
  name: string
  bio: string
  image: string
}

function getStoredProfile(studentName: string): ProfileState {
  if (typeof window === "undefined") {
    return { name: studentName, bio: defaultBio, image: "" }
  }

  return {
    name: localStorage.getItem("studentName") || studentName,
    bio: localStorage.getItem(STORAGE_KEYS.bio) || defaultBio,
    image: localStorage.getItem(STORAGE_KEYS.image) || "",
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function StudentDashboardProfileCard({
  studentName,
}: StudentDashboardProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileState>(() => getStoredProfile(studentName))
  const [draft, setDraft] = useState<ProfileState>(() => getStoredProfile(studentName))

  const handleOpenChange = (open: boolean) => {
    if (open) setDraft(profile)
    setIsOpen(open)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setDraft((current) => ({ ...current, image: String(reader.result || "") }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    const nextProfile = {
      name: draft.name.trim() || studentName,
      bio: draft.bio.trim() || defaultBio,
      image: draft.image,
    }

    localStorage.setItem("studentName", nextProfile.name)
    localStorage.setItem(STORAGE_KEYS.bio, nextProfile.bio)
    if (nextProfile.image) localStorage.setItem(STORAGE_KEYS.image, nextProfile.image)
    else localStorage.removeItem(STORAGE_KEYS.image)

    notifyStudentSessionChange()
    setProfile(nextProfile)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="w-full rounded-[20px] border border-[#DCE8F3] bg-white px-[18px] py-[20px] shadow-[0_6px_24px_rgba(114,144,179,0.10)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-end gap-4">
            <Avatar className="h-[58px] w-[58px] border border-[#E3EDF6] p-[1px] shadow-sm">
              <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-[#D8E9FF] text-lg font-bold text-[#4E87C7]">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-sans text-[24px] font-semibold leading-[29px] text-[#2F3845]">
                {profile.name}
              </p>
              <p className="mt-1 truncate font-sans text-[14px] font-normal italic leading-[17px] text-[#667284]">
                &quot;{profile.bio}&quot;
              </p>
            </div>
          </div>

          <DialogTrigger asChild>
            <button
              type="button"
              className="rounded-full p-2 text-[#7B8797] transition hover:bg-[#F4F8FC]"
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
          <DialogDescription>Зураг, нэр, bio мэдээллээ student талдаа шинэчилнэ.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-profile-image">Зураг</Label>
            <Input id="student-profile-image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-name">Нэр</Label>
            <Input
              id="student-profile-name"
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-bio">Bio</Label>
            <Textarea
              id="student-profile-bio"
              value={draft.bio}
              onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
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
