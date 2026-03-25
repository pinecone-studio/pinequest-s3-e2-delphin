import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Exam } from "@/lib/mock-data";
import type { WeekDate } from "@/lib/date-utils";

type StudentScheduleCalendarProps = {
  myExams: Exam[];
  studentClass: string;
  timeSlots: string[];
  weekDates: WeekDate[];
};

export function StudentScheduleCalendar({
  myExams,
  studentClass,
  timeSlots,
  weekDates,
}: StudentScheduleCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Schedule</CardTitle>
        <CardDescription>Your upcoming exams this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 border-b">
              <div className="p-2 font-medium text-muted-foreground">Time</div>
              {weekDates.map(({ day, displayDate }) => (
                <div key={day} className="border-l p-2 text-center">
                  <div className="font-medium">{day}</div>
                  <div className="text-sm text-muted-foreground">{displayDate}</div>
                </div>
              ))}
            </div>
            {timeSlots.map((time) => (
              <div key={time} className="grid min-h-[60px] grid-cols-6 border-b">
                <div className="p-2 text-sm text-muted-foreground">{time}</div>
                {weekDates.map(({ day, date }) => {
                  const examItem = myExams.flatMap((exam) =>
                    exam.scheduledClasses
                      .filter(
                        (scheduledClass) =>
                          scheduledClass.classId === studentClass &&
                          scheduledClass.date === date &&
                          scheduledClass.time === time,
                      )
                      .map(() => ({ exam })),
                  )[0];

                  return (
                    <div key={`${day}-${time}`} className="min-h-[60px] border-l p-1">
                      {examItem && (
                        <div
                          className={`rounded p-1 text-xs ${
                            examItem.exam.status === "completed"
                              ? "bg-muted"
                              : "border border-destructive/20 bg-destructive/10"
                          }`}
                        >
                          <div
                            className={`font-medium ${
                              examItem.exam.status === "scheduled"
                                ? "text-destructive"
                                : ""
                            }`}
                          >
                            {examItem.exam.title}
                          </div>
                          <div className="text-muted-foreground">
                            {examItem.exam.duration} min
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
