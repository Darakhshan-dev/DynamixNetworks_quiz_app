import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, User, Brain, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              QuizMaster
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Test your knowledge with interactive quizzes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-xl transition-all hover:scale-105 cursor-pointer group" onClick={() => navigate("/admin")}>
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Admin Panel</h2>
              <p className="text-muted-foreground">
                Create and manage quiz questions with AI assistance
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  <Zap className="h-3 w-3 inline mr-1" />
                  AI Generation
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                  Question Bank
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                  Difficulty Levels
                </span>
              </div>
              <Button className="w-full mt-4" size="lg">
                Enter Admin Panel
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all hover:scale-105 cursor-pointer group" onClick={() => navigate("/user-select")}>
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <User className="h-12 w-12 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">Take Quiz</h2>
              <p className="text-muted-foreground">
                Challenge yourself with randomized questions
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  Multiple Subjects
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                  Shuffled Questions
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                  Score Tracking
                </span>
              </div>
              <Button className="w-full mt-4" size="lg" variant="secondary">
                Start Quiz
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Choose your role to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
