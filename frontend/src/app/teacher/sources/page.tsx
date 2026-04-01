"use client";

import { useEffect, useState } from "react";
import {
  TeacherPageHeader,
  TeacherPageShell,
  TeacherPageStatCard,
  TeacherPageStatGrid,
} from "@/components/teacher/teacher-page-primitives";
import { SourcesFileListCard } from "@/components/teacher/sources-file-list-card";
import { SourcesUploadCard } from "@/components/teacher/sources-upload-card";
import { toast } from "@/hooks/use-toast";
import {
  deleteUpload,
  listUploads,
  uploadFile,
  type UploadRecord,
} from "@/lib/uploads-api";
import { BookOpenText, FileStack, FolderArchive } from "lucide-react";

const SOURCES_FOLDER = "sources";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${parseFloat((bytes / 1024 ** unit).toFixed(2))} ${sizes[unit]}`;
}

export default function SourcesPage() {
  const [files, setFiles] = useState<UploadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      try {
        const uploadedFiles = await listUploads(SOURCES_FOLDER);
        if (isMounted) setFiles(uploadedFiles);
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Алдаа",
          description:
            error instanceof Error
              ? error.message
              : "Мэдлэгийн сангийн файлуудыг ачаалж чадсангүй.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadFiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setNewFileName(file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile || !newFileName.trim()) {
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
        file: selectedFile,
        fileName: newFileName.trim(),
        folder: SOURCES_FOLDER,
      });
      setFiles((current) => [createdFile, ...current]);
      setSelectedFile(null);
      setNewFileName("");
      toast({
        title: "Амжилттай",
        description: "Файл мэдлэгийн санд хадгалагдлаа.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Файл хуулахад алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteUpload(fileId);
      setFiles((current) => current.filter((file) => file.id !== fileId));
      toast({
        title: "Амжилттай",
        description: "Файл устгагдлаа.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Файл устгаж чадсангүй.",
        variant: "destructive",
      });
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Мэдлэгийн сан"
        description="Асуулт болон шалгалтын урсгалд ашиглах файлуудыг төвлөрүүлж, дараагийн Figma-д суурилсан эх сурвалжийн бүртгэлийн суурийг бэлдэнэ."
        icon={BookOpenText}
        eyebrow={<span>Энэ PR-д одоогийн upload логик өөрчлөгдөхгүй.</span>}
      />
      <TeacherPageStatGrid>
        <TeacherPageStatCard
          icon={FolderArchive}
          label="Бүртгэсэн файл"
          value={`${files.length} файл`}
        />
        <TeacherPageStatCard
          icon={FileStack}
          label="Нийт хэмжээ"
          tone="mint"
          value={formatFileSize(totalSize)}
        />
      </TeacherPageStatGrid>
      <SourcesUploadCard
        formatFileSize={formatFileSize}
        isUploading={isUploading}
        newFileName={newFileName}
        onFileNameChange={setNewFileName}
        onFileSelect={handleFileSelect}
        onUpload={() => void handleUpload()}
        selectedFile={selectedFile}
      />
      <SourcesFileListCard
        files={files}
        formatFileSize={formatFileSize}
        isLoading={isLoading}
        onDelete={(fileId) => void handleDelete(fileId)}
      />
    </TeacherPageShell>
  );
}
