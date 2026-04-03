import type { Exam } from "@/lib/mock-data-types";
import { examE1 } from "@/lib/mock-exams-seed/exam-e1";
import { examE2 } from "@/lib/mock-exams-seed/exam-e2";
import { examE3 } from "@/lib/mock-exams-seed/exam-e3";
import { examE4 } from "@/lib/mock-exams-seed/exam-e4";
import { examE5 } from "@/lib/mock-exams-seed/exam-e5";
import { examE6 } from "@/lib/mock-exams-seed/exam-e6";

type ExamSeed = {
  baseExam: Exam;
  classId: "10A" | "10B" | "10C";
  createdAt: string;
  date: string;
  id: string;
  time: string;
  title: string;
};

function buildClassSpecificExam(seed: ExamSeed): Exam {
  return {
    ...seed.baseExam,
    id: seed.id,
    title: seed.title,
    createdAt: seed.createdAt,
    scheduledClasses: [{ classId: seed.classId, date: seed.date, time: seed.time }],
  };
}

const curatedExamSeeds: ExamSeed[] = [
  {
    id: "7a-math-fractions",
    title: "7А Бутархай ба харьцааны сорил",
    classId: "10A",
    date: "2026-03-30",
    time: "09:00",
    createdAt: "2026-03-24",
    baseExam: examE1,
  },
  {
    id: "7a-math-percent",
    title: "7А Хувь, хямдралын бодлого",
    classId: "10A",
    date: "2026-04-01",
    time: "10:10",
    createdAt: "2026-03-27",
    baseExam: examE2,
  },
  {
    id: "7a-math-shapes",
    title: "7А Дүрс, периметр, талбай",
    classId: "10A",
    date: "2026-04-03",
    time: "13:20",
    createdAt: "2026-03-29",
    baseExam: examE3,
  },
  {
    id: "7b-math-equations",
    title: "7Б Илэрхийлэл ба тэгшитгэл",
    classId: "10B",
    date: "2026-03-31",
    time: "09:20",
    createdAt: "2026-03-25",
    baseExam: examE4,
  },
  {
    id: "7b-math-scale",
    title: "7Б Пропорц ба масштаб",
    classId: "10B",
    date: "2026-04-02",
    time: "08:30",
    createdAt: "2026-03-28",
    baseExam: examE5,
  },
  {
    id: "7b-math-data",
    title: "7Б Өгөгдөл ба магадлал",
    classId: "10B",
    date: "2026-04-04",
    time: "11:10",
    createdAt: "2026-03-30",
    baseExam: examE6,
  },
  {
    id: "7v-math-fractions",
    title: "7В Тэнцүү бутархай ба тоон шулуун",
    classId: "10C",
    date: "2026-03-30",
    time: "14:00",
    createdAt: "2026-03-24",
    baseExam: examE1,
  },
  {
    id: "7v-math-word-problems",
    title: "7В Тэгшитгэлтэй текст бодлого",
    classId: "10C",
    date: "2026-04-02",
    time: "12:40",
    createdAt: "2026-03-28",
    baseExam: examE4,
  },
  {
    id: "7v-math-logic-data",
    title: "7В Диаграмм ба магадлалын сорил",
    classId: "10C",
    date: "2026-04-05",
    time: "10:30",
    createdAt: "2026-03-31",
    baseExam: examE6,
  },
];

export const exams: Exam[] = curatedExamSeeds.map(buildClassSpecificExam);
