"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

export function TeacherExamPreparationHeader() {
  return (
    <section className="space-y-3">
      <Link href="/teacher/exams" className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6f96] transition hover:text-[#314672]">
        <ArrowLeft className="h-4 w-4" />
        Шалгалтууд руу буцах
      </Link>
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,#fff7d6_0%,#ffe9a7_42%,#ffd8f5_100%)] text-[#7c5d00] shadow-[0_14px_28px_rgba(253,224,71,0.22)]">
          <ClipboardList className="h-6 w-6" strokeWidth={1.9} />
        </div>
        <div>
          <h1 className="text-[2.05rem] font-semibold tracking-[-0.04em] text-[#303959]">Шалгалтын бэлтгэх</h1>
          <p className="mt-1 text-sm leading-6 text-[#6f7898]">Асуултын сангаас сонгоод шалгалтын бүтэц, асуултуудаа бэлдэнэ. Хугацаа болон хуваарийг шалгалт эхлүүлэх шатанд оруулна.</p>
        </div>
      </div>
    </section>
  );
}
