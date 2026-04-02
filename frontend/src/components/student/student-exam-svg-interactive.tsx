"use client";

import { useMemo } from "react";
import type { Exam } from "@/lib/mock-data";

type Hotspot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const SVG_WIDTH = 1440;
const SVG_HEIGHT = 3286;

// Extracted from student-exam-final-light.svg (option pill rects)
const OPTION_HOTSPOTS: Hotspot[] = [
  { x: 343.5, y: 808.5, w: 199, h: 35 },
  { x: 343.5, y: 887.5, w: 199, h: 35 },
  { x: 343.5, y: 966.5, w: 199, h: 35 },
  { x: 343.5, y: 1045.5, w: 199, h: 35 },
  { x: 343.5, y: 2170.5, w: 199, h: 35 },
  { x: 343.5, y: 2249.5, w: 199, h: 35 },
  { x: 343.5, y: 2328.5, w: 199, h: 35 },
];

export function StudentExamSvgInteractive(props: {
  exam: Exam;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { exam, answers, onAnswerChange } = props;

  const optionQuestions = useMemo(
    () =>
      exam.questions.filter(
        (question) =>
          question.type === "multiple-choice" || question.type === "true-false",
      ),
    [exam.questions],
  );

  const optionChoices = useMemo(() => {
    const flattened: Array<{
      questionId: string;
      value: string;
    }> = [];

    optionQuestions.forEach((question) => {
      const options =
        question.type === "true-false"
          ? ["True", "False"]
          : (question.options ?? []);
      options.forEach((value) => {
        flattened.push({ questionId: question.id, value });
      });
    });

    return flattened;
  }, [optionQuestions]);

  const hotspots = OPTION_HOTSPOTS.map((spot, index) => ({
    ...spot,
    choice: optionChoices[index],
  }));

  return (
    <div className="min-h-screen bg-[#F6FAFE]">
      <div className="w-full overflow-auto">
        <div
          className="relative mx-auto"
          style={{ width: `${SVG_WIDTH}px`, height: `${SVG_HEIGHT}px` }}
        >
          <img
            src="/student-exam-final-light.svg"
            alt="Student exam final light"
            style={{ width: `${SVG_WIDTH}px`, height: `${SVG_HEIGHT}px` }}
          />
          <div className="absolute inset-0">
            {hotspots.map((spot, index) => {
              if (!spot.choice) return null;
              const isSelected =
                answers[spot.choice.questionId] === spot.choice.value;

              return (
                <button
                  key={`hotspot-${index}`}
                  type="button"
                  onClick={() =>
                    onAnswerChange(spot.choice!.questionId, spot.choice!.value)
                  }
                  style={{
                    left: `${spot.x}px`,
                    top: `${spot.y}px`,
                    width: `${spot.w}px`,
                    height: `${spot.h}px`,
                  }}
                  className={[
                    "absolute rounded-[10px] transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007FFF]",
                    isSelected ? "ring-2 ring-[#007FFF]" : "ring-0",
                  ].join(" ")}
                  aria-label={`Option ${spot.choice.value}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
