"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { ExamResult, Student } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { buildClassScoreChart } from "@/lib/teacher-class-detail"

export function TeacherClassScoreChart({
  exam,
  results,
  students,
}: {
  exam: TeacherExam | null
  results: ExamResult[]
  students: Student[]
}) {
  const fallbackData = Array.from({ length: 9 }, (_, index) => ({
    questionLabel: `${index * 5 + 1}-${index * 5 + 5}`,
  }))
  const chartModel = exam ? buildClassScoreChart(exam, results, students) : null
  const chartData = chartModel?.chartData.length ? chartModel.chartData : fallbackData
  const chartLines = chartModel?.chartLines ?? []

  const chartConfig = Object.fromEntries(
    chartLines.map((line) => [line.dataKey, { color: "#9ea7b8", label: line.name }]),
  )

  return (
    <div className="h-[427px] w-full max-w-[856px]">
      <ChartContainer className="h-[427px] w-full" config={chartConfig}>
        <LineChart data={chartData} margin={{ top: 12, right: 8, left: 4, bottom: 8 }}>
          <CartesianGrid stroke="#edf1f8" strokeDasharray="0" vertical={false} />
          <XAxis axisLine={false} dataKey="questionLabel" tickLine={false} tickMargin={12} />
          <YAxis
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            tickMargin={12}
            ticks={[0, 20, 40, 60, 80, 100]}
            width={48}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(_, name, item) => (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-muted-foreground">{String(name)}</span>
                    <span className="font-medium text-foreground">
                      {item.value === null ? "-" : `${item.value}%`}
                    </span>
                  </div>
                )}
                indicator="line"
                labelFormatter={(label) => String(label)}
              />
            }
          />
          {chartLines.map((line) => (
            <Line
              key={line.dataKey}
              connectNulls
              dataKey={line.dataKey}
              dot={{ fill: "#9ea7b8", r: 2.6, strokeWidth: 0 }}
              name={line.name}
              opacity={0.9}
              stroke="#9ea7b8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.1}
              type="monotone"
            />
          ))}
        </LineChart>
      </ChartContainer>
      {!exam ? (
        <p className="px-4 pb-2 text-sm text-[#97a3b7]">
          Одоогоор completed шалгалт сонгогдоогүй байна. Chart layout-ийг урьдчилан харуулж байна.
        </p>
      ) : null}
      {exam && chartLines.length === 0 ? (
        <p className="px-4 pb-2 text-sm text-[#97a3b7]">
          Энэ шалгалтад онооны өгөгдөл хараахан бүртгэгдээгүй байна.
        </p>
      ) : null}
    </div>
  )
}
