"use client";

import { useEffect } from "react";

export function useExamIntegrityGuard({
  examId,
  studentId,
}: {
  examId?: string;
  studentId?: string;
}) {
  useEffect(() => {
    if (!examId || !studentId) return;

    const logSuspiciousActivity = async (
      eventType: "tab_hidden" | "window_blurred" | "fullscreen_exited",
    ) => {
      try {
        console.log(`Suspicious activity detected: ${eventType}`, {
          examId,
          studentId,
          timestamp: new Date().toISOString(),
          eventType,
        });
      } catch (error) {
        console.error("Failed to log suspicious activity:", error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        void logSuspiciousActivity("tab_hidden");
      }
    };
    const handleWindowBlur = () => void logSuspiciousActivity("window_blurred");
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        void logSuspiciousActivity("fullscreen_exited");
      }
    };
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((error) => {
          console.log("Fullscreen not available:", error);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const fullscreenTimer = setTimeout(requestFullscreen, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(fullscreenTimer);
    };
  }, [examId, studentId]);
}
