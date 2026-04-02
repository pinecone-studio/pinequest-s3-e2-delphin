import type { Class, Student } from "@/lib/mock-data-types"
import { classHomeroomTeachers, studentSeedData } from "@/lib/mock-students-data"

export { classHomeroomTeachers }

export const students: Student[] = studentSeedData

export const classes: Class[] = [
  {
    id: "10A",
    name: "7A анги",
    students: students.filter((student) => student.classId === "10A"),
  },
  {
    id: "10B",
    name: "7Б анги",
    students: students.filter((student) => student.classId === "10B"),
  },
  {
    id: "10C",
    name: "7В анги",
    students: students.filter((student) => student.classId === "10C"),
  },
]
