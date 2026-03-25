"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { saveQuestionBankTests, useQuestionBankTests } from "@/hooks/use-question-bank-tests";
import { useTeacherSession } from "@/hooks/use-teacher-session";
import { type MockTest } from "@/lib/mock-data";

export default function QuestionBankPage() {
  const { teacherId, teacherName } = useTeacherSession();
  const allTests = useQuestionBankTests();
  const tests = allTests.filter((test) => test.teacherId === teacherId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!newTestName || !selectedFile) return;

    const newTest: MockTest = {
      id: `mt-${Date.now()}`,
      name: newTestName,
      fileName: selectedFile.name,
      fileType: selectedFile.name.split(".").pop() || "pdf",
      uploadedAt: new Date().toISOString().split("T")[0],
      teacherId,
    };

    saveQuestionBankTests([...allTests, newTest]);
    setNewTestName("");
    setSelectedFile(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Practice Materials</h1>
          <p className="text-muted-foreground">Upload and manage study packs for {teacherName || "your"} students</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload Material</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Practice Material</DialogTitle>
              <DialogDescription>Add a new revision set, worksheet, or practice paper for your students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Material Title</Label>
                <Input
                  id="testName"
                  placeholder="e.g., Algebra Review Set, Reading Skills Pack"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Test File (PDF or Word)</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelectedFile(null)}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-muted-foreground">Drag and drop your file here, or</p>
                      <label htmlFor="fileInput">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newTestName || !selectedFile}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No practice materials uploaded yet</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Upload Your First Material</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Link key={test.id} href={`/teacher/question-bank/${test.id}`}>
              <Card className="h-full cursor-pointer transition-colors hover:border-foreground">
                <CardHeader>
                  <CardTitle className="text-base">{test.name}</CardTitle>
                  <CardDescription>Uploaded on {test.uploadedAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{test.fileType.toUpperCase()}</Badge>
                    <span className="text-sm text-muted-foreground">{test.fileName}</span>
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
