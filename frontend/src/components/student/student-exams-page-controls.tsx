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
        "flex h-8 w-[137px] cursor-pointer items-center justify-between rounded-full px-6 py-1 text-[14px] font-medium leading-5 transition",
        active
          ? "bg-[radial-gradient(123.22%_129.67%_at_100.89%_-5.6%,#FFFFFF_0%,#FEFEFF_100%)] text-[#141A1F] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:bg-[linear-gradient(180deg,#f8fbff_0%,#dce9ff_100%)] dark:text-[#0b1733]"
          : "text-[#F9FAFB] dark:text-[#d3dced]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium leading-[1.2]",
          active ? "bg-[#3399FF] text-white dark:bg-[#1b4f9c]" : "bg-white/10 text-[#A4ADB5] dark:text-[#8fa0bb]",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  )
}
