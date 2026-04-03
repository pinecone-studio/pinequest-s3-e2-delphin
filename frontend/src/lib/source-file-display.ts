import { getReadableUploadName } from "@/lib/source-files";
import type { UploadRecord } from "@/lib/uploads-api";

type SourceDisplayMeta = {
  leftPrimary: string;
  leftSecondary: string;
  rightPrimary: string;
  rightSecondary: string;
};

const SOURCE_DISPLAY_MAP: Record<string, SourceDisplayMeta> = {
  "Математик 7-р анги": {
    leftPrimary: "Математик",
    leftSecondary: "7-р анги",
    rightPrimary: "I-Бүхэл тоо",
    rightSecondary: "1.1 Нэмэх, хасах үйлдэл",
  },
  "Математик 6-р анги - Тоо ба бодлого": {
    leftPrimary: "Математик",
    leftSecondary: "7-р анги",
    rightPrimary: "I-Бүхэл тоо",
    rightSecondary: "1.1 Үржүүлэх, хуваах үйлдэл",
  },
  "Алгебр - Сурагчийн гарын авлага": {
    leftPrimary: "Математик",
    leftSecondary: "7-р анги",
    rightPrimary: "II-Энгийн бутархай",
    rightSecondary: "2.1 Тоог тоймлох",
  },
  "ЭЕШ математик - Бодлогын эмхэтгэл": {
    leftPrimary: "Математик",
    leftSecondary: "7-р анги",
    rightPrimary: "II-Энгийн бутархай",
    rightSecondary: "2.1 Тоо жиших",
  },
};

export function getSourceDisplayMeta(file: UploadRecord): SourceDisplayMeta {
  const readableName = getReadableUploadName(file.originalName);
  return (
    SOURCE_DISPLAY_MAP[readableName] ?? {
      leftPrimary: readableName.split(" - ")[0] || "Математик",
      leftSecondary: "7-р анги",
      rightPrimary: readableName.split(" - ")[1] || "I-Бүхэл тоо",
      rightSecondary: "1.1 Нэмэх, хасах үйлдэл",
    }
  );
}
