import { useState } from "react";
import axios from "axios";

const AdminAIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    console.log('AI Generate button clicked!');
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate", {
        subject,
        difficulty,
        numQuestions,
        prompt, // If you want to use custom prompt, pass this to backend and use in the API call
      });
      setResult(res.data);
    } catch (err) {
      alert("AI generation failed");
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Prompt (optional)"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />
      <select
        value={difficulty}
        onChange={e => setDifficulty(e.target.value)}
      >
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input
        type="number"
        min={1}
        max={20}
        value={numQuestions}
        onChange={e => setNumQuestions(Number(e.target.value))}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate AI Questions"}
      </button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default AdminAIGenerator;
