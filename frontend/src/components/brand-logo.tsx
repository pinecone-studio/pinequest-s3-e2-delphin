"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  textClassName?: string
}

export function BrandLogo({
  className,
  imageClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full p-1">
        <Image
          src="/dolphin-logo.png"
          alt="ExamFlow dolphin logo"
          fill
          sizes="40px"
          className={cn("object-contain", imageClassName)}
          priority
        />
      </span>
      <span className={cn("text-base font-semibold tracking-tight text-[#16324F]", textClassName)}>
        ExamFlow LMS
      </span>
    </span>
  )
}
