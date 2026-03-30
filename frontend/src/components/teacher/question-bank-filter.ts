import type { QuestionBankCategory } from "@/lib/question-bank-api";

export function filterQuestionBank(
  questionBank: QuestionBankCategory[],
  searchQuery: string,
  selectedCategoryFilter: string,
  selectedDifficulty: string,
) {
  const normalizedSearch = searchQuery.toLowerCase().trim();

  return questionBank
    .filter((category) =>
      selectedCategoryFilter === "all" ? true : category.id === selectedCategoryFilter,
    )
    .map((category) => ({
      ...category,
      topics: category.topics
        .map((topic) => ({
          ...topic,
          questions: topic.questions.filter((question) => {
            const matchesSearch = question.question.toLowerCase().includes(normalizedSearch);
            const matchesDifficulty =
              selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
            return matchesSearch && matchesDifficulty;
          }),
        }))
        .filter((topic) =>
          normalizedSearch
            ? topic.questions.length > 0 || topic.name.toLowerCase().includes(normalizedSearch)
            : topic.questions.length > 0,
        ),
    }))
    .filter((category) =>
      normalizedSearch
        ? category.topics.length > 0 || category.name.toLowerCase().includes(normalizedSearch)
        : category.topics.length > 0,
    );
}
