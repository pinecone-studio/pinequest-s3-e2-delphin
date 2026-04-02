"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReadableUploadName } from "@/lib/source-files";
import type { UploadRecord } from "@/lib/uploads-api";
import { FileText, Loader2, X } from "lucide-react";

type SourcesFileListCardProps = {
  files: UploadRecord[];
  formatFileSize: (bytes: number) => string;
  isLoading: boolean;
  onDelete: (fileId: string) => void;
};

export function SourcesFileListCard({
  files,
  formatFileSize,
  isLoading,
  onDelete,
}: SourcesFileListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Хуулсан файлууд ({files.length})</CardTitle>
        <CardDescription>
          Эдгээр файлууд Асуултын сан дахь AI үүсгэлтэд шууд харагдана.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Файлуудыг ачаалж байна...
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Одоогоор файл алга байна.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {getReadableUploadName(file.originalName)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • Хуулсан:{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {file.bucket === "mock" ? (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    Demo source
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
