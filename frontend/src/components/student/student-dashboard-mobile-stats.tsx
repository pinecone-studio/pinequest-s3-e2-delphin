"use client"

import Image from "next/image"

export type StudentMobileStatCard = {
  detail: string
  iconPath: string
  label: string
  value: string
}

export function StudentDashboardMobileStats(props: { items: StudentMobileStatCard[] }) {
  const { items } = props

  if (items.length === 0) return null

  return (
    <div className="scrollbar-hide mt-4 flex w-[358px] max-w-full gap-[10px] overflow-x-auto sm:hidden">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex h-[64px] shrink-0 items-center gap-2 rounded-[16px] border border-[rgba(132,157,204,0.24)] bg-[linear-gradient(180deg,#0E173F_0%,#0B1235_100%)] px-[10px] py-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_22px_rgba(5,12,38,0.18)] dark:border-[rgba(132,157,204,0.24)] dark:bg-[linear-gradient(180deg,#0E173F_0%,#0B1235_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_22px_rgba(5,12,38,0.18)] ${item.label === "Энэ 7 хоногт" ? "w-[138px]" : "w-[167px]"}`}
        >
          <Image
            src={item.iconPath}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain opacity-90 brightness-[1.05]"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[10px] leading-[1.15] text-[rgba(255,255,255,0.58)]">
              {item.label}
            </p>
            <div className="mt-1 flex flex-wrap items-end gap-x-1 gap-y-0.5">
              <p className="text-[15px] font-semibold leading-none tracking-[-0.02em] text-[#F7FAFF]">
                {item.value}
              </p>
              <p className="text-[10px] font-medium leading-none text-[#4AA8FF]">
                {item.detail}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
