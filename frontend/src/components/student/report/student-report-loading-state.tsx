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
                Тайланг бэлдэж байна
              </h1>
              <p className="max-w-[260px] text-sm leading-6 text-slate-600 sm:max-w-md dark:text-[#a9b7ca]">
                Таны илгээсэн хариултыг шалгаж, тайлангийн хуудасанд шилжүүлж
                байна. Түр хүлээнэ үү.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
