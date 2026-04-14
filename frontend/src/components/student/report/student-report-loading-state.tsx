"use client";

import { Spinner } from "@/components/ui/spinner";

export function StudentReportLoadingState() {
  return (
    <div className="min-h-screen bg-transparent px-4 py-4 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1380px] dark:max-w-[1692px]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] px-5 py-6 shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px] dark:border-[rgba(148,176,255,0.12)] dark:bg-[linear-gradient(180deg,rgba(11,19,48,0.86)_0%,rgba(8,14,35,0.76)_100%)] dark:shadow-[inset_0_1px_0_rgba(138,165,255,0.08)] dark:backdrop-blur-[14px] md:px-7 md:py-7">
          <div className="relative mx-auto flex min-h-[420px] max-w-[358px] flex-col items-center justify-center text-center dark:max-w-[1088px] sm:max-w-[980px]">
            <div className="rounded-full bg-sky-100 p-4 text-sky-700 dark:bg-[#17305f] dark:text-[#8bc8ff]">
              <Spinner className="size-6" />
            </div>
            <div className="mt-4 space-y-2">
              <h1 className="text-[20px] font-bold text-slate-900 sm:text-2xl dark:text-[#f4f8ff]">
                Ð¢Ð°Ð¹Ð»Ð°Ð½Ð³ Ð±ÑÐ»Ð´ÑÐ¶ Ð±Ð°Ð¹Ð½Ð°
              </h1>
              <p className="max-w-[260px] text-sm leading-6 text-slate-600 sm:max-w-md dark:text-[#a9b7ca]">
                Ð¢Ð°Ð½Ñ‹ Ð¸Ð»Ð³ÑÑÑÑÐ½ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‹Ð³ ÑˆÐ°Ð»Ð³Ð°Ð¶, Ñ‚Ð°Ð¹Ð»Ð°Ð½Ð³Ð¸Ð¹Ð½ Ñ…ÑƒÑƒÐ´ÑÐ°Ð½Ð´ ÑˆÐ¸Ð»Ð¶Ò¯Ò¯Ð»Ð¶ Ð±Ð°Ð¹Ð½Ð°. Ð¢Ò¯Ñ€ Ñ…Ò¯Ð»ÑÑÐ½Ñ Ò¯Ò¯.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
