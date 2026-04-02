'use client'

import type { ReactNode } from 'react'
import type { Exam } from '@/lib/mock-data'

export function getExamDescription(exam: Exam) {
  const normalizedTitle = exam.title.toLowerCase()

  if (normalizedTitle.includes('fizik')) {
    return '"Механик, термодинамик болон цахилгаан соронзон орны үндсэн ойлголтууд."'
  }

  if (normalizedTitle.includes('math') || normalizedTitle.includes('мат')) {
    return '"Тооцоолол, логик сэтгэлгээ болон томьёоны хэрэглээг шалгах даалгаврууд."'
  }

  if (normalizedTitle.includes('niig') || normalizedTitle.includes('нийг')) {
    return '"Нийгэм, иргэншил болон ардчиллын талаарх ойлголтыг бататгах сорил."'
  }

  return '"Шалгалтын агуулгад тохирсон асуултууд энэ хэсэгт багтсан байна."'
}

export function DetailInfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D7E9FF] bg-white text-[#7A2EF6] shadow-[0_10px_24px_rgba(24,100,251,0.08)]">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[15px] leading-none text-[#6B7785]">{label}</p>
        <p className="text-[17px] font-semibold leading-none text-[#1F2937]">{value}</p>
      </div>
    </div>
  )
}

export function InstructionItem({
  icon,
  text,
}: {
  icon: ReactNode
  text: string
}) {
  return (
    <li className="flex items-start gap-4 text-[18px] leading-[1.45] text-[#1F2937]">
      <span className="mt-1 text-[#1F2937]">{icon}</span>
      <span>{text}</span>
    </li>
  )
}
