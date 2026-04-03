"use client";

import Image from "next/image";
import { StudentLoginDemoButtons } from "@/components/student/student-login-demo-buttons";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function StudentLoginSubmitBlock(props: {
  isSubmitting: boolean;
  onDemoFill: () => void;
  onJudgeDemoFill: (judgeEmail: string, judgePassword: string) => void;
}) {
  const { isSubmitting, onDemoFill, onJudgeDemoFill } = props;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (isSubmitting) {
    return (
      <div className="flex w-full items-center justify-center py-2">
        <Image
          src={isDark ? "/edulphin-mark-dark.svg" : "/edulphin-mark.svg"}
          alt="Loading"
          width={48}
          height={48}
          priority
          className={`h-12 w-12 animate-spin object-contain drop-shadow-[0_0_10px_rgba(64,156,255,0.45)] ${isDark ? "brightness-150 saturate-150 contrast-125" : "brightness-150 saturate-200 contrast-125"}`}
        />
      </div>
    );
  }

  return (
    <>
      <Button type="submit" className="ocean-cta w-full border-0 font-semibold">
        Нэвтрэх
      </Button>
      <StudentLoginDemoButtons
        onDemoFill={onDemoFill}
        onJudgeDemoFill={onJudgeDemoFill}
      />
    </>
  );
}
