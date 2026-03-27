"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { classes } from "@/lib/mock-data"
import { getExamsForClass } from "@/lib/mock-data-helpers"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ангиуд</h1>
        <p className="text-muted-foreground">Ангиудаа удирдаж, сурагчдын жагсаалтыг харах</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const classExams = getExamsForClass(cls.id)
          const completedExams = classExams.filter(e => e.status === 'completed')
          const upcomingExams = classExams.filter(e => e.status === 'scheduled')

          return (
            <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
              <Card className="h-full cursor-pointer hover:border-foreground transition-colors">
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.students.length} сурагч</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {completedExams.length > 0 && (
                      <Badge variant="secondary">{completedExams.length} дууссан шалгалт</Badge>
                    )}
                    {upcomingExams.length > 0 && (
                      <Badge variant="outline">{upcomingExams.length} удахгүй</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
