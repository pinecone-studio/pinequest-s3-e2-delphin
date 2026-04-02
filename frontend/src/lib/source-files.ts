import type { UploadRecord } from "@/lib/uploads-api";

const demoPdfUrl = "/question-bank-demo-source.pdf";

export function getReadableUploadName(value: string) {
  if (!/[ÐÑÃ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded.includes("�") ? value : decoded;
  } catch {
    return value;
  }
}

export const mockMathSourceFiles: UploadRecord[] = [
  {
    id: "mock-source-1",
    key: "mock/sources/matematik-6r-angi-too-bodlogo.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Математик 6-р анги - Тоо ба бодлого",
    contentType: "application/pdf",
    size: 248_576,
    uploadedAt: "2026-03-24T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-2",
    key: "mock/sources/matematik-7r-angi-buhel-too.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Математик 7-р анги - Бүхэл тоо",
    contentType: "application/pdf",
    size: 312_640,
    uploadedAt: "2026-03-23T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-3",
    key: "mock/sources/matematik-7r-angi-butarhai.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Математик 7-р анги - Бутархай",
    contentType: "application/pdf",
    size: 295_424,
    uploadedAt: "2026-03-22T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-4",
    key: "mock/sources/algebra-suragchijn-gar-avlaga.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Алгебр - Сурагчийн гарын авлага",
    contentType: "application/pdf",
    size: 418_816,
    uploadedAt: "2026-03-21T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-5",
    key: "mock/sources/geometry-dasgal-ajliin-devter.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Геометр - Дасгал ажлын дэвтэр",
    contentType: "application/pdf",
    size: 274_432,
    uploadedAt: "2026-03-20T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-6",
    key: "mock/sources/eesh-matematikiin-emhetgel.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "ЭЕШ математик - Бодлогын эмхэтгэл",
    contentType: "application/pdf",
    size: 521_728,
    uploadedAt: "2026-03-19T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
];

export function mergeSourceFiles(files: UploadRecord[]) {
  const seenNames = new Set(
    files.map((file) => getReadableUploadName(file.originalName)),
  );
  const missingMocks = mockMathSourceFiles.filter(
    (file) => !seenNames.has(file.originalName),
  );

  return [...files, ...missingMocks].sort((left, right) =>
    right.uploadedAt.localeCompare(left.uploadedAt),
  );
}
