import { type Dispatch, type SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { type DemoQuestion, matchingPrompts } from "@/components/demo/example-exam-demo-data"

type ExampleExamQuestionBodyProps = {
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

export function ExampleExamQuestionBody(props: ExampleExamQuestionBodyProps) {
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

  if (question.type === "mcq") {
    return (
      <div className="grid gap-3">
        {["A. Cascading Style Sheets", "B. Central Style Syntax", "C. Computer Style Sheet", "D. Creative Style System"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedMcq((current) => ({ ...current, [question.id]: option[0].toLowerCase() }))}
            className={cn(
              "flex items-center justify-between rounded-[18px] border px-4 py-4 text-left transition",
              selectedMcq[question.id] === option[0].toLowerCase()
                ? "border-[#184C7C] bg-[#F4F9FF] text-[#173A5E]"
                : "border-[#D8E2EC] bg-white text-[#33485E] hover:border-[#B9CADB]",
            )}
          >
            <span className="text-[16px] font-medium">{option}</span>
            <span
              className={cn(
                "h-5 w-5 rounded-full border-2",
                selectedMcq[question.id] === option[0].toLowerCase() ? "border-[#184C7C] bg-[#184C7C]" : "border-[#AFC2D4]",
              )}
            />
          </button>
        ))}
      </div>
    )
  }

  if (question.type === "tf") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {["True", "False"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedTrueFalse((current) => ({ ...current, [question.id]: option.toLowerCase() }))}
            className={cn(
              "rounded-[18px] border px-4 py-5 text-left transition",
              selectedTrueFalse[question.id] === option.toLowerCase()
                ? "border-[#184C7C] bg-[#F4F9FF] text-[#173A5E]"
                : "border-[#D8E2EC] bg-white text-[#33485E] hover:border-[#B9CADB]",
            )}
          >
            <p className="text-[17px] font-semibold">{option}</p>
            <p className="mt-2 text-[14px] leading-6 text-[#6A7C8F]">Mark the statement as correct or incorrect.</p>
          </button>
        ))}
      </div>
    )
  }

  if (question.type === "matching") {
    return (
      <div className="space-y-3">
        {matchingPrompts.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-[18px] border border-[#D8E2EC] bg-[#FCFDFC] p-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
            <p className="text-[15px] font-semibold text-[#2C4156]">{item.left}</p>
            <select
              value={matchingAnswers[question.id]?.[item.id] ?? ""}
              onChange={(event) =>
                setMatchingAnswers((current) => ({
                  ...current,
                  [question.id]: {
                    ...(current[question.id] ?? {}),
                    [item.id]: event.target.value,
                  },
                }))
              }
              className="h-12 rounded-[14px] border border-[#D4DFEA] bg-white px-4 text-[14px] text-[#31465A]"
            >
              <option value="" disabled>
                Select match
              </option>
              {item.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    )
  }

  if (question.type === "open") {
    return (
      <Textarea
        value={shortAnswer[question.id] ?? ""}
        onChange={(event) => setShortAnswer((current) => ({ ...current, [question.id]: event.target.value }))}
        className="min-h-[180px] rounded-[18px] border-[#D8E2EC] bg-[#FFFEFC] px-4 py-4 text-[15px] leading-7 text-[#33485E]"
        placeholder="Write your answer here..."
      />
    )
  }

  return (
    <div className="rounded-[18px] border border-[#D8E2EC] bg-[#FFFEFC] p-4 text-[15px] leading-8 text-[#334658]">
      CSS box model-д гадна зайг
      <Input
        value={fillBlank[question.id]?.blank1 ?? ""}
        onChange={(event) =>
          setFillBlank((current) => ({
            ...current,
            [question.id]: { ...(current[question.id] ?? { blank1: "", blank2: "" }), blank1: event.target.value },
          }))
        }
        className="mx-2 inline-flex h-10 w-[140px] rounded-[12px] border-[#C9D8E8] bg-white align-middle"
      />
      гэж нэрлэдэг. Харин дотор зайг
      <Input
        value={fillBlank[question.id]?.blank2 ?? ""}
        onChange={(event) =>
          setFillBlank((current) => ({
            ...current,
            [question.id]: { ...(current[question.id] ?? { blank1: "", blank2: "" }), blank2: event.target.value },
          }))
        }
        className="mx-2 inline-flex h-10 w-[140px] rounded-[12px] border-[#C9D8E8] bg-white align-middle"
      />
      гэж нэрлэдэг.
    </div>
  )
}
