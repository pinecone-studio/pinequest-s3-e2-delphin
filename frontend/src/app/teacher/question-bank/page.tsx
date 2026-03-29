"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import { toast } from "@/hooks/use-toast";
import { FileQuestion, Plus, Search } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  category: string;
  difficulty: "easy" | "standard" | "hard";
  points: number;
  variants: number;
  createdAt: string;
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "2 + 3 × 4 = ?",
      type: "multiple-choice",
      category: "Математик",
      difficulty: "easy",
      points: 10,
      variants: 3,
      createdAt: "2026-03-25",
    },
    {
      id: "2",
      question: "√16 = 5.",
      type: "true-false",
      category: "Математик",
      difficulty: "easy",
      points: 5,
      variants: 2,
      createdAt: "2026-03-25",
    },
    {
      id: "3",
      question: "Ардчилал гэж юу вэ?",
      type: "multiple-choice",
      category: "Нийгмийн ухаан",
      difficulty: "standard",
      points: 10,
      variants: 4,
      createdAt: "2026-03-24",
    },
  ]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const [aiMCCount, setAiMCCount] = useState(0);
  const [aiTFCount, setAiTFCount] = useState(0);
  const [aiShortCount, setAiShortCount] = useState(0);
  const [selectedSourceFiles, setSelectedSourceFiles] = useState<File[]>([]);
  const [isAiSourceDragging, setIsAiSourceDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiVariants, setAiVariants] = useState(1);
  const [aiDifficulty, setAiDifficulty] = useState<
    "easy" | "standard" | "hard"
  >("standard");
  const [aiCategory, setAiCategory] = useState("");

  const categories = Array.from(
    new Set(questions.map((question) => question.category)),
  );
  const difficulties = ["easy", "standard", "hard"] as const;

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      question.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleGenerateAIQuestions = async () => {
    if (selectedSourceFiles.length === 0) {
      toast({
        title: "Алдаа",
        description: "Эх сурвалж файл сонгоно уу",
        variant: "destructive",
      });
      return;
    }

    const totalQuestions = aiMCCount + aiTFCount + aiShortCount;
    if (totalQuestions === 0) {
      toast({
        title: "Алдаа",
        description: "Асуултын тоо оруулна уу",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const now = new Date().toISOString();
      const generatedQuestions: Question[] = [];

      for (let variant = 1; variant <= aiVariants; variant++) {
        for (let index = 0; index < aiMCCount; index++) {
          generatedQuestions.push({
            id: `ai-mc-${Date.now()}-${variant}-${index}`,
            question: `AI үүсгэсэн сонгох хариулттай асуулт (Хувилбар ${variant}) ${index + 1}`,
            type: "multiple-choice",
            category: aiCategory || "AI үүсгэсэн",
            difficulty: aiDifficulty,
            points: 10,
            variants: aiVariants,
            createdAt: now,
          });
        }

        for (let index = 0; index < aiTFCount; index++) {
          generatedQuestions.push({
            id: `ai-tf-${Date.now()}-${variant}-${index}`,
            question: `AI үүсгэсэн үнэн/худал асуулт (Хувилбар ${variant}) ${index + 1}`,
            type: "true-false",
            category: aiCategory || "AI үүсгэсэн",
            difficulty: aiDifficulty,
            points: 5,
            variants: aiVariants,
            createdAt: now,
          });
        }

        for (let index = 0; index < aiShortCount; index++) {
          generatedQuestions.push({
            id: `ai-sa-${Date.now()}-${variant}-${index}`,
            question: `AI үүсгэсэн богино хариулттай асуулт (Хувилбар ${variant}) ${index + 1}`,
            type: "short-answer",
            category: aiCategory || "AI үүсгэсэн",
            difficulty: aiDifficulty,
            points: 10,
            variants: aiVariants,
            createdAt: now,
          });
        }
      }

      setQuestions((prev) => [...prev, ...generatedQuestions]);
      setShowAIDialog(false);
      setAiMCCount(0);
      setAiTFCount(0);
      setAiShortCount(0);
      setSelectedSourceFiles([]);
      setAiVariants(1);
      setAiDifficulty("standard");
      setAiCategory("");

      toast({
        title: "Амжилттай",
        description: `${generatedQuestions.length} асуулт (${totalQuestions} × ${aiVariants} хувилбар) үүсгэгдлээ`,
      });
    } catch {
      toast({
        title: "Алдаа",
        description: "Асуулт үүсгэхэд алдаа гарлаа",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuestionTypeLabel = (type: Question["type"]) => {
    switch (type) {
      case "multiple-choice":
        return "Сонгох хариулттай";
      case "true-false":
        return "Үнэн/Худал";
      case "short-answer":
        return "Богино хариулт";
      case "essay":
        return "Эсээ";
      default:
        return type;
    }
  };

  const getDifficultyLabel = (difficulty: Question["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "Хөнгөн";
      case "standard":
        return "Дунд";
      case "hard":
        return "Хэцүү";
      default:
        return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Асуултын сан</h1>
          <p className="text-muted-foreground">
            Шалгалт үүсгэхэд ашиглах асуултууд
          </p>
        </div>
        <Button onClick={() => setShowAIDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          AI ашиглан асуулт үүсгэх
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Асуулт хайх..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх ангилал</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Түвшин сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх түвшин</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {getDifficultyLabel(difficulty)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Асуулт олдсонгүй</p>
              <p className="text-sm">
                Шүүлтүүрийг өөрчилж эсвэл шинэ асуулт үүсгэнэ үү
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="mb-2 font-medium">{question.question}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {getQuestionTypeLabel(question.type)}
                      </Badge>
                      <Badge variant="secondary">{question.category}</Badge>
                      <Badge variant="outline">
                        {getDifficultyLabel(question.difficulty)}
                      </Badge>
                      <span>{question.points} оноо</span>
                      <span>{question.variants} хувилбар</span>
                      <span>Үүсгэсэн: {question.createdAt}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AIQuestionGeneratorDialog
        aiMCCount={aiMCCount}
        aiShortCount={aiShortCount}
        aiTFCount={aiTFCount}
        isDragging={isAiSourceDragging}
        isGenerating={isGenerating}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsAiSourceDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsAiSourceDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsAiSourceDragging(false);
          const files = Array.from(event.dataTransfer.files);
          setSelectedSourceFiles((prev) => [...prev, ...files]);
        }}
        onFileSelect={(event) => {
          if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedSourceFiles((prev) => [...prev, ...files]);
          }
          event.target.value = "";
        }}
        onGenerate={handleGenerateAIQuestions}
        onOpenChange={setShowAIDialog}
        onRemoveSourceFile={(fileName) => {
          setSelectedSourceFiles((prev) =>
            prev.filter((file) => file.name !== fileName),
          );
        }}
        onToggleTest={() => {}}
        open={showAIDialog}
        selectedMockTests={[]}
        selectedSourceFiles={selectedSourceFiles}
        setAiMCCount={setAiMCCount}
        setAiShortCount={setAiShortCount}
        setAiTFCount={setAiTFCount}
      />
    </div>
  );
}
