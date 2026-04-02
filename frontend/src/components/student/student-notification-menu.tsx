"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NotificationItem = {
  examId: string;
  title: string;
  date: string;
  time: string;
};

export function StudentNotificationMenu(props: {
  hasNotifications: boolean;
  isDark: boolean;
  items: NotificationItem[];
  notificationCount: number;
  onSelect: (examId: string) => void;
}) {
  const { hasNotifications, isDark, items, notificationCount, onSelect } = props;
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
            hasNotifications
              ? isDark
                ? "border-[#3d8dff] bg-[linear-gradient(180deg,#17336c_0%,#10244f_100%)] text-[#8ec5ff]"
                : "border-[#79b8ff] bg-[#e9f4ff] text-[#1872d9]"
              : isDark
                ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
                : "border-[#D6E2F0] bg-white text-[#7B8898]",
          )}
          aria-label="Open exam notifications"
          title="Open exam notifications"
        >
          <Bell className="h-4 w-4 stroke-[1.75]" />
          {notificationCount > 0 ? (
            <span className={cn("absolute -right-1.5 -top-1.5 flex min-w-[17px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none text-white", isDark ? "bg-[#2f8cff]" : "bg-[#1976f3]")}>
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-[320px] overflow-hidden rounded-[22px] p-0",
          isDark
            ? "border border-[rgba(92,123,188,0.22)] bg-[linear-gradient(180deg,rgba(11,20,46,0.98)_0%,rgba(8,15,36,0.98)_100%)] shadow-[0_28px_70px_rgba(2,6,23,0.5)]"
            : "border border-[#d9e8f7] bg-white shadow-[0_22px_60px_rgba(73,118,170,0.22)]",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-5 py-4",
            isDark
              ? "border-b border-white/8 bg-[linear-gradient(180deg,rgba(23,51,108,0.96)_0%,rgba(15,35,78,0.96)_100%)] text-[#edf4ff]"
              : "border-b border-[#e6eef8] bg-[linear-gradient(180deg,#eff7ff_0%,#e6f1ff_100%)] text-[#24476b]",
          )}
        >
          <span className="text-[15px] font-semibold">Notifications</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              "cursor-pointer rounded-full p-1 transition",
              isDark ? "hover:bg-white/10" : "hover:bg-[#dcecff]",
            )}
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className={cn(
            "max-h-[380px] overflow-y-auto",
            isDark ? "bg-transparent" : "bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]",
          )}
        >
          {items.length === 0 ? (
            <div className={cn("px-5 py-6 text-sm", isDark ? "text-[#98a7c2]" : "text-[#76879c]")}>
              No new exams yet.
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.examId}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSelect(item.examId);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition",
                  isDark
                    ? "border-b border-white/6 hover:bg-[rgba(42,77,145,0.16)]"
                    : "border-b border-[#edf2f7] hover:bg-[#eef6ff]",
                )}
              >
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
                    isDark
                      ? "border-[rgba(96,131,202,0.24)] bg-[linear-gradient(180deg,#142759_0%,#0f1f47_100%)]"
                      : "border-[#d8e9fb] bg-[linear-gradient(180deg,#f3f9ff_0%,#e8f3ff_100%)]",
                  )}
                >
                  <Image
                    src="/examsIcon.svg"
                    alt=""
                    width={22}
                    height={22}
                    className={cn("h-[22px] w-[22px] object-contain", isDark && "brightness-0 invert")}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-foreground">{item.title}</span>
                  <span className={cn("mt-1 block text-[13px]", isDark ? "text-[#93a5c4]" : "text-[#7a8698]")}>
                    {item.date} {item.time}
                  </span>
                </span>
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", isDark ? "bg-[#58b7ff]" : "bg-[#2f8cff]")} />
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
