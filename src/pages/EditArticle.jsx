import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import API from "../api/axios";
import { aiAssist } from "../services/article.service";
import Loader from "../components/Loader";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/articles/${id}`);
        const article = res.data.article;

        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
        setTags(article.tags || "");
      } catch (err) {
        alert("Article not found or unauthorized");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleAI = async (mode) => {
    if (!content) return alert("Write some content first.");

    try {
      setLoadingAI(true);
      const res = await aiAssist({ content, title, mode });
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
    } catch {
      alert("AI error");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      await API.put(`/articles/${id}`, {
        title,
        content,
        category,
        tags,
      });

      navigate("/dashboard");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading articles..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 animate-fade-up">
      <h1 className="text-3xl font-display">Edit Article</h1>

      {/* Title */}
      <input
        className="input-field"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article Title"
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

      {/* AI Toolbar */}
      <div className="bg-ink-800 border border-ink-600 rounded-lg p-4 space-y-4">
        <p className="text-sm font-mono text-slate uppercase tracking-widest">
          AI Writing Assistant
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAI("improve")}
            className="btn-primary w-auto px-4"
          >
            Improve
          </button>

          <button
            onClick={() => handleAI("grammar")}
            className="btn-primary w-auto px-4"
          >
            Fix Grammar
          </button>

          <button
            onClick={() => handleAI("concise")}
            className="btn-primary w-auto px-4"
          >
            Make Concise
          </button>

          <button
            onClick={() => handleAI("title")}
            className="btn-primary w-auto px-4"
          >
            Suggest Title
          </button>

          <button
            onClick={() => handleAI("tags")}
            className="btn-primary w-auto px-4"
          >
            Suggest Tags
          </button>
        </div>

        {loadingAI && <Loader text="Loading..." />}
      </div>

      {/* Title Suggestions */}
      {titleSuggestions.length > 0 && (
        <div className="bg-ink-800 border border-ink-600 rounded-lg p-4">
          {titleSuggestions.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTitle(t.replace(/^\d+\.\s*/, ""));
                setTitleSuggestions([]);
              }}
              className="block w-full text-left text-cream hover:text-amber-light"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <Editor value={content} onChange={setContent} />

      {/* Tags */}
      <input
        className="input-field"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />

      {/* Save */}
      <button onClick={handleUpdate} className="btn-primary" disabled={saving}>
        {saving ? "Updating..." : "Update Article"}
      </button>
    </div>
  );
};

export default EditArticle;
