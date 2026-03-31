import { type Dispatch, type SetStateAction } from "react"
import { getQuestionIcon, type DemoQuestion } from "@/components/demo/example-exam-demo-data"
import { ExampleExamQuestionBody } from "@/components/demo/example-exam-question-body"

type ExampleExamBookletQuestionProps = {
  fillBlank: Record<number, { blank1: string; blank2: string }>
  matchingAnswers: Record<number, Record<string, string>>
  question: DemoQuestion
  selectedMcq: Record<number, string>
  selectedTrueFalse: Record<number, string>
  setFillBlank: Dispatch<SetStateAction<Record<number, { blank1: string; blank2: string }>>>
  setMatchingAnswers: Dispatch<SetStateAction<Record<number, Record<string, string>>>>
  setSelectedMcq: Dispatch<SetStateAction<Record<number, string>>>
  setSelectedTrueFalse: Dispatch<SetStateAction<Record<number, string>>>
  setShortAnswer: Dispatch<SetStateAction<Record<number, string>>>
  shortAnswer: Record<number, string>
}

export function ExampleExamBookletQuestion(props: ExampleExamBookletQuestionProps) {
  const {
    fillBlank,
    matchingAnswers,
    question,
    selectedMcq,
    selectedTrueFalse,
    setFillBlank,
    setMatchingAnswers,
    setSelectedMcq,
    setSelectedTrueFalse,
    setShortAnswer,
    shortAnswer,
  } = props

  return (
    <article className="border-b border-dashed border-[#e1e7ed] pb-8 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7e0e8] bg-[#f3f7fb] text-[#2c6aab]">
          {getQuestionIcon(question.type)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7c8ea1]">
              Question {question.id}
            </span>
            <span className="rounded-full bg-[#f1f4f7] px-2.5 py-1 text-[12px] font-semibold text-[#556a7d]">
              {question.points} points
            </span>
          </div>
          <h3 className="mt-2 text-[26px] font-semibold text-[#243445]">{question.title}</h3>
          <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#495f74]">{question.prompt}</p>
        </div>
      </div>

      <div className="mt-6">
        <ExampleExamQuestionBody
          fillBlank={fillBlank}
          matchingAnswers={matchingAnswers}
          question={question}
          selectedMcq={selectedMcq}
          selectedTrueFalse={selectedTrueFalse}
          setFillBlank={setFillBlank}
          setMatchingAnswers={setMatchingAnswers}
          setSelectedMcq={setSelectedMcq}
          setSelectedTrueFalse={setSelectedTrueFalse}
          setShortAnswer={setShortAnswer}
          shortAnswer={shortAnswer}
        />
      </div>
    </article>
  )
}
