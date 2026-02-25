import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { createArticle, aiAssist } from "../services/article.service";

const CreateArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  // Generic AI handler
  const handleAI = async (mode) => {
    if (!content) return alert("Write some content first.");

    try {
      setLoadingAI(true);
      const res = await aiAssist({
        content,
        title,
        mode,
      });

      const result = res.data.result;

      if (mode === "title") {
        const suggestions = result.titles
          .split("\n")
          .filter((line) => line.trim() !== "");
        setTitleSuggestions(suggestions);
      } else if (mode === "tags") {
        setTags(result.tags);
      } else {
        setContent(result.content);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("AI error");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createArticle({ title, content, category, tags });
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 animate-fade-up">
      <h1 className="text-3xl font-display">Create Article</h1>

      {/* Title */}
      <input
        className="input-field"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Category */}
      <select
        className="input-field"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Tech">Tech</option>
        <option value="AI">AI</option>
        <option value="Backend">Backend</option>
        <option value="Frontend">Frontend</option>
        <option value="DevOps">DevOps</option>
        <option value="Database">Database</option>
        <option value="Security">Security</option>
        <option value="Other">Other</option>
      </select>

      {/* AI TOOLBAR */}
      <div className="bg-ink-800 border border-ink-600 rounded-lg p-4 space-y-4">
        <p className="text-sm font-mono text-slate uppercase tracking-widest">
          AI Writing Assistant
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleAI("improve")}
            className="btn-primary w-auto px-4"
          >
            Improve
          </button>

          <button
            type="button"
            onClick={() => handleAI("grammar")}
            className="btn-primary w-auto px-4"
          >
            Fix Grammar
          </button>

          <button
            type="button"
            onClick={() => handleAI("concise")}
            className="btn-primary w-auto px-4"
          >
            Make Concise
          </button>

          <button
            type="button"
            onClick={() => handleAI("title")}
            className="btn-primary w-auto px-4"
          >
            Suggest Title
          </button>

          <button
            type="button"
            onClick={() => handleAI("tags")}
            className="btn-primary w-auto px-4"
          >
            Suggest Tags
          </button>
        </div>

        {loadingAI && (
          <p className="text-amber-accent text-sm">AI is thinking...</p>
        )}
      </div>

      {/* Title Suggestions */}
      {titleSuggestions.length > 0 && (
        <div className="bg-ink-800 border border-ink-600 rounded-lg p-4">
          <p className="text-sm font-mono text-slate mb-3">Suggested Titles</p>
          <div className="space-y-2">
            {titleSuggestions.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTitle(t.replace(/^\d+\.\s*/, ""));
                  setTitleSuggestions([]);
                }}
                className="block w-full text-left text-cream hover:text-amber-light transition"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <Editor value={content} onChange={setContent} />

      {/* Tags */}
      <input
        className="input-field"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* Publish */}
      <button onClick={handleSubmit} className="btn-primary">
        Publish Article
      </button>
    </div>
  );
};

export default CreateArticle;
