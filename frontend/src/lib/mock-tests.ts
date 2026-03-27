import type { MockTest } from "@/lib/mock-data-types";

export const mockTests: MockTest[] = [
  {
    id: "mt1",
    name: "Математикийн дасгал",
    fileName: "математикийн-тест.pdf",
    fileType: "pdf",
    uploadedAt: "2026-03-10",
    teacherId: "teacher1",
  },
  {
    id: "mt2",
    name: "Нийгмийн ухааны шалгалт",
    fileName: "нийгмийн-ухааны-шалгалт.pdf",
    fileType: "pdf",
    uploadedAt: "2026-03-12",
    teacherId: "teacher1",
  },
  {
    id: "mt3",
    name: "Физикийн сорил",
    fileName: "физикийн-сорил.pdf",
    fileType: "pdf",
    uploadedAt: "2026-03-15",
    teacherId: "teacher1",
  },
  {
    id: "mt4",
    name: "Нэгдсэн жишиг шалгалт",
    fileName: "нэгдсэн-жишиг-шалгалт.pdf",
    fileType: "pdf",
    uploadedAt: "2026-03-18",
    teacherId: "teacher1",
  },
];
