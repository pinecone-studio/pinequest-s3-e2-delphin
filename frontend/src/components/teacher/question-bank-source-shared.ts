export const SUBJECT_OPTIONS = ["Математик", "Монгол хэл", "Физик"] as const;
export const GRADE_OPTIONS = ["6-р анги", "7-р анги", "8-р анги"] as const;
export const UNIT_OPTIONS = [
  {
    value: "1-р бүлэг - Бүхэл тоо",
    topics: [
      "1.2 сэдэв - Үржих, хуваах үйлдэл",
    ],
  },
  {
    value: "2-р бүлэг - Бутархай",
    topics: [
      "2.1 сэдэв - Бутархай нэмэх, хасах",
      "2.2 сэдэв - Бутархай үржих, хуваах",
    ],
  },
] as const;

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${parseFloat((bytes / 1024 ** unit).toFixed(2))} ${sizes[unit]}`;
}
