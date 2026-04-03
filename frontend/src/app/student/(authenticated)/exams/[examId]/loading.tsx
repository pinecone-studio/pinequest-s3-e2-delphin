export default function StudentExamDetailLoading() {
  return (
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8 dark:bg-transparent">
      <div className="mx-auto flex min-h-[420px] w-full max-w-[358px] flex-col items-center justify-center rounded-[20px] border border-[#E6F2FF] bg-[#F5FAFF] px-6 py-10 text-center shadow-[0_9px_24px_rgba(24,100,251,0.05)] sm:max-w-[904px] sm:rounded-[16px] sm:px-8 dark:border-[rgba(82,146,237,0.24)] dark:bg-[linear-gradient(127deg,#060B26_18%,#0B1230_58%,#1A1F37_100%)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.42)]">
        <div className="rounded-full bg-sky-100 p-4 text-sky-700 dark:bg-[#17305f] dark:text-[#8bc8ff]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
        <div className="mt-4 space-y-2">
          <h1 className="text-[20px] font-bold text-slate-900 sm:text-2xl dark:text-[#f4f8ff]">
            Шалгалтын мэдээллийг ачаалж байна
          </h1>
          <p className="max-w-[260px] text-sm leading-6 text-slate-600 sm:max-w-md dark:text-[#a9b7ca]">
            Түр хүлээнэ үү. Таны сонгосон шалгалтын дэлгэрэнгүй мэдээллийг бэлдэж байна.
          </p>
        </div>
      </div>
    </div>
  )
}
