"use client";

import { useEffect, useMemo, useState } from "react";
import { filterQuestionBank } from "@/components/teacher/question-bank-filter";
import { toast } from "@/hooks/use-toast";
import { getQuestionBank, type QuestionBankCategory } from "@/lib/question-bank-api";
import { normalizeQuestionBank } from "@/lib/question-bank-text";
import { mergeSourceFiles } from "@/lib/source-files";
import { listUploads, type UploadRecord } from "@/lib/uploads-api";

export function useQuestionBankData({
  searchQuery,
  selectedCategoryFilter,
  selectedDifficulty,
}: {
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty: string;
}) {
  const [questionBank, setQuestionBank] = useState<QuestionBankCategory[]>([]);
  const [sourceFiles, setSourceFiles] = useState<UploadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [questionBankData, sourceFileData] = await Promise.all([
          getQuestionBank(),
          listUploads("sources"),
        ]);
        if (!isMounted) return;
        setQuestionBank(normalizeQuestionBank(questionBankData));
        setSourceFiles(mergeSourceFiles(sourceFileData));
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Алдаа",
          description:
            error instanceof Error
              ? error.message
              : "Асуултын сангийн мэдээллийг ачаалж чадсангүй.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(
    () =>
      filterQuestionBank(
        questionBank,
        searchQuery,
        selectedCategoryFilter,
        selectedDifficulty,
      ),
    [questionBank, searchQuery, selectedCategoryFilter, selectedDifficulty],
  );

  return {
    filteredCategories,
    isLoading,
    questionBank,
    setQuestionBank,
    sourceFiles,
    setSourceFiles,
  };
}
