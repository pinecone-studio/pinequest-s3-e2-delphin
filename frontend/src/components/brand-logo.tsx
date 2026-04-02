"use client"

import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  textClassName?: string
}

export function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <span className={cn("relative inline-flex h-[51px] w-[190px] shrink-0", className)}>
      <span
        className={cn(
          "absolute inset-0 motion-safe:transform-gpu motion-safe:transition-[opacity,filter] motion-safe:duration-300 motion-safe:ease-in-out",
          isDark ? "opacity-0" : "opacity-100",
        )}
        aria-hidden={isDark}
      >
        <Image
          src="/edulphin-logo-light.svg"
          alt="Edulphin logo"
          fill
          sizes="190px"
          className={cn("object-contain object-left", imageClassName)}
          priority
        />
      </span>

      <span
        className={cn(
          "absolute inset-0 motion-safe:transform-gpu motion-safe:transition-[opacity,filter] motion-safe:duration-300 motion-safe:ease-in-out",
          isDark ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!isDark}
      >
        <Image
          src="/edulphin-logo-dark-full.svg"
          alt="Edulphin logo"
          fill
          sizes="190px"
          className={cn("object-contain object-left", imageClassName)}
          priority
        />
      </span>
    </span>
  )
}
