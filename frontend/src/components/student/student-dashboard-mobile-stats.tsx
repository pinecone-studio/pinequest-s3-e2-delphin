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
          className={`flex min-h-[64px] shrink-0 items-center gap-2 rounded-[16px] border border-[#DCE8F3] bg-[#F3F9FF] px-[10px] py-[10px] shadow-[0_6px_20px_rgba(114,144,179,0.08)] dark:border-transparent dark:bg-transparent dark:shadow-none ${item.label === "Энэ 7 хоногт" ? "w-[138px]" : "w-[167px]"}`}
        >
          <Image src={item.iconPath} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[10px] leading-[1.15] text-[#7A8698] dark:text-[#9eacc3]">{item.label}</p>
            <div className="mt-1 flex flex-wrap items-end gap-x-1 gap-y-0.5">
              <p className="text-[15px] font-semibold leading-none tracking-[-0.02em] text-[#39424E] dark:text-[#edf4ff]">{item.value}</p>
              <p className="text-[10px] font-medium leading-none text-[#4A9DFF]">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
