"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";

export function StudentAttemptAvatar({
  sizeClassName = "h-12 w-12",
  studentName,
}: {
  sizeClassName?: string;
  studentName: string;
}) {
  return (
    <Avatar
      className={`${sizeClassName} shrink-0 border border-[#E3EDF6] p-[1px] shadow-sm dark:border-[rgba(224,225,226,0.08)]`}
    >
      <AvatarFallback className="bg-[#D8E9FF] text-sm font-bold text-[#4E87C7] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#D8E7FF]">
        {getNameInitials(studentName)}
      </AvatarFallback>
    </Avatar>
  );
}

export function AttemptStatusBadge({
  status,
}: {
  status: StudentAttempt["status"];
}) {
  if (status === "joined") {
    return (
      <Badge
        variant="secondary"
        className="bg-sky-100 text-sky-700 dark:bg-[#0D3B66] dark:text-[#B9E6FF]"
      >
        Нэвтэрсэн
      </Badge>
    );
  }

  if (status === "in_progress") {
    return (
      <Badge
        variant="default"
        className="bg-emerald-100 text-emerald-700 dark:bg-[#0E5D46] dark:text-[#D6FFE7]"
      >
        Явж байна
      </Badge>
    );
  }

  if (status === "submitted") {
    return (
      <Badge
        variant="secondary"
        className="bg-slate-200 text-slate-700 dark:bg-[#E6F2FF] dark:text-[#41567A]"
      >
        Дууссан
      </Badge>
    );
  }

  if (status === "tab_switched") {
    return (
      <Badge
        variant="destructive"
        className="dark:bg-[#B96A6A] dark:text-white"
      >
        Таб сольсон
      </Badge>
    );
  }

  return (
    <Badge
      variant="destructive"
      className="dark:bg-[#C45C5C] dark:text-white"
    >
      Апп сольсон
    </Badge>
  );
}

function getNameInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
