"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

export function BrandLogo({
  className,
  imageClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-[6px] whitespace-nowrap", className)}>
      <Image
        src="/huurhun.svg"
        alt="Edulphin logo"
        width={41}
        height={45}
        className={cn("h-[45.1px] w-[40.5px] shrink-0 object-contain", imageClassName)}
        priority
      />
      <span className={cn("flex flex-col", textClassName)}>
        <span
          className="bg-[linear-gradient(90deg,#339CFE_0%,#62CBFF_100%)] bg-clip-text text-[28px] font-light leading-none tracking-[0.02em] text-transparent"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          EDULPHIN
        </span>
        <span
          className="mt-1 bg-[linear-gradient(90deg,#339CFE_0%,#62CBFF_100%)] bg-clip-text text-[9px] font-light uppercase tracking-[0.28em] leading-none text-transparent"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          DIVE·INTO·LEARNING
        </span>
      </span>
    </span>
  );
}
