"use client";

import { useState } from "react";
import { QuestionBankSourceFileList } from "@/components/teacher/question-bank-source-file-list";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { QuestionBankSourceUploadDialog } from "@/components/teacher/question-bank-source-upload-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { mergeSourceFiles } from "@/lib/source-files";
import { uploadFile, type UploadRecord } from "@/lib/uploads-api";
import { Plus } from "lucide-react";

const SOURCES_FOLDER = "sources";

type Props = {
  className?: string;
  files: UploadRecord[];
  setSourceFiles: React.Dispatch<React.SetStateAction<UploadRecord[]>>;
};

export function QuestionBankSourcePanel({ className, files, setSourceFiles }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [selectedSourceFile, setSelectedSourceFile] = useState<File | null>(
    null,
  );

  const resetSourceDialog = () => {
    setNewSourceName("");
    setSelectedSourceFile(null);
  };

  const handleSourceFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedSourceFile(file);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetSourceDialog();
    }
  };

  const handleDialogOpen = () => {
    resetSourceDialog();
    setIsDialogOpen(true);
  };

  const handleDemoFill = async () => {
    try {
      const response = await fetch("/question-bank-demo-source.pdf");
      if (!response.ok) {
        throw new Error("Demo PDF файлыг ачаалж чадсангүй.");
      }

      const blob = await response.blob();
      const file = new File([blob], "matematik-7r-angi-demo.pdf", {
        type: "application/pdf",
      });
      setNewSourceName("Математик 7-р анги");
      setSelectedSourceFile(file);
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error
            ? error.message
            : "Demo PDF файлыг бэлдэж чадсангүй.",
        variant: "destructive",
      });
    }
  };

  const handleSourceUpload = async () => {
    if (!selectedSourceFile || !newSourceName.trim()) {
      toast({
        title: "Алдаа",
        description: "Файл сонгоод нэр оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const createdFile = await uploadFile({
        file: selectedSourceFile,
        fileName: newSourceName.trim(),
        folder: SOURCES_FOLDER,
      });
      setSourceFiles((current) => mergeSourceFiles([createdFile, ...current]));
      resetSourceDialog();
      setIsDialogOpen(false);
      toast({ title: "Амжилттай", description: "Эх сурвалж файл нэмэгдлээ." });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error
            ? error.message
            : "Файл нэмэх үед алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <TeacherSurfaceCard className={`space-y-5 ${className ?? ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#4c4c66] dark:text-white">
              Эх сурвалж
            </h2>
            <p className="text-[16px] font-medium text-[#6f6c99] dark:text-[#aeb8d2]">
              Эх сурвалжийн бүртгэлийн сан.
            </p>
          </div>
          <Button
            className="mt-1 h-[32px] w-[102px] rounded-full bg-[#6f9cff] px-3 text-[14px] font-medium text-white shadow-none transition-colors hover:bg-[#5d8ef8] dark:bg-[#6f9cff] dark:text-white dark:hover:bg-[#5d8ef8]"
            onClick={handleDialogOpen}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Бүртгэх
          </Button>
        </div>

        <QuestionBankSourceFileList files={files} />
      </TeacherSurfaceCard>

      <QuestionBankSourceUploadDialog
        key={isDialogOpen ? "source-dialog-open" : "source-dialog-closed"}
        isOpen={isDialogOpen}
        isUploading={isUploading}
        newSourceName={newSourceName}
        onDemo={handleDemoFill}
        onFileSelect={handleSourceFileSelect}
        onNameChange={setNewSourceName}
        onOpenChange={handleDialogOpenChange}
        onUpload={() => void handleSourceUpload()}
        selectedSourceFile={selectedSourceFile}
      />
    </>
  );
}
