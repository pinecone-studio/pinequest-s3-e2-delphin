"use client"

import { useEffect, useState } from "react"
import { classes, examResults } from "@/lib/mock-data"
import { teacherDashboardExams } from "@/lib/mock-data-helpers"
import { buildTeacherDashboardMetrics, type DashboardMetrics } from "@/lib/teacher-dashboard-utils"

export function useTeacherDashboardMetrics(selectedClassId: string) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(() =>
    buildTeacherDashboardMetrics({ classes, exams: teacherDashboardExams, results: examResults, selectedClassId }),
  )

  useEffect(() => {
    let active = true
    Promise.resolve(
      buildTeacherDashboardMetrics({ classes, exams: teacherDashboardExams, results: examResults, selectedClassId }),
    ).then((nextMetrics) => {
      if (active) setMetrics(nextMetrics)
    })
    return () => {
      active = false
    }
  }, [selectedClassId])

  return metrics
}
