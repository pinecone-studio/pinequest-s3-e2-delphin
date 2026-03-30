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
          Ð¨Ð¸Ð½Ñ Ñ„Ð°Ð¹Ð» Ð½ÑÐ¼ÑÑ…
        </CardTitle>
        <CardDescription>
          PDF, Word Ð·ÑÑ€ÑÐ³ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´Ñ‹Ð³ Ñ…Ð°Ð´Ð³Ð°Ð»Ð¶, Ð´Ð°Ñ€Ð°Ð° Ð½ÑŒ Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…Ð´ÑÑ
          Ð°ÑˆÐ¸Ð³Ð»Ð°Ð½Ð°.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="file-name">Ð¤Ð°Ð¹Ð»Ñ‹Ð½ Ð½ÑÑ€</Label>
            <Input
              id="file-name"
              placeholder="Ð–Ð¸ÑˆÑÑ: 7-Ñ€ Ð°Ð½Ð³Ð¸Ð¹Ð½ Ð°Ð»Ð³ÐµÐ±Ñ€Ñ‹Ð½ Ñ‚Ð¾Ð¼ÑŒÑ‘Ð¾"
              value={newFileName}
              onChange={(event) => onFileNameChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Ð¤Ð°Ð¹Ð» ÑÐ¾Ð½Ð³Ð¾Ñ…</Label>
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
          {isUploading ? "Ð¥ÑƒÑƒÐ»Ð¶ Ð±Ð°Ð¹Ð½Ð°..." : "Ð¤Ð°Ð¹Ð» Ñ…ÑƒÑƒÐ»Ð°Ñ…"}
        </Button>
      </CardContent>
    </Card>
  );
}
