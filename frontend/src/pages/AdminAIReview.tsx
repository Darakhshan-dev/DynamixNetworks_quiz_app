import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Question {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
}

function extractCategoryAndDifficultyFromPrompt(prompt: string) {
  if (!prompt) return { category: "", difficulty: "" };
  const lower = prompt.toLowerCase();

  const subjects = ["science", "math", "history", "english", "geography", "physics", "chemistry", "biology"];
  const difficulties = ["easy", "medium", "hard"];

  const category = subjects.find(subj => lower.includes(subj)) || "";
  const difficulty = difficulties.find(diff => lower.includes(diff)) || "";

  return {
    category: category ? category[0].toUpperCase() + category.slice(1) : "",
    difficulty,
  };
}

const AdminAIReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get generated questions passed from Admin page
  const questions: Question[] = location.state?.questions || [];

  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  // Select or deselect a question
  const toggleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Save selected questions to MongoDB
  const handleSaveSelected = async () => {
    if (selected.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one question before saving.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Fallbacks for missing fields to fix backend validation errors!
    const prompt = location.state?.prompt || "";
const { category: fallbackCategory, difficulty: fallbackDifficulty } = extractCategoryAndDifficultyFromPrompt(prompt);

const selectedQuestions = selected.map((i) => {
  const q = questions[i];
  return {
    category: q.category || fallbackCategory || "General",
    difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : fallbackDifficulty || "easy",
    question: q.question || "Untitled Question",
    options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["A", "B", "C", "D"],
    correctAnswer:
      typeof q.correctAnswer === "number" &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < (q.options ? q.options.length : 4)
        ? q.correctAnswer
        : 0,
  };
});


      await Promise.all(
        selectedQuestions.map((q) =>
          axios.post("http://localhost:5000/api/questions", q)
            .catch(e => {
              console.error("POST error for:", q, e?.response?.data);
              throw e;
            })
        )
      );

      toast({
        title: "Questions Saved",
        description: `${selectedQuestions.length} question(s) added to the database successfully.`,
      });

      navigate("/admin"); // Redirect back to admin panel
    } catch (error) {
      console.error("Save POST error:", error, error?.response);
      toast({
        title: "Save Error",
        description: "An error occurred while saving questions.",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Review and Select AI-Generated Questions
        </h1>

        {questions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No generated questions to review. Go back and generate again.
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <Card
                key={index}
                className={`p-4 shadow-md transition ${
                  selected.includes(index)
                    ? "border-primary ring-2 ring-primary"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.includes(index)}
                    onCheckedChange={() => toggleSelect(index)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold mb-2">{q.question}</p>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            i === q.correctAnswer
                              ? "text-primary font-medium"
                              : ""
                          }
                        >
                          {opt} {i === q.correctAnswer && "✓"}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Category: {q.category} • Difficulty: {q.difficulty}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button
            disabled={saving}
            onClick={handleSaveSelected}
            className="px-6 py-3"
          >
            {saving ? "Saving..." : "Save Selected Questions"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAIReview;
