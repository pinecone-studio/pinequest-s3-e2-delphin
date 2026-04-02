"use client";

import type { ReactNode } from "react";

export function cardShadow() {
  return "0px 9px 4px rgba(201,201,201,0.01), 0px 5px 3px rgba(201,201,201,0.05), 0px 2px 2px rgba(201,201,201,0.09), 0px 1px 1px rgba(201,201,201,0.1)";
}

function LeadingStatusIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.5331 6.66666C14.8376 8.16086 14.6206 9.71428 13.9183 11.0679C13.2161 12.4214 12.071 13.4934 10.6741 14.1049C9.27718 14.7164 7.71284 14.8305 6.24196 14.4282C4.77107 14.026 3.48255 13.1316 2.59127 11.8943C1.7 10.657 1.25984 9.15148 1.3442 7.62892C1.42856 6.10635 2.03234 4.65872 3.05486 3.52744C4.07737 2.39616 5.45681 1.64961 6.96313 1.4123C8.46946 1.17498 10.0116 1.46123 11.3324 2.22333" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7.33341L8 9.33341L14.6667 2.66675" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StudentExamCardHeader(props: {
  index: number;
  meta: string;
  title: string;
  answered: boolean;
}) {
  const { index, meta, title, answered } = props;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="inline-flex h-[31px] shrink-0 items-center rounded-full bg-[#E6F2FF] px-4 text-[14px] font-semibold leading-[18px] text-[#007FFF]">
            Асуулт {index + 1}
          </div>
          <p className="truncate text-[16px] font-medium leading-[20px] text-[#6F7982]">
            {meta}
          </p>
        </div>

        <div className={answered ? "mt-1 inline-flex min-h-[31px] shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#00C853]" : "mt-1 inline-flex min-h-[31px] shrink-0 items-center text-[14px] font-semibold text-[#89939C]"}>
          {answered ? <LeadingStatusIcon /> : null}
          <span>{answered ? "Хариулсан" : "Хариулаагүй"}</span>
        </div>
      </div>

      <h2 className="mt-5 text-[20px] font-semibold leading-[28px] text-[#293138]">
        {title}
      </h2>
    </div>
  );
}

export function StudentExamCard(props: {
  index: number;
  meta: string;
  title: string;
  answered: boolean;
  children: ReactNode;
  compact?: boolean;
}) {
  const { index, meta, title, answered, children } = props;

  return (
    <section
      className="overflow-hidden rounded-[16px] border border-[#E6F2FF] bg-white"
      style={{ boxShadow: cardShadow() }}
    >
      <div className="px-7 pb-5 pt-6">
        <StudentExamCardHeader index={index} meta={meta} title={title} answered={answered} />
      </div>
      <div className="border-t border-[#EAF2FB] px-6 pb-6 pt-5">{children}</div>
    </section>
  );
}

export function StudentExamOptionBadge(props: { value: string; active?: boolean }) {
  const { value, active = false } = props;

  return (
    <span
      className={[
        "inline-flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border text-[14px] font-medium",
        active ? "border-[#007FFF] bg-[#007FFF] text-[#E6F2FF]" : "border-[#F0F3F5] bg-white text-[#566069]",
      ].join(" ")}
    >
      {value}
    </span>
  );
}
