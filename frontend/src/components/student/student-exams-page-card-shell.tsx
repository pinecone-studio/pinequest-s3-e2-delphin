"use client";

import type { ReactNode } from "react";

export const cardClassName =
  "flex h-[180px] w-full justify-between gap-3 rounded-2xl border border-[#E6F2FF] bg-[#F5FAFF] p-4 shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] dark:backdrop-blur-[60px] dark:shadow-none sm:h-auto sm:p-[17px]";

export const actionButtonClassName =
  "h-[46px] w-full rounded-[12px] px-6 text-[12px] font-medium leading-[1.2] sm:h-[38px] sm:min-w-[124px] sm:w-auto sm:rounded-xl";

export const darkPrimaryActionButtonClassName =
  "dark:border-[rgba(224,225,226,0.28)] dark:bg-[#1864FB] dark:text-[#F9FAFB] dark:shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)] dark:hover:bg-[#1864FB]";

export function ExamCardTop(props: {
  action: ReactNode;
  badge: ReactNode;
  icon: ReactNode;
  subtitle: ReactNode;
  title: string;
}) {
  const { action, badge, icon, subtitle, title } = props;

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-start justify-between gap-3 sm:contents">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-2xl sm:h-[60px] sm:w-[60px]">
            {icon}
          </div>
          <div className="shrink-0 sm:hidden">{badge}</div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-3 sm:flex-wrap sm:gap-5">
            <h3 className="text-[16px] font-semibold leading-[1.2] text-[#141A1F] dark:text-[#F5FAFF] sm:text-[18px] sm:leading-[22px]">
              {title}
            </h3>
            <div className="hidden sm:block">{badge}</div>
          </div>
          {subtitle}
        </div>
      </div>
      <div className="w-full shrink-0 sm:w-auto">{action}</div>
    </div>
  );
}
