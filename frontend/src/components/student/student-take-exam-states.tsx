"use client";

import { Button } from "@/components/ui/button";

export function StudentTakeExamNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
      <Button className="mt-4" onClick={onBack}>
        Шалгалтууд руу буцах
      </Button>
    </div>
  );
}

export function StudentTakeExamSubmitted(props: {
  onBack: () => void;
  onViewReport: () => void;
}) {
  const { onBack, onViewReport } = props;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Энэ шалгалтыг аль хэдийн илгээсэн байна</h1>
      <p className="text-muted-foreground">
        Таны хариулт хадгалагдсан. Тайлангийн хуудаснаас дүнгээ үзнэ үү.
      </p>
      <div className="flex gap-3">
        <Button onClick={onViewReport}>Тайлан үзэх</Button>
        <Button variant="outline" onClick={onBack}>
          Шалгалтууд руу буцах
        </Button>
      </div>
    </div>
  );
}

export function StudentTakeExamClosed({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Шалгалт одоогоор нээлттэй биш байна</h1>
      <p className="text-muted-foreground">
        Энэ шалгалтыг зөвхөн товлосон эхлэх хугацаанд өгөх боломжтой.
      </p>
      <Button variant="outline" onClick={onBack}>
        Шалгалтын дэлгэрэнгүй рүү буцах
      </Button>
    </div>
  );
}
