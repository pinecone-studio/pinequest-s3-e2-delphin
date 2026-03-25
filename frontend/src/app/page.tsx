"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { notifyTeacherSessionChange } from "@/hooks/use-teacher-session";
import { defaultTeacherPersona, persistTeacherSession } from "@/lib/demo-personas";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    persistTeacherSession(defaultTeacherPersona);
    notifyTeacherSessionChange();
    router.replace("/teacher/dashboard");
  }, [router]);

  return null;
}
