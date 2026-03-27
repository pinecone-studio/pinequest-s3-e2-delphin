"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionBankUploadDialog } from "@/components/teacher/question-bank-upload-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { mockTests, type MockTest } from "@/lib/mock-data";

export default function QuestionBankPage() {
  const [tests, setTests] = useState<MockTest[]>(mockTests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx"))
    ) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!newTestName || !selectedFile) return;

    const newTest: MockTest = {
      id: `mt${tests.length + 1}`,
      name: newTestName,
      fileName: selectedFile.name,
      fileType: selectedFile.name.split(".").pop() || "pdf",
      uploadedAt: new Date().toISOString().split("T")[0],
      teacherId: "teacher1",
    };

    setTests([...tests, newTest]);
    setNewTestName("");
    setSelectedFile(null);
    setIsDialogOpen(false);
    toast({
      title: "Амжилттай хадгаллаа",
      description: "Шалгалтыг асуултын санд амжилттай нэмлээ.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Асуултын сан</h1>
          <p className="text-muted-foreground">
            Сурагчдад зориулсан жишиг шалгалтуудыг оруулж, удирдах
          </p>
        </div>
        <QuestionBankUploadDialog
          isDialogOpen={isDialogOpen}
          isDragging={isDragging}
          newTestName={newTestName}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          selectedFile={selectedFile}
          setNewTestName={setNewTestName}
          setSelectedFile={setSelectedFile}
        />
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Одоогоор жишиг шалгалт оруулаагүй байна</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Эхний шалгалтаа оруулах
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Link key={test.id} href={`/teacher/question-bank/${test.id}`}>
              <Card className="h-full cursor-pointer hover:border-foreground transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">{test.name}</CardTitle>
                  <CardDescription>
                    Оруулсан огноо: {test.uploadedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {test.fileType.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {test.fileName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
