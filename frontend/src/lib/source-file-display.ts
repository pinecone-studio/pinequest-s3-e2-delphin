import { getReadableUploadName } from "@/lib/source-files";
import type { UploadRecord } from "@/lib/uploads-api";

type SourceDisplayMeta = {
  leftPrimary: string;
  leftSecondary: string;
  rightPrimary: string;
  rightSecondary: string;
};

const SOURCE_DISPLAY_MAP: Record<string, SourceDisplayMeta> = {
  "Математик - II энгийн бутархай": {
    leftPrimary: "Математик",
    leftSecondary: "7-р анги",
    rightPrimary: "II-Энгийн бутархай",
    rightSecondary: "2.1 Бутархай нэмэх, хасах",
  },
  "Геометр - Дасгал ажлын дэвтэр": {
    leftPrimary: "Геометр",
    leftSecondary: "7-р анги",
    rightPrimary: "Дасгал ажлын дэвтэр",
    rightSecondary: "Шинэ эх сурвалж",
  },
};

export function getSourceDisplayMeta(file: UploadRecord): SourceDisplayMeta {
  const readableName = getReadableUploadName(file.originalName);
  return (
    SOURCE_DISPLAY_MAP[readableName] ?? {
      leftPrimary: readableName.split(" - ")[0] || "Математик",
      leftSecondary: "7-р анги",
      rightPrimary: readableName.split(" - ")[1] || "Шинэ эх сурвалж",
      rightSecondary: "Сэдэв тодорхойгүй",
    }
  );
}
