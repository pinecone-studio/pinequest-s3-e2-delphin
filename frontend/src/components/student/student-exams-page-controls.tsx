type SegmentedTabProps = {
  active: boolean
  count: number
  label: string
  onClick: () => void
}

export function SegmentedTab(props: SegmentedTabProps) {
  const { active, count, label, onClick } = props

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-8 w-[137px] cursor-pointer items-center justify-center rounded-full px-[18px] py-1 text-[14px] font-medium leading-5 transition sm:justify-between",
        active
          ? "bg-[#1864FB] text-[#F5FAFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:bg-[#3399FF] dark:text-[#F5FAFF] dark:shadow-none"
          : "text-[#F9FAFB] dark:text-[#D7E0ED]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "hidden h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium leading-[1.2] sm:flex",
          active
            ? "bg-white/20 text-white dark:bg-white/10 dark:text-[#F3F8FF]"
            : "bg-white/10 text-[#A4ADB5] dark:bg-white/10 dark:text-[#8FA0BB]",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  )
}
