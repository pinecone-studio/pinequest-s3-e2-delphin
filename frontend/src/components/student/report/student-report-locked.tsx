"use client"

import { LockKeyhole } from "lucide-react"

type StudentReportLockedProps = {
  message: string
}

export function StudentReportLocked({ message }: StudentReportLockedProps) {
  return (
    <section className="rounded-[28px] border border-[#d8eaff] bg-white p-6 shadow-[0_16px_40px_rgba(102,157,214,0.09)]">
      <div className="flex max-w-xl flex-col items-center gap-4 py-12 text-center">
        <div className="rounded-full bg-[#edf6ff] p-4 text-[#4f9cf9]">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Тайлан түгжээтэй</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">{message}</p>
        </div>
      </div>
    </section>
  )
}
