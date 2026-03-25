'use client'

import { useState } from 'react'

export function useAiSourceFiles() {
  const [selectedAiSourceFiles, setSelectedAiSourceFiles] = useState<File[]>([])
  const [isAiSourceDragging, setIsAiSourceDragging] = useState(false)

  const addAiSourceFiles = (files: FileList | File[]) => {
    const nextFiles = Array.from(files).filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx'),
    )

    if (nextFiles.length === 0) {
      return
    }

    setSelectedAiSourceFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.size}`))
      const uniqueFiles = nextFiles.filter((file) => !seen.has(`${file.name}-${file.size}`))
      return [...current, ...uniqueFiles]
    })
  }

  const removeAiSourceFile = (fileName: string) => {
    setSelectedAiSourceFiles((current) => current.filter((file) => file.name !== fileName))
  }

  return {
    addAiSourceFiles,
    isAiSourceDragging,
    removeAiSourceFile,
    selectedAiSourceFiles,
    setIsAiSourceDragging,
  }
}
