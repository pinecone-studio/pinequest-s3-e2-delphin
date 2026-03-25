"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      className="secondary-ocean-button rounded-full px-4 font-semibold"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  )
}
