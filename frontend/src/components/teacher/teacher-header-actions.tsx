"use client";

import { Bell, LogOut, RefreshCw } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { cn } from "@/lib/utils";

export function TeacherHeaderActions(props: {
  isDark: boolean;
  onLogout: () => void;
  onRefresh: () => void;
}) {
  const { isDark, onLogout, onRefresh } = props;

  return (
    <div className="isolate flex items-center justify-self-end gap-3">
      <button
        type="button"
        onClick={onRefresh}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border",
          isDark
            ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
            : "border-[#D6E2F0] bg-white text-[#7B8898]",
        )}
        aria-label="Refresh current page"
        title="Refresh current page"
      >
        <RefreshCw className="h-4 w-4 stroke-[1.75]" />
      </button>
      <button
        type="button"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border",
          isDark
            ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
            : "border-[#D6E2F0] bg-white text-[#7B8898]",
        )}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4 stroke-[1.85]" />
      </button>
      <button
        type="button"
        onClick={onLogout}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border",
          isDark
            ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
            : "border-[#D6E2F0] bg-white text-[#7B8898]",
        )}
        aria-label="Гарах"
        title="Гарах"
      >
        <LogOut className="h-4 w-4 stroke-[1.75]" />
      </button>
      <ThemeToggleButton />
    </div>
  );
}
