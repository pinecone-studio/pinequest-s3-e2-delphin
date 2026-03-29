"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SourceFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  type: string;
}

export default function SourcesPage() {
  const [files, setFiles] = useState<SourceFile[]>([
    {
      id: "1",
      name: "Математикийн дунд шатны ном.pdf",
      size: 2048576, // 2MB
      uploadedAt: "2026-03-25",
      type: "application/pdf",
    },
    {
      id: "2",
      name: "Нийгмийн ухааны сурах бичиг.docx",
      size: 1536000, // 1.5MB
      uploadedAt: "2026-03-24",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newFileName.trim()) {
      toast({
        title: "Алдаа",
        description: "Файл сонгоод нэр оруулна уу",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Implement actual file upload to backend
      // const formData = new FormData()
      // formData.append('file', selectedFile)
      // formData.append('name', newFileName.trim())
      // await fetch('/api/uploads/sources', { method: 'POST', body: formData })

      // Mock upload for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newFile: SourceFile = {
        id: Date.now().toString(),
        name: newFileName.trim(),
        size: selectedFile.size,
        uploadedAt: new Date().toISOString().split("T")[0],
        type: selectedFile.type,
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setNewFileName("");

      toast({
        title: "Амжилттай",
        description: "Файл амжилттай хуулагдлаа",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description: "Файл хуулахад алдаа гарлаа",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      // TODO: Implement actual file deletion
      // await fetch(`/api/uploads/sources/${fileId}`, { method: 'DELETE' })

      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      toast({
        title: "Амжилттай",
        description: "Файл устгагдлаа",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description: "Файл устгахад алдаа гарлаа",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Медлегийн сан</h1>
        <p className="text-muted-foreground">
          Шалгалтын асуулт үүсгэхэд ашиглах материал, ном, файлууд
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Шинэ файл нэмэх
          </CardTitle>
          <CardDescription>
            PDF, Word зэрэг файлуудыг хуулж, асуулт үүсгэхэд ашиглана
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">Файлын нэр</Label>
              <Input
                id="file-name"
                placeholder="Жишээ: Математикийн дунд шатны ном"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Файл сонгох</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !newFileName.trim() || isUploading}
            className="w-full md:w-auto"
          >
            {isUploading ? "Хуулж байна..." : "Файл хуулах"}
          </Button>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Хуулагдсан файлууд ({files.length})</CardTitle>
          <CardDescription>
            Асуулт үүсгэхэд ашиглах боломжтой файлууд
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Одоогоор файл хуулаагүй байна</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • Хуулагдсан:{" "}
                        {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
