"use client";

function StatusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 4V8L10.6667 9.33333" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6818 14.6673 7.99992C14.6673 4.31802 11.6825 1.33325 8.00065 1.33325C4.31875 1.33325 1.33398 4.31802 1.33398 7.99992C1.33398 11.6818 4.31875 14.6666 8.00065 14.6666Z" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LegendRow(props: { color: string; outline?: boolean; label: string }) {
  const { color, outline = false, label } = props;

  return (
    <div className="flex items-center gap-2">
      <span className={`h-[14px] w-[14px] rounded-[4px] ${outline ? "border-2 bg-white" : ""}`} style={outline ? { borderColor: color } : { backgroundColor: color }} />
      <span className="text-[14px] leading-[17px] text-[#6F7982]">{label}</span>
    </div>
  );
}

function QuestionTile(props: { value: number; mode: "answered" | "current" | "empty" }) {
  const { value, mode } = props;
  const styles =
    mode === "answered"
      ? "border-[#00C853] bg-[#00C853] text-white"
      : mode === "current"
        ? "border-[#66AFFF] bg-[#EAF5FF] text-[#6F7982]"
        : "border-[#D8E9FB] bg-[#EAF5FF] text-[#6F7982]";

  return (
    <button type="button" className={`h-[42px] w-[42px] rounded-[8px] border text-[14px] font-medium leading-[17px] ${styles}`}>
      {value}
    </button>
  );
}

export function StudentExamProgressSidebar(props: {
  answeredCount: number;
  totalQuestions: number;
  completionPercent: number;
  unansweredCount: number;
  timerLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
  className?: string;
}) {
  const {
    answeredCount,
    totalQuestions,
    completionPercent,
    timerLabel,
    isSubmitting,
    onSubmit,
    className,
  } = props;
  const percent = Math.max(0, Math.min(completionPercent, 100));
  const currentQuestion = Math.min(answeredCount + 1, totalQuestions || 1);

  return (
    <aside
      className={[
        "w-[325px] max-w-full shrink-0 self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="space-y-5 overflow-y-auto pr-1 xl:max-h-[calc(100vh-48px)]">
        <div className="flex h-[51px] items-center justify-between rounded-[25.5px] border border-[#E6F2FF] bg-[#003366] px-5 shadow-[0_9px_4px_rgba(201,201,201,0.01),0_5px_3px_rgba(201,201,201,0.05),0_2px_2px_rgba(201,201,201,0.09),0_1px_1px_rgba(201,201,201,0.1)]">
          <div className="flex items-center gap-3 text-[#00C853]">
            <StatusIcon />
            <span className="text-[14px] font-semibold leading-[17px]">Үлдсэн хугацаа</span>
          </div>
          <span className="text-[18px] font-semibold leading-[22px] text-[#00C853]">{timerLabel}</span>
        </div>

        <div className="rounded-[12px] border border-[#E6F2FF] bg-white px-4 pb-6 pt-5 shadow-[0_9px_4px_rgba(201,201,201,0.01),0_5px_3px_rgba(201,201,201,0.05),0_2px_2px_rgba(201,201,201,0.09),0_1px_1px_rgba(201,201,201,0.1)]">
          <h2 className="text-[20px] font-semibold leading-[24px] text-[#001933]">Асуултын жагсаалт</h2>

          <div className="mt-5 flex items-center justify-between text-[14px] leading-[17px]">
            <span className="text-[#6F7982]">Хариулсан:</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#293138]">{answeredCount}/{totalQuestions}</span>
              <span className="font-semibold text-[#007FFF]">{Math.round(percent)}%</span>
            </div>
          </div>

          <div className="mt-3 h-[8px] w-[193px] rounded-full bg-[#E6F2FF]">
            <div className="h-full rounded-full bg-[#007FFF]" style={{ width: `${percent}%` }} />
          </div>

          <div className="mt-7 flex flex-wrap gap-[10px]">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const value = index + 1;
              const mode = value <= answeredCount ? "answered" : value === currentQuestion ? "current" : "empty";
              return <QuestionTile key={value} value={value} mode={mode} />;
            })}
          </div>

          <div className="mt-6 h-px w-full bg-[#EAF2FB]" />

          <div className="mt-5 space-y-3">
            <LegendRow color="#00C853" label="Хариулсан" />
            <LegendRow color="#EAF5FF" label="Хариулаагүй" />
            <LegendRow color="#66AFFF" outline label="Одоогийн асуулт" />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="mt-24 h-[51px] w-full rounded-[12px] bg-[#007FFF] text-[18px] font-medium text-[#E6F2FF] shadow-[0_9px_4px_rgba(201,201,201,0.01),0_5px_3px_rgba(201,201,201,0.05),0_2px_2px_rgba(201,201,201,0.09),0_1px_1px_rgba(201,201,201,0.1)] hover:bg-[#0D85FF] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Илгээж байна..." : "Шалгалт дуусгах"}
          </button>
        </div>
      </div>
    </aside>
  );
}
