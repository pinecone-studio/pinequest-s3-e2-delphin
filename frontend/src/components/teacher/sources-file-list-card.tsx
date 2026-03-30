"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <CardTitle>Ð¥ÑƒÑƒÐ»ÑÐ°Ð½ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´ ({files.length})</CardTitle>
        <CardDescription>
          Ð­Ð´Ð³ÑÑÑ€ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´ ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ ÑÐ°Ð½ Ð´Ð°Ñ…ÑŒ AI Ò¯Ò¯ÑÐ³ÑÐ»Ñ‚ÑÐ´ ÑˆÑƒÑƒÐ´ Ñ…Ð°Ñ€Ð°Ð³Ð´Ð°Ð½Ð°.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Ð¤Ð°Ð¹Ð»ÑƒÑƒÐ´Ñ‹Ð³ Ð°Ñ‡Ð°Ð°Ð»Ð¶ Ð±Ð°Ð¹Ð½Ð°...
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>ÐžÐ´Ð¾Ð¾Ð³Ð¾Ð¾Ñ€ Ñ„Ð°Ð¹Ð» Ð°Ð»Ð³Ð° Ð±Ð°Ð¹Ð½Ð°.</p>
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
                    <p className="font-medium">{file.originalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} â€¢ Ð¥ÑƒÑƒÐ»ÑÐ°Ð½:{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(file.id)}
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
  );
}
