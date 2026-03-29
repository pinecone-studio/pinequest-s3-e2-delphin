"use client";

import { Button } from "@/components/ui/button";

export function StudentTakeExamNotFound({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold">Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</h1>
      <Button className="mt-4" onClick={onBack}>
        Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ÑƒÑƒÐ´ Ñ€ÑƒÑƒ Ð±ÑƒÑ†Ð°Ñ…
      </Button>
    </div>
  );
}

export function StudentTakeExamSubmitted({
  onBack,
  onViewReport,
}: {
  onBack: () => void;
  onViewReport: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">
        Ð­Ð½Ñ ÑˆÐ°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð³ Ð°Ð»ÑŒ Ñ…ÑÐ´Ð¸Ð¹Ð½ Ð¸Ð»Ð³ÑÑÑÑÐ½ Ð±Ð°Ð¹Ð½Ð°
      </h1>
      <p className="text-muted-foreground">
        Ð¢Ð°Ð½Ñ‹ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚ Ñ…Ð°Ð´Ð³Ð°Ð»Ð°Ð³Ð´ÑÐ°Ð½. Ð¢Ð°Ð¹Ð»Ð°Ð½Ð³Ð¸Ð¹Ð½ Ñ…ÑƒÑƒÐ´Ð°ÑÐ½Ð°Ð°Ñ Ð´Ò¯Ð½Ð³ÑÑ Ò¯Ð·Ð½Ñ Ò¯Ò¯.
      </p>
      <div className="flex gap-3">
        <Button onClick={onViewReport}>Ð¢Ð°Ð¹Ð»Ð°Ð½ Ò¯Ð·ÑÑ…</Button>
        <Button variant="outline" onClick={onBack}>
          Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ÑƒÑƒÐ´ Ñ€ÑƒÑƒ Ð±ÑƒÑ†Ð°Ñ…
        </Button>
      </div>
    </div>
  );
}

export function StudentTakeExamClosed({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">
        Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ Ð¾Ð´Ð¾Ð¾Ð³Ð¾Ð¾Ñ€ Ð½ÑÑÐ»Ñ‚Ñ‚ÑÐ¹ Ð±Ð¸Ñˆ Ð±Ð°Ð¹Ð½Ð°
      </h1>
      <p className="text-muted-foreground">
        Ð­Ð½Ñ ÑˆÐ°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð³ Ð·Ó©Ð²Ñ…Ó©Ð½ Ñ‚Ð¾Ð²Ð»Ð¾ÑÐ¾Ð½ ÑÑ…Ð»ÑÑ… Ñ…ÑƒÐ³Ð°Ñ†Ð°Ð°Ð½Ð´ Ó©Ð³Ó©Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ñ‚Ð¾Ð¹.
      </p>
      <Button variant="outline" onClick={onBack}>
        Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð½ Ð´ÑÐ»Ð³ÑÑ€ÑÐ½Ð³Ò¯Ð¹ Ñ€Ò¯Ò¯ Ð±ÑƒÑ†Ð°Ñ…
      </Button>
    </div>
  );
}
