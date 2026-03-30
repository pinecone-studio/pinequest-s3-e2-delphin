"use client";

import { useEffect, useState } from "react";
import { SourcesFileListCard } from "@/components/teacher/sources-file-list-card";
import { SourcesUploadCard } from "@/components/teacher/sources-upload-card";
import { toast } from "@/hooks/use-toast";
import {
  deleteUpload,
  listUploads,
  uploadFile,
  type UploadRecord,
} from "@/lib/uploads-api";

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
          title: "ÐÐ»Ð´Ð°Ð°",
          description:
            error instanceof Error
              ? error.message
              : "ÐœÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½Ð³Ð¸Ð¹Ð½ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´Ñ‹Ð³ Ð°Ñ‡Ð°Ð°Ð»Ð¶ Ñ‡Ð°Ð´ÑÐ°Ð½Ð³Ò¯Ð¹.",
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
        title: "ÐÐ»Ð´Ð°Ð°",
        description: "Ð¤Ð°Ð¹Ð» ÑÐ¾Ð½Ð³Ð¾Ð¾Ð´ Ð½ÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.",
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
        title: "ÐÐ¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹",
        description: "Ð¤Ð°Ð¹Ð» Ð¼ÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½Ð´ Ñ…Ð°Ð´Ð³Ð°Ð»Ð°Ð³Ð´Ð»Ð°Ð°.",
      });
    } catch (error) {
      toast({
        title: "ÐÐ»Ð´Ð°Ð°",
        description:
          error instanceof Error ? error.message : "Ð¤Ð°Ð¹Ð» Ñ…ÑƒÑƒÐ»Ð°Ñ…Ð°Ð´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°.",
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
        title: "ÐÐ¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹",
        description: "Ð¤Ð°Ð¹Ð» ÑƒÑÑ‚Ð³Ð°Ð³Ð´Ð»Ð°Ð°.",
      });
    } catch (error) {
      toast({
        title: "ÐÐ»Ð´Ð°Ð°",
        description:
          error instanceof Error ? error.message : "Ð¤Ð°Ð¹Ð» ÑƒÑÑ‚Ð³Ð°Ð¶ Ñ‡Ð°Ð´ÑÐ°Ð½Ð³Ò¯Ð¹.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ÐœÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½</h1>
        <p className="text-muted-foreground">
          ÐÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…Ð´ÑÑ Ð°ÑˆÐ¸Ð³Ð»Ð°Ñ… Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð», Ð½Ð¾Ð¼, Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´.
        </p>
      </div>
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
    </div>
  );
}
