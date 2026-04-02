"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

export function ForceLightTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return null;
}
