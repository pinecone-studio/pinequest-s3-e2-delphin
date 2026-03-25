import { useState } from "react";
import { type NewQuestion, type QuestionType, type ScheduleEntry } from "@/components/teacher/exam-builder-types";
import { useQuestionBankTests } from "@/hooks/use-question-bank-tests";

function createQuestion(id: string, type: QuestionType): NewQuestion {
  return {
    id,
    type,
    question: "",
    points: type === "essay" ? 15 : type === "short-answer" ? 10 : type === "true-false" ? 5 : 10,
    options: type === "multiple-choice" ? ["", "", "", ""] : undefined,
    correctAnswer: type === "true-false" ? "True" : "",
  };
}

function buildGeneratedQuestions(mcCount: number, tfCount: number, shortCount: number) {
  const now = Date.now();
  return [
    ...Array.from({ length: mcCount }, (_, index) => ({
      ...createQuestion(`ai-mc-${now}-${index}`, "multiple-choice"),
      question: `AI-generated multiple choice question ${index + 1}: choose the best answer.`,
      options: ["Option A - First choice", "Option B - Second choice", "Option C - Third choice", "Option D - Fourth choice"],
      correctAnswer: "Option A - First choice",
    })),
    ...Array.from({ length: tfCount }, (_, index) => ({
      ...createQuestion(`ai-tf-${now}-${index}`, "true-false"),
      question: `AI-generated true/false question ${index + 1}: evaluate the statement.`,
    })),
    ...Array.from({ length: shortCount }, (_, index) => ({
      ...createQuestion(`ai-sa-${now}-${index}`, "short-answer"),
      question: `AI-generated short answer question ${index + 1}: explain the idea briefly.`,
      correctAnswer: "Expected answer",
    })),
  ];
}

export function useExamBuilder() {
  const practiceMaterials = useQuestionBankTests();
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [duration, setDuration] = useState(60);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiMCCount, setAiMCCount] = useState(5);
  const [aiTFCount, setAiTFCount] = useState(3);
  const [aiShortCount, setAiShortCount] = useState(2);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);

  const addQuestion = (type: QuestionType) => {
    setQuestions((currentQuestions) => [...currentQuestions, createQuestion(`new-${Date.now()}`, type)]);
  };

  const updateQuestion = (id: string, updates: Partial<NewQuestion>) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) => question.id === id ? { ...question, ...updates } : question),
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) => {
        if (question.id !== questionId || !question.options) return question;
        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;
        return { ...question, options: nextOptions };
      }),
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== id));
  };

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setQuestions((currentQuestions) => [...currentQuestions, ...buildGeneratedQuestions(aiMCCount, aiTFCount, aiShortCount)]);
    setIsGenerating(false);
    setShowAIDialog(false);
  };

  const addScheduleEntry = () => {
    setScheduleEntries((currentEntries) => [...currentEntries, { classId: "", date: "", time: "" }]);
  };

  const updateScheduleEntry = (index: number, field: keyof ScheduleEntry, value: string) => {
    setScheduleEntries((currentEntries) =>
      currentEntries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: value } : entry),
    );
  };

  const removeScheduleEntry = (index: number) => {
    setScheduleEntries((currentEntries) => currentEntries.filter((_, entryIndex) => entryIndex !== index));
  };

  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
  const questionCounts = {
    "multiple-choice": questions.filter((question) => question.type === "multiple-choice").length,
    "true-false": questions.filter((question) => question.type === "true-false").length,
    "short-answer": questions.filter((question) => question.type === "short-answer").length,
    essay: questions.filter((question) => question.type === "essay").length,
  };

  return {
    addQuestion,
    addScheduleEntry,
    aiMCCount,
    aiShortCount,
    aiTFCount,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    practiceMaterials,
    questionCounts,
    questions,
    removeQuestion,
    removeScheduleEntry,
    scheduleEntries,
    selectedMaterialIds,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
    setDuration,
    setExamTitle,
    setSelectedMaterialIds,
    setShowAIDialog,
    showAIDialog,
    totalPoints,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  };
}
