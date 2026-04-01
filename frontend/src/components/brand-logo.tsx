"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  textClassName?: string
}

export function BrandLogo({ className, imageClassName, textClassName }: BrandLogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <span className={cn("inline-flex h-[50px] w-[190px] items-center gap-[8px]", className)}>
      {isDark ? (
        <>
          <span className="relative h-[45px] w-[42px] shrink-0">
            <Image src="/edulphin-mark-dark.svg" alt="Edulphin logo" fill sizes="42px" className={cn("object-contain", imageClassName)} priority />
          </span>
          <span className={cn("flex min-w-0 flex-1 flex-col justify-center leading-none", textClassName)}>
            <span className="relative h-[21px] w-[122px]">
              <Image src="/edulphin-wordmark-dark.svg" alt="Edulphin" fill sizes="122px" className="object-contain object-left" priority />
            </span>
            <span className="relative mt-[5px] h-[7px] w-[122px]">
              <Image src="/edulphin-tagline-dark.svg" alt="Dive into learning" fill sizes="122px" className="object-contain object-left" priority />
            </span>
          </span>
        </>
      ) : (
        <>
          <span className="relative h-[45.1px] w-[40.51px] shrink-0">
            <Image src="/edulphin-mark.svg" alt="Edulphin logo" fill sizes="40.51px" className={cn("object-contain", imageClassName)} priority />
          </span>
          <span className={cn("flex min-w-0 flex-1 flex-col justify-center leading-none", textClassName)}>
            <span
              className="block bg-[linear-gradient(90deg,#339CFE_0%,#62CBFF_100%)] bg-clip-text text-[28px] font-light leading-[1] tracking-[0.02em] text-transparent"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              EDULPHIN
            </span>
            <span
              className="mt-[6px] block whitespace-nowrap bg-[linear-gradient(90deg,#339CFE_0%,#62CBFF_100%)] bg-clip-text text-[9px] font-light uppercase leading-[1] tracking-[0.32em] text-transparent"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              DIVE INTO LEARNING
            </span>
          </span>
        </>
      )}
    </span>
  )
}
