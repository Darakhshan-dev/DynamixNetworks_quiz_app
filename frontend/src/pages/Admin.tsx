import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AddQuestion from '../components/AddQuestion';
import QuestionList from '../components/QuestionList';

interface Question {
  _id: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

 useEffect(() => {
  async function fetchQuestions() {
    try {
      const response = await axios.get("http://localhost:5000/api/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  }
  fetchQuestions();
}, []);


 const saveQuestions = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/questions");
    setQuestions(response.data);
    localStorage.setItem("quizQuestions", JSON.stringify(response.data));
  } catch (error) {
    console.error("Failed to fetch questions", error);
  }
};

const [aiPrompt, setAiPrompt] = useState("");         // for custom Gemini prompt (optional)
const [aiNumQuestions, setAiNumQuestions] = useState(5); // for number of AI questions to generate
const [aiLoading, setAiLoading] = useState(false);    // for loading spinner
const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);


const handleGenerate = async () => {
  setAiLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/api/ai/generate", {
      subject: formData.category,
      difficulty: formData.difficulty,
      numQuestions: aiNumQuestions,
      prompt: aiPrompt,
    });

    // Ensure data comes as array
    const generated = Array.isArray(res.data)
      ? res.data
      : JSON.parse(res.data);

    setGeneratedQuestions(generated);
    
    toast({
      title: "AI Questions Generated",
      description: "Now reviewing questions before adding them to the database.",
    });

    // Redirect to Review Page with generated questions
    navigate("/admin/ai-review", { state: { questions: generated, prompt: aiPrompt } });

  } catch (err) {
    toast({
      title: "AI Generation Error",
      description: "Failed to generate AI questions",
      variant: "destructive",
    });
  }
  setAiLoading(false);
};



  const handleAddQuestion = async () => {
  if (!formData.category || !formData.question || formData.options.some(opt => !opt)) {
    toast({
      title: "Missing fields",
      description: "Please fill all fields before adding",
      variant: "destructive",
    });
    return;
  }

  try {
    // Send question to backend MongoDB API
    const response = await axios.post('http://localhost:5000/api/questions', {
  category: formData.category,
  difficulty: formData.difficulty,
  question: formData.question,
  options: formData.options,
  correctAnswer: formData.correctAnswer,
});


    // Use the returned saved question from backend instead of local storage
    const newQuestion = response.data;

    // Add question to state
    setQuestions([...questions, newQuestion]);

    // Clear form
    setFormData({
      category: "",
      difficulty: "easy",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });

    toast({
      title: "Question added",
      description: "Question successfully added to database",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add question to backend",
      variant: "destructive",
    });
  }
};

 const handleDeleteQuestion = async (id: string) => {
   console.log('Deleting question with id:', id);
  try {
    await axios.delete(`http://localhost:5000/api/questions/${id}`);

    toast({
      title: "Question deleted",
      description: "Question removed from database",
    });
    await saveQuestions(); // reload fresh from backend
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete question from backend",
      variant: "destructive",
    });
  }
};


  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" />
              Add New Question
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="e.g., Mathematics, Science"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Question</Label>
                <Textarea
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Options</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant={formData.correctAnswer === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, correctAnswer: index })}
                    >
                      {formData.correctAnswer === index ? "✓" : index + 1}
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  Click the number button to mark correct answer
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddQuestion} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
              
            </div>
            <div className="mt-6 space-y-2">
  <Label>AI Question Prompt (optional)</Label>
  <Textarea
    placeholder="Custom Gemini prompt for AI generation"
    value={aiPrompt}
    onChange={e => setAiPrompt(e.target.value)}
    rows={2}
  />
  <Label>Number of AI Questions</Label>
  <Input
    type="number"
    min={1}
    max={20}
    value={aiNumQuestions}
    onChange={e => setAiNumQuestions(Number(e.target.value))}
  />
  <Button
    variant="outline"
    className="flex items-center gap-2"
    onClick={handleGenerate}
    disabled={aiLoading}
  >
    <Sparkles className="h-4 w-4" />
    {aiLoading ? "Generating..." : "AI Generate"}
  </Button>
</div>

            
          </Card>

          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Question Bank</h2>
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {questions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No questions yet. Add your first question!
                </p>
              ) : (
                questions.map((q) => (
                  <Card key={q._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {q.category}
                          </span>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="font-medium mb-2">{q.question}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className={idx === q.correctAnswer ? "text-primary font-medium" : ""}>
                              {idx + 1}. {opt} {idx === q.correctAnswer && "✓"}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
