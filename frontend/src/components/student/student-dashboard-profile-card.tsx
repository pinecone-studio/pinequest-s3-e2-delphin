"use client"

import { useRef, useState } from "react"
import { Camera, Pencil } from "lucide-react"
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
import { useStudentDashboardProfile } from "@/hooks/use-student-dashboard-profile"

type StudentDashboardProfileCardProps = {
  studentId: string
  studentName: string
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
  studentId,
  studentName,
}: StudentDashboardProfileCardProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { defaultBio, draft, handleImageChange, isUploadingImage, persistProfile, profile, setDraft } =
    useStudentDashboardProfile(studentId, studentName)

  const handleOpenChange = (open: boolean) => {
    if (open) setDraft(profile)
    setIsOpen(open)
  }

  const handleSave = () => {
    persistProfile({
      name: draft.name.trim() || studentName,
      bio: draft.bio.trim() || defaultBio,
      image: draft.image,
      imageUploadId: draft.imageUploadId,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="h-[102px] w-full rounded-[20px] border border-[#DCE8F3] bg-white p-[21px] shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:max-w-[900px]">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleImageChange(event, true)}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-end gap-4">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="group relative shrink-0 cursor-pointer rounded-full disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Профайлын зураг сонгох"
              disabled={isUploadingImage}
            >
              <Avatar className="h-[58px] w-[58px] border border-[#E3EDF6] p-[1px] shadow-sm transition group-hover:brightness-95 dark:border-[rgba(224,225,226,0.08)]">
                <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
                <AvatarFallback className="bg-[#D8E9FF] text-lg font-bold text-[#4E87C7] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#d8e7ff]">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-[#213047]/0 text-white transition group-hover:bg-[#213047]/35">
                <Camera className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </span>
            </button>

            <div className="min-w-0">
              <p className="truncate font-sans text-[24px] font-semibold leading-[29px] text-[#2F3845] dark:text-[#edf4ff]">
                {profile.name}
              </p>
              <p className="mt-1 truncate font-sans text-[14px] font-normal italic leading-[17px] text-[#667284] dark:text-[#aab7cb]">
                &quot;{profile.bio}&quot;
              </p>
              {isUploadingImage ? (
                <p className="mt-1 text-[12px] font-medium text-[#4A9DFF]">Зураг R2 рүү хадгалж байна...</p>
              ) : null}
            </div>
          </div>

          <DialogTrigger asChild>
            <button
              type="button"
              className="cursor-pointer rounded-full p-2 text-[#7B8797] transition hover:bg-[#F4F8FC] dark:text-[#c5d0e0] dark:hover:bg-[linear-gradient(156deg,rgba(8,14,46,0.82)_28%,rgba(30,36,63,0.56)_91%)]"
              aria-label="Профайл засах"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="rounded-[24px] border-[#d8eaff] bg-white p-6 dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(127deg,rgba(6,11,38,0.92)_18%,rgba(12,18,44,0.86)_58%,rgba(26,31,55,0.72)_100%)] dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Профайл засах</DialogTitle>
          <DialogDescription>Зураг, нэр, bio мэдээллээ student талдаа шинэчилнэ.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-profile-image">Зураг</Label>
            <Input
              id="student-profile-image"
              type="file"
              accept="image/*"
              onChange={(event) => void handleImageChange(event, true)}
              disabled={isUploadingImage}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-name">Нэр</Label>
            <Input
              id="student-profile-name"
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-profile-bio">Bio</Label>
            <Textarea
              id="student-profile-bio"
              value={draft.bio}
              onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
              className="cursor-pointer"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer">
            Болих
          </Button>
          <Button type="button" onClick={handleSave} disabled={isUploadingImage} className="cursor-pointer">
            Хадгалах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
