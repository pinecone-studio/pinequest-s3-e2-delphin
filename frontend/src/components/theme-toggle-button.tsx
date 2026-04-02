"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )

  const isDark = mounted ? resolvedTheme === "dark" : true

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("inline-flex h-[24px] w-[46.91px] cursor-pointer items-center justify-center overflow-hidden", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="origin-center scale-[0.6486]">
        {isDark ? <DarkSwitchGraphic /> : <LightSwitchGraphic />}
      </span>
    </button>
  )
}

function DarkSwitchGraphic() {
  return (
    <svg width="71" height="37" viewBox="0 0 71 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="70" height="36" rx="18" fill="#001933" />
      <rect x="0.5" y="0.5" width="70" height="36" rx="18" stroke="rgba(255,255,255,0.22)" />
      <g opacity="0.95">
        <circle cx="8.9" cy="7.2" r="1.2" fill="#E6F2FF" />
        <circle cx="16.4" cy="19.8" r="1.2" fill="#E6F2FF" />
        <circle cx="8.9" cy="25.4" r="1.2" fill="#E6F2FF" />
        <circle cx="25.4" cy="9.1" r="1.2" fill="#E6F2FF" />
        <circle cx="20.6" cy="32" r="1.2" fill="#E6F2FF" />
        <circle cx="32.8" cy="25.4" r="1.2" fill="#E6F2FF" />
        <circle cx="28.7" cy="18.6" r="0.95" fill="#E6F2FF" />
        <circle cx="18.5" cy="23" r="0.9" fill="#E6F2FF" />
        <circle cx="31.3" cy="30.1" r="0.9" fill="#E6F2FF" />
        <circle cx="11.6" cy="17.3" r="0.85" fill="#E6F2FF" />
        <circle cx="7.3" cy="12.4" r="0.85" fill="#E6F2FF" />
        <circle cx="33.9" cy="15.9" r="0.85" fill="#E6F2FF" />
      </g>
      <g filter="url(#dark-thumb-shadow)">
        <rect x="36.2" y="3.4" width="28.4" height="29.2" rx="14.2" fill="#E6F2FF" />
        <path
          d="M50.4 30.6C44.6 32.1 38.8 28.6 37.4 22.8L37.2 22C35.8 16.2 39.4 10.3 45.2 8.9C51.1 7.5 56.8 11.2 58.1 17L58.3 17.8C59.6 23.6 56.1 29.2 50.4 30.6Z"
          fill="#293138"
          opacity="0.92"
        />
      </g>
      <defs>
        <filter id="dark-thumb-shadow" x="23.5" y="-8.8" width="53.8" height="54.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="-1.8" dy="1.6" />
          <feGaussianBlur stdDeviation="5.2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.717 0 0 0 0 0.717 0 0 0 0 0.717 0 0 0 0.31 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

function LightSwitchGraphic() {
  return (
    <svg width="71" height="37" viewBox="0 0 71 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="70" height="36" rx="18" fill="url(#light-bg)" />
      <rect x="0.5" y="0.5" width="70" height="36" rx="18" stroke="rgba(182,216,255,0.9)" />
      <circle cx="18.2" cy="10.2" r="5.9" fill="rgba(255,255,255,0.52)" />
      <circle cx="26.1" cy="8.3" r="2" fill="rgba(255,255,255,0.85)" />
      <circle cx="14.4" cy="16.2" r="1.5" fill="rgba(255,255,255,0.78)" />
      <g filter="url(#light-thumb-shadow)">
        <rect x="3.3" y="3.4" width="28.4" height="29.2" rx="14.2" fill="#FFF4C5" />
        <circle cx="17.5" cy="18" r="9.1" fill="#FFC940" />
        <g opacity="0.82">
          <path d="M17.5 5.9V8" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M17.5 28.1V30.2" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5.5 18H7.6" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M27.4 18H29.5" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M9.2 9.7L10.7 11.2" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M24.3 24.8L25.8 26.3" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M25.8 9.7L24.3 11.2" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M10.7 24.8L9.2 26.3" stroke="#FFF8E4" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </g>
      <defs>
        <linearGradient id="light-bg" x1="35.5" y1="0" x2="35.5" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9F0FF" />
          <stop offset="1" stopColor="#A8D5FF" />
        </linearGradient>
        <filter id="light-thumb-shadow" x="-8" y="-7.8" width="51.1" height="51.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="1.4" dy="1.8" />
          <feGaussianBlur stdDeviation="4.8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.529 0 0 0 0 0.694 0 0 0 0 0.914 0 0 0 0.32 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_2" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_2" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
