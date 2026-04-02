"use client";

function QuestionStatusIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.5331 6.66666C14.8376 8.16086 14.6206 9.71428 13.9183 11.0679C13.2161 12.4214 12.071 13.4934 10.6741 14.1049C9.27718 14.7164 7.71284 14.8305 6.24196 14.4282C4.77107 14.026 3.48255 13.1316 2.59127 11.8943C1.7 10.657 1.25984 9.15148 1.3442 7.62892C1.42856 6.10635 2.03234 4.65872 3.05486 3.52744C4.07737 2.39616 5.45681 1.64961 6.96313 1.4123C8.46946 1.17498 10.0116 1.46123 11.3324 2.22333"
        stroke="#00C853"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 7.33341L8 9.33341L14.6667 2.66675"
        stroke="#00C853"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PickQuestionHeader(props: {
  answered: boolean;
  index: number;
  meta: string;
  title: string;
}) {
  const { answered, index, meta, title } = props;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <div className="inline-flex h-[22px] shrink-0 items-center rounded-full bg-[#E6F2FF] px-3 text-[14px] font-semibold leading-[18px] text-[#007FFF] dark:bg-[#1B2959] dark:text-[#89C8FF]">
            Асуулт {index + 1}
          </div>
          <p className="truncate text-[16px] font-medium leading-[20px] text-[#566069] dark:text-[#9CADC7]">
            {meta}
          </p>
        </div>

        <div className={["mt-1 min-h-[22px] shrink-0 text-[14px] font-semibold leading-[18px]", answered ? "flex items-center gap-1.5 text-[#00C853] dark:text-[#62E28A]" : "inline-flex items-center text-[#89939C] dark:text-[#8FA0BB]"].join(" ")}>
          {answered ? <QuestionStatusIcon /> : null}
          <span>{answered ? "Хариулсан" : "Хариулаагүй"}</span>
        </div>
      </div>

      <h2 className="mt-[18px] text-[20px] font-semibold leading-[28px] text-[#293138] dark:text-[#F3F8FF]">
        {title}
      </h2>
    </div>
  );
}
