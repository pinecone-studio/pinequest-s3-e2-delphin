"use client";

import type { ReactNode } from "react";

export const cardClassName =
  "flex w-full justify-between gap-3 rounded-2xl border border-[#E6F2FF] bg-[#F5FAFF] p-[17px] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] dark:backdrop-blur-[60px] dark:shadow-none";

export const actionButtonClassName =
  "h-[38px] min-w-[124px] rounded-xl px-6 text-[12px] font-medium leading-[1.2]";

export const darkPrimaryActionButtonClassName =
  "dark:border-[#007FFF] dark:bg-[#007FFF] dark:text-[#E6F2FF] dark:shadow-none dark:hover:bg-[#007FFF]";

export function ExamCardTop(props: {
  action: ReactNode;
  badge: ReactNode;
  icon: ReactNode;
  subtitle: ReactNode;
  title: string;
}) {
  const { action, badge, icon, subtitle, title } = props;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl">
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start gap-5">
            <h3 className="text-[18px] font-semibold leading-[22px] text-[#141A1F] dark:text-[#F5FAFF]">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle}
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}
