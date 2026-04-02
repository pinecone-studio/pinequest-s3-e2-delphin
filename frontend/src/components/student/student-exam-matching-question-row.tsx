"use client";

import { StudentExamOptionBadge } from "@/components/student/student-exam-question-shell";
import type {
  MatchingChoice,
  MatchingRow,
} from "@/components/student/student-exam-matching-question-utils";

function RowConnectorArrow() {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0 text-[#89939C]"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M1.1665 7H12.8332"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99951 1.1665L12.8328 6.99984L6.99951 12.8332"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RowChevron() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="#89939C"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MatchingQuestionRow(props: {
  choiceLabel: string;
  choices: MatchingChoice[];
  isAnswered: boolean;
  isOpen: boolean;
  onSelect: (choiceValue: string) => void;
  onToggle: () => void;
  optionIndex: number;
  row: MatchingRow;
  rowKey: string;
  selectedValue: string;
}) {
  const { choiceLabel, choices, isAnswered, isOpen, onSelect, onToggle } = props;
  const { optionIndex, row, rowKey, selectedValue } = props;

  return (
    <div className="rounded-[12px] border border-[#E6F2FF] bg-[#F5FAFF] px-6 py-4 md:min-h-[66px] md:py-0">
      <div className="flex min-h-[34px] items-center md:min-h-[66px]">
        <div className="space-y-3 sm:grid sm:w-[592px] sm:grid-cols-[34px_minmax(0,150px)_14px_340px] sm:items-center sm:gap-x-[18px] sm:gap-y-0 sm:space-y-0">
          <div className="flex min-w-0 items-center gap-[18px] sm:contents">
            <StudentExamOptionBadge
              value={String(optionIndex + 1)}
              active={isAnswered}
            />
            <span className="truncate text-[17px] font-medium leading-[21px] text-[#141A1F]">
              {row.left}
            </span>
          </div>

          <div className="hidden justify-center sm:flex">
            <RowConnectorArrow />
          </div>

          <div className="flex items-center gap-3 sm:contents">
            <div className="sm:hidden">
              <RowConnectorArrow />
            </div>

            <div className="relative w-full sm:w-[340px]">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={onToggle}
                className="flex min-h-[35px] w-full items-start justify-between rounded-[10px] border border-[#E6F2FF] bg-white px-3 py-[7px] text-left"
              >
                <span
                  title={choiceLabel || "Сонгох"}
                  className={[
                    "min-w-0 flex-1 whitespace-normal break-words pr-3 text-[15px] font-medium leading-[20px]",
                    isAnswered ? "text-[#007FFF]" : "text-[#89939C]",
                  ].join(" ")}
                >
                  {isAnswered ? choiceLabel : "Сонгох"}
                </span>
                <span className="ml-3 mt-1 shrink-0">
                  <RowChevron />
                </span>
              </button>

              {isOpen ? (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[10px] border border-[#566069] bg-white shadow-[0_10px_24px_rgba(41,49,56,0.14)]">
                  {choices.map((choice) => {
                    const isActive = selectedValue === choice.value;

                    return (
                      <button
                        key={`${rowKey}-${choice.value}`}
                        type="button"
                        onClick={() => onSelect(choice.value)}
                        className={[
                          "block min-h-[43px] w-full px-3 py-2 text-left text-[15px] font-medium leading-[20px]",
                          isActive ? "bg-[#2D6FD1] text-white" : "bg-white text-[#293138]",
                        ].join(" ")}
                      >
                        <span className="block whitespace-normal break-words">
                          {choice.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
