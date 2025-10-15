import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserSelect = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("quizQuestions");
    if (stored) {
      const questions = JSON.parse(stored);
      const uniqueSubjects = Array.from(new Set(questions.map((q: any) => q.subject)));
      setSubjects(uniqueSubjects as string[]);
    }
  }, []);

  const handleStartQuiz = () => {
    if (!selectedSubject || !selectedDifficulty) return;
    
    navigate("/quiz", {
      state: {
        subject: selectedSubject,
        difficulty: selectedDifficulty,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="mb-4 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Start Your Quiz
        </h1>

        <div className="space-y-6">
          <div>
            <Label className="text-base mb-2">Select Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No subjects available
                  </SelectItem>
                ) : (
                  subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base mb-2">Select Difficulty</Label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleStartQuiz}
            disabled={!selectedSubject || !selectedDifficulty}
            className="w-full mt-6"
            size="lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserSelect;
