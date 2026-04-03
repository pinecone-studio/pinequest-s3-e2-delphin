"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

export function AppRouteLoader() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(2,6,23,0.42)] backdrop-blur-[6px]">
      <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/15 bg-[rgba(10,18,54,0.78)] px-8 py-7 shadow-[0_24px_80px_rgba(2,6,23,0.48)]">
        <div className="relative flex h-[72px] w-[72px] items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#409CFF]/20 blur-[10px]" />
          <Image
            src={isDark ? "/edulphin-mark-dark.svg" : "/edulphin-mark.svg"}
            alt="Edulphin loading"
            width={52}
            height={52}
            priority
            className="relative h-[52px] w-[52px] animate-spin object-contain"
          />
        </div>
        <Image
          src={isDark ? "/edulphin-logo-dark-full.svg" : "/edulphin-logo-light.svg"}
          alt="Edulphin"
          width={150}
          height={40}
          priority
          className="h-auto w-[150px] object-contain"
        />
        <p className="text-center text-[14px] font-medium text-white/85">
          Түр хүлээнэ үү...
        </p>
      </div>
    </div>
  );
}
