import type { ExamQuestion, ExamQuestionType } from './exams.types';
import { safePickQuestionIconKey } from './question-icons';

export function createMockQuestions(dto: {
  category: string;
  mcCount: number;
  tfCount: number;
  shortAnswerCount: number;
  variants: number;
}) {
  const questions: ExamQuestion[] = [];
  let order = 1;

  const createQuestion = (
    type: ExamQuestionType,
    index: number,
  ): ExamQuestion => {
    const prompt = `AI-generated ${type} question #${index} (category: ${dto.category || 'General'})`;

    return {
      id: crypto.randomUUID(),
      type,
      question: prompt,
      options: type === 'multiple-choice' ? ['A', 'B', 'C', 'D'] : undefined,
      correctAnswer:
        type === 'multiple-choice'
          ? 'A'
          : type === 'true-false'
            ? 'true'
            : undefined,
      iconKey: safePickQuestionIconKey({
        categoryName: dto.category,
        question: prompt,
        type,
      }),
      points: type === 'true-false' ? 5 : 10,
      order: order++,
    };
  };

  for (let variant = 1; variant <= dto.variants; variant += 1) {
    for (let i = 0; i < dto.mcCount; i += 1)
      questions.push(createQuestion('multiple-choice', i + 1));
    for (let i = 0; i < dto.tfCount; i += 1)
      questions.push(createQuestion('true-false', i + 1));
    for (let i = 0; i < dto.shortAnswerCount; i += 1)
      questions.push(createQuestion('short-answer', i + 1));
  }

  return questions;
}

export function getMockLiveAttempts() {
  return [
    {
      id: 'attempt-1',
      studentId: 'student-1',
      studentName: 'Бат-Эрдэнэ',
      classId: '10A',
      status: 'in_progress',
      currentQuestion: 3,
      timeRemaining: 2400,
      lastActivity: new Date().toISOString(),
      suspiciousEvents: [],
    },
    {
      id: 'attempt-2',
      studentId: 'student-2',
      studentName: 'Сараа',
      classId: '10A',
      status: 'tab_switched',
      currentQuestion: 5,
      timeRemaining: 1800,
      lastActivity: new Date(Date.now() - 30000).toISOString(),
      suspiciousEvents: [
        {
          type: 'tab_hidden',
          timestamp: new Date(Date.now() - 30000).toISOString(),
        },
      ],
    },
    {
      id: 'attempt-3',
      studentId: 'student-3',
      studentName: 'Дорж',
      classId: '10B',
      status: 'submitted',
      currentQuestion: 10,
      timeRemaining: 0,
      lastActivity: new Date(Date.now() - 60000).toISOString(),
      suspiciousEvents: [],
    },
  ];
}
