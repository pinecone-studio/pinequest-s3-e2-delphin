"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentLoginIntro() {
  return (
    <div className="mb-6 text-center">
      <Link href="/" className="muted-text text-sm hover:underline">
        &larr; Нүүр хуудас руу буцах
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Сурагчийн нэвтрэх хэсэг
      </h1>
      <p className="secondary-text">Шалгалтуудаа үзэхийн тулд нэвтэрнэ үү</p>
    </div>
  );
}

export function LoginField(props: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { id, label, placeholder, type, value, onChange } = props;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        className="input-surface"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
