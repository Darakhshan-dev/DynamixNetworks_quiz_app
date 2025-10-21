import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

interface Question {
  id: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  showResult: boolean;
  selectedAnswers: number[];
}

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, difficulty } = location.state || {};

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    showResult: false,
    selectedAnswers: [],
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Utility for shuffling array
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

useEffect(() => {
  if (!subject || !difficulty) {
    navigate("/user-select");
    return;
  }

  axios
    .get(`http://localhost:5000/api/questions?category=${subject}&difficulty=${difficulty}`
    )
    .then((res) => {
      const shuffledQuestions = shuffleArray(res.data).map((q: any) => {
        // Fix: create typed option objects
        type OptionObj = { opt: string; idx: number };
        const optionObjects: OptionObj[] = q.options.map((opt: string, idx: number) => ({ opt, idx }));
        const shuffledOptions: OptionObj[] = shuffleArray(optionObjects);
        const newCorrectAnswer = shuffledOptions.findIndex(
          (item) => item.idx === q.correctAnswer
        );

        return {
          id: q._id,
          subject: q.category,
          difficulty: q.difficulty,
          question: q.question,
          options: shuffledOptions.map((item) => item.opt),
          correctAnswer: newCorrectAnswer,
        };
      });

      setQuizState((prev) => ({
        ...prev,
        questions: shuffledQuestions,
      }));
    })
    .catch((err) => {
      console.error("Failed to fetch questions:", err);
      setQuizState((prev) => ({ ...prev, questions: [] }));
    });
}, [subject, difficulty, navigate]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === quizState.questions[quizState.currentIndex].correctAnswer;
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    const newSelectedAnswers = [...quizState.selectedAnswers, selectedOption];

    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        currentIndex: quizState.currentIndex + 1,
        score: newScore,
        selectedAnswers: newSelectedAnswers,
      });
      setSelectedOption(null);
    } else {
      setQuizState({
        ...quizState,
        score: newScore,
        showResult: true,
        selectedAnswers: newSelectedAnswers,
      });
    }
  };

  const handleRestart = () => {
    navigate("/user-select");
  };

  if (quizState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">
            No questions found for {subject} - {difficulty}
          </p>
          <Button onClick={() => navigate("/user-select")}>Go Back</Button>
        </Card>
      </div>
    );
  }

  if (quizState.showResult) {
    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="p-8 max-w-2xl w-full text-center shadow-lg">
          <div className="mb-6">
            <Trophy className="h-20 w-20 mx-auto text-primary mb-4" />
            <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent my-6">
              {percentage}%
            </p>
            <p className="text-xl text-muted-foreground">
              You scored {quizState.score} out of {quizState.questions.length}
            </p>
          </div>

          <Progress value={percentage} className="h-4 mb-8" />

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} size="lg" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Try Another Quiz
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progress = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/user-select")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
              {subject}
            </span>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-secondary/10 text-secondary">
              {difficulty}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {quizState.currentIndex + 1} of {quizState.questions.length}</span>
            <span>Score: {quizState.score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>
          
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 text-left rounded-lg border-2 transition-all ${
                  selectedOption === index
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            size="lg"
            className="min-w-32"
          >
            {quizState.currentIndex === quizState.questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
