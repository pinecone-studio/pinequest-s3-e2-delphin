"use client";

import { useState } from "react";
import { QuestionBankSourceFileList } from "@/components/teacher/question-bank-source-file-list";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { QuestionBankSourceUploadDialog } from "@/components/teacher/question-bank-source-upload-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { mergeSourceFiles } from "@/lib/source-files";
import { uploadFile, type UploadRecord } from "@/lib/uploads-api";
import { Upload } from "lucide-react";

const SOURCES_FOLDER = "sources";

type Props = {
  files: UploadRecord[];
  setSourceFiles: React.Dispatch<React.SetStateAction<UploadRecord[]>>;
};

export function QuestionBankSourcePanel({ files, setSourceFiles }: Props) {
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
      <TeacherSurfaceCard className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#303959] dark:text-white">
              Эх сурвалж
            </h2>
          </div>
          <Button
            className="rounded-2xl bg-[#eaf2ff] text-[#2458d3] shadow-none hover:bg-[#dce8ff]"
            onClick={handleDialogOpen}
          >
            <Upload className="mr-2 h-4 w-4" />
            Шинэ эх сурвалж нэмэх
          </Button>
        </div>

        <QuestionBankSourceFileList files={files} />
      </TeacherSurfaceCard>

      <QuestionBankSourceUploadDialog
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
