import type { UploadRecord } from "@/lib/uploads-api";
import { repairMojibakeText } from "@/lib/repair-mojibake";

const demoPdfUrl = "/question-bank-demo-source.pdf";
const HIDDEN_LEGACY_SOURCE_NAMES = new Set([
  "Математик 7-р анги",
  "Математик 7-р анги - Бүхэл тоо",
]);

export function getReadableUploadName(value: string) {
  return repairMojibakeText(value);
}

export const mockMathSourceFiles: UploadRecord[] = [
  {
    id: "mock-source-1",
    key: "mock/sources/matematik-7r-angi-butarhai.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Математик - II энгийн бутархай",
    contentType: "application/pdf",
    size: 295_424,
    uploadedAt: "2026-03-22T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
  {
    id: "mock-source-2",
    key: "mock/sources/geometry-dasgal-ajliin-devter.pdf",
    bucket: "mock",
    folder: "sources",
    originalName: "Геометр - Дасгал ажлын дэвтэр",
    contentType: "application/pdf",
    size: 274_432,
    uploadedAt: "2026-03-20T09:00:00.000Z",
    publicUrl: demoPdfUrl,
  },
];

export function mergeSourceFiles(files: UploadRecord[]) {
  const visibleFiles = files.filter(
    (file) => !HIDDEN_LEGACY_SOURCE_NAMES.has(getReadableUploadName(file.originalName)),
  );
  const seenNames = new Set(
    visibleFiles.map((file) => getReadableUploadName(file.originalName)),
  );
  const missingMocks = mockMathSourceFiles.filter(
    (file) => !seenNames.has(file.originalName),
  );

  return [...visibleFiles, ...missingMocks].sort((left, right) =>
    right.uploadedAt.localeCompare(left.uploadedAt),
  );
}
