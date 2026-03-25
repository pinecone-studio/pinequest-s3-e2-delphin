"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { classes, getExamsForClass } from "@/lib/mock-data"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Classes</h1>
        <p className="text-muted-foreground">Manage your classes and view student lists</p>
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
                  <CardDescription>{cls.students.length} students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {completedExams.length > 0 && (
                      <Badge variant="secondary">{completedExams.length} completed exam(s)</Badge>
                    )}
                    {upcomingExams.length > 0 && (
                      <Badge variant="outline">{upcomingExams.length} upcoming</Badge>
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
