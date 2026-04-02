"use client"

import { LockKeyhole } from "lucide-react"

type StudentReportLockedProps = {
  message: string
}

export function StudentReportLocked({ message }: StudentReportLockedProps) {
  return (
    <section className="rounded-[26px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,251,255,0.94)_100%)] p-6 shadow-[0_24px_54px_rgba(122,175,220,0.16)] backdrop-blur-sm dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,55,0.98)_0%,rgba(11,18,43,0.98)_100%)] dark:shadow-[0_20px_40px_rgba(2,6,23,0.3)]">
      <div className="flex max-w-xl flex-col items-center gap-4 py-10 text-center">
        <div className="rounded-full bg-[#edf6ff] p-4 text-[#4f9cf9] shadow-[0_10px_24px_rgba(79,156,249,0.12)] dark:bg-[#17305f] dark:text-[#8bc8ff] dark:shadow-[0_14px_28px_rgba(6,17,41,0.35)]">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-[31px] font-bold tracking-[-0.03em] text-[#003366] dark:text-[#f4f8ff]">Тайлан түгжээтэй</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f7982] dark:text-[#a9b7ca]">{message}</p>
        </div>
      </div>
    </section>
  )
}
