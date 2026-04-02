"use client"

import { Search } from "lucide-react"
import {
  FinishedExamCard,
  UpcomingExamCard,
} from "@/components/student/student-exams-page-cards"
import { SegmentedTab } from "@/components/student/student-exams-page-controls"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStudentExamsPage } from "@/hooks/use-student-exams-page"

const sectionContainerClassName =
  "mx-auto flex w-full max-w-[900px] flex-col items-start gap-5 rounded-2xl border border-[#E6F2FF] bg-white px-5 py-5 shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:backdrop-blur-[60px] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06)]"

export default function StudentExamsPage() {
  const {
    activeTab,
    categoryOptions,
    filteredUpcomingExams,
    finishedItems,
    isLoading,
    searchQuery,
    selectedCategory,
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    studentClass,
  } = useStudentExamsPage()

  const allCount = filteredUpcomingExams.length + finishedItems.length
  const showUpcoming = activeTab === "all" || activeTab === "upcoming"
  const showFinished = activeTab === "all" || activeTab === "finished"

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-5 xl:px-[155px]">
      <div className="mx-auto flex w-full max-w-[1130px] flex-col gap-[30px]">
        <div className="mx-auto w-full max-w-[900px] space-y-[7px]">
          <h1 className="text-[24px] font-semibold leading-[29px] text-[#293138] dark:text-[#EDF4FF]">
            Шалгалтууд
          </h1>
          <p className="text-[14px] leading-5 text-[#566069] dark:text-[#AAB7CB]">
            Мэдлэгээ баталгаажуулах мөч ирлээ. Амжилт хүсье!
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[900px] items-center gap-[10px]">
          <div className="relative flex h-[48px] w-[301px] items-center">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#566069] dark:text-[#AAB7CB]" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Шалгалт хайх..."
              className="h-[48px] w-[301px] rounded-full border border-[#E6F2FF] bg-[#F5FAFF] px-4 py-3 pl-10 text-[14px] font-medium text-[#566069] placeholder:text-[#566069] dark:border-[#E6F2FF] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#D0D8E6] dark:placeholder:text-[#8FA0BB]"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-[48px] w-[152px] overflow-visible rounded-full border border-[#E6F2FF] bg-[#66B2FF] px-4 text-[14px] font-medium text-[#F5FAFF] shadow-none dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] [&_svg]:text-white [&_svg]:opacity-100">
              <SelectValue
                className="block overflow-visible whitespace-nowrap text-[12px] tracking-[-0.02em]"
                placeholder="Бүх хичээл"
              />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Бүх хичээл" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex h-[48px] w-[427px] items-center rounded-full border border-[#E6F2FF] bg-[#003366] p-2 shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_20px_44px_rgba(2,6,23,0.4)]">
            <SegmentedTab
              active={activeTab === "all"}
              count={allCount}
              label="Бүгд"
              onClick={() => setActiveTab("all")}
            />
            <SegmentedTab
              active={activeTab === "upcoming"}
              count={filteredUpcomingExams.length}
              label="Удахгүй"
              onClick={() => setActiveTab("upcoming")}
            />
            <SegmentedTab
              active={activeTab === "finished"}
              count={finishedItems.length}
              label="Дууссан"
              onClick={() => setActiveTab("finished")}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1080px] space-y-[34px]">
          {isLoading ? (
            <p className="text-sm text-[#566069] dark:text-[#AAB7CB]">
              Шалгалтуудыг ачаалж байна...
            </p>
          ) : null}

          {showUpcoming && filteredUpcomingExams.length > 0 ? (
            <section className={sectionContainerClassName}>
              <div className="flex items-center gap-4">
                <h2 className="text-[17px] font-semibold leading-[21px] text-[#293138] dark:text-white">
                  Удахгүй болох шалгалтууд
                </h2>
                <span className="flex h-[28px] min-w-[28px] items-center justify-center rounded-full bg-[#FFF3E0] px-[10px] text-[13px] font-semibold leading-none text-[#FF9500] dark:bg-[#FF9500] dark:text-[#FFF3E0]">
                  {filteredUpcomingExams.length}
                </span>
              </div>
              <div className="w-full space-y-4">
                {filteredUpcomingExams.map((exam) => (
                  <UpcomingExamCard
                    key={exam.id}
                    exam={exam}
                    href={`/student/exams/${exam.id}`}
                    studentClass={studentClass}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {showFinished && finishedItems.length > 0 ? (
            <section className={sectionContainerClassName}>
              <div className="flex items-center gap-4">
                <h2 className="text-[17px] font-semibold leading-[21px] text-[#293138] dark:text-white">
                  Дууссан шалгалтууд
                </h2>
                <span className="flex h-[28px] min-w-[28px] items-center justify-center rounded-full bg-[#E8F5E9] px-[10px] text-[13px] font-semibold leading-none text-[#00C853] dark:bg-[#00C853] dark:text-[#E8F5E9]">
                  {finishedItems.length}
                </span>
              </div>
              <div className="w-full space-y-4">
                {finishedItems.map((item) => (
                  <FinishedExamCard
                    key={
                      item.kind === "result"
                        ? `${item.result.examId}-${item.result.studentId}`
                        : `missed-${item.exam.id}`
                    }
                    item={item}
                    studentClass={studentClass}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {!isLoading &&
          filteredUpcomingExams.length === 0 &&
          finishedItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E6F2FF] bg-[#F9FAFB] px-6 py-10 text-center text-[#566069] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#AAB7CB]">
              Хайлтын нөхцөлд тохирох шалгалт олдсонгүй.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
