import { CheckCircle2, FileText, Link2, PencilLine, ShieldCheck } from "lucide-react"

export const pageSize = 10
export const totalQuestionCount = 30
export const questionTypes = ["mcq", "tf", "matching", "open", "fill"] as const
export const matchingPrompts = [
  { id: "m1", left: "HTML", options: ["Programming language", "Markup language", "Database"] },
  { id: "m2", left: "CSS", options: ["Styling language", "Version control", "Backend runtime"] },
  { id: "m3", left: "SQL", options: ["Database query language", "UI framework", "Package manager"] },
] as const

export type QuestionType = (typeof questionTypes)[number]

export type DemoQuestion = {
  id: number
  type: QuestionType
  points: number
  title: string
  prompt: string
}

export const demoQuestions: DemoQuestion[] = Array.from({ length: totalQuestionCount }, (_, index) => {
  const id = index + 1
  const type = questionTypes[index % questionTypes.length]

  if (type === "mcq") {
    return { id, type, points: 2, title: "Multiple Choice", prompt: "Which option correctly expands the term CSS?" }
  }

  if (type === "tf") {
    return {
      id,
      type,
      points: 1,
      title: "True / False",
      prompt: "HTML is a programming language used to create application logic.",
    }
  }

  if (type === "matching") {
    return {
      id,
      type,
      points: 3,
      title: "Connect / Matching",
      prompt: "Match each concept with the best description.",
    }
  }

  if (type === "open") {
    return {
      id,
      type,
      points: 4,
      title: "Open Ended",
      prompt: "Explain what a REST API is in one or two concise sentences.",
    }
  }

  return {
    id,
    type,
    points: 2,
    title: "Fill In The Blank",
    prompt: "Complete the sentence using the correct CSS box model terms.",
  }
})

export function getQuestionIcon(type: QuestionType) {
  if (type === "mcq") return <CheckCircle2 className="h-4 w-4" />
  if (type === "tf") return <ShieldCheck className="h-4 w-4" />
  if (type === "matching") return <Link2 className="h-4 w-4" />
  if (type === "open") return <PencilLine className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}
