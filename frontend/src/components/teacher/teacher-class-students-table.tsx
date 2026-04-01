"use client"

import type { Class } from "@/lib/mock-data-types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TeacherClassStudentsTable({ classData }: { classData: Class }) {
  return (
    <div className="rounded-[28px] border border-[#dbe7ff] bg-white/92 p-5 shadow-[0_28px_80px_rgba(120,152,212,0.14)] dark:border-[rgba(82,116,188,0.22)] dark:bg-[#091235]">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#141a1f] dark:text-white">
          Сурагчдын жагсаалт
        </h2>
        <p className="mt-1 text-sm text-[#6f7982] dark:text-[#aeb8d8]">
          {classData.name}-д бүртгэлтэй бүх сурагч.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Нэр</TableHead>
            <TableHead>Имэйл</TableHead>
            <TableHead>Сурагчийн ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classData.students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell className="text-muted-foreground">{student.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
