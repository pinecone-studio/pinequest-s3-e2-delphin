"use client";

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
import { FileText, Upload } from "lucide-react";

type SourcesUploadCardProps = {
  formatFileSize: (bytes: number) => string;
  isUploading: boolean;
  newFileName: string;
  onFileNameChange: (value: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
};

export function SourcesUploadCard({
  formatFileSize,
  isUploading,
  newFileName,
  onFileNameChange,
  onFileSelect,
  onUpload,
  selectedFile,
}: SourcesUploadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Шинэ файл нэмэх
        </CardTitle>
        <CardDescription>
          PDF, Word зэрэг файлуудыг хадгалж, дараа нь асуулт үүсгэхдээ
          ашиглана.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="file-name">Файлын нэр</Label>
            <Input
              id="file-name"
              placeholder="Жишээ: 7-р ангийн алгебрын томьёо"
              value={newFileName}
              onChange={(event) => onFileNameChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Файл сонгох</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onFileSelect}
            />
          </div>
        </div>

        {selectedFile ? (
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-sm text-muted-foreground">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
          </div>
        ) : null}

        <Button
          onClick={onUpload}
          disabled={!selectedFile || !newFileName.trim() || isUploading}
          className="w-full md:w-auto"
        >
          {isUploading ? "Хуулж байна..." : "Файл хуулах"}
        </Button>
      </CardContent>
    </Card>
  );
}
