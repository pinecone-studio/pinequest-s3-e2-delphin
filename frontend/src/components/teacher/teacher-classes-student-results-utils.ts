"use client";

export function buildScoreBadgeStyles(scorePercent: number) {
  if (scorePercent >= 90) {
    return {
      backgroundColor: "rgba(231,250,237,0.96)",
      borderColor: "#aee3bf",
      color: "#64c583",
    };
  }

  if (scorePercent >= 75) {
    return {
      backgroundColor: "rgba(238,245,255,0.98)",
      borderColor: "#b9d0ff",
      color: "#6a8fff",
    };
  }

  return {
    backgroundColor: "rgba(246,239,255,0.98)",
    borderColor: "#d3c0ff",
    color: "#a276ff",
  };
}

export function getInitials(value: string) {
  return value
    .split(/[.\s-]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatMetric(value: number) {
  return value.toFixed(2);
}

export function formatDottedDate(value: Date) {
  if (Number.isNaN(value.getTime())) {
    return "--.--.--";
  }

  return `${value.getFullYear()}.${String(value.getMonth() + 1).padStart(2, "0")}.${String(value.getDate()).padStart(2, "0")}`;
}

export function formatTime(value: Date) {
  if (Number.isNaN(value.getTime())) {
    return "--:--";
  }

  return value.toLocaleTimeString("mn-MN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function normalizeSubjectLabel(value: string) {
  if (!value.trim()) {
    return "Хичээл";
  }

  return value.replace(/ийн багш$/i, "").replace(/ын багш$/i, "").trim();
}
