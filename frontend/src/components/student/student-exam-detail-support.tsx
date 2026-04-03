'use client'

import Image from 'next/image'
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
  iconSrc,
  label,
  value,
}: {
  iconSrc: string
  label: string
  value: string
}) {
  return (
    <div className="flex min-h-[32px] w-full items-center gap-4">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center">
        <Image alt="" height={30} src={iconSrc} width={30} />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-[14px] leading-none text-[#72859A] dark:text-[#D7DFE7]">{label}</p>
        <p className="whitespace-nowrap text-[14px] font-medium leading-none tracking-[-0.02em] text-[#1F2937] md:text-[18px] dark:text-[#F0F3F5]">
          {value}
        </p>
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
    <li className="flex items-start gap-3 text-[13px] leading-[1.55] text-[#1F2937] dark:text-[#D7E0ED]">
      <span className="mt-0.5 shrink-0 text-[#1F2937] dark:text-[#D7E0ED]">{icon}</span>
      <span>{text}</span>
    </li>
  )
}
