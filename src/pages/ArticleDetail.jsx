import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";

const ArticleDetail = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/articles/${id}`);
        setArticle(res.data.article);
      } catch (err) {
        setError("Article not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Loader text="Loading articles..." />
    );
  }

  if (error || !article) {
    return (
      <div className="text-center mt-20 text-amber-accent">
        {error}
      </div>
    );
  }

  const tagList = article.tags
    ? article.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-fade-up">
      
      {/* Title */}
      <div>
        <h1 className="text-4xl font-display mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-dim">
          <span>
            By <span className="text-cream">{article.author.username}</span>
          </span>

          <span>•</span>

          <span>
            {new Date(article.createdAt).toLocaleDateString()}
          </span>

          {article.updatedAt !== article.createdAt && (
            <>
              <span>•</span>
              <span>Updated</span>
            </>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs bg-ink-700 border border-ink-600 text-amber-accent">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div
        className="prose prose-invert max-w-none
                   prose-headings:text-cream
                   prose-p:text-slate
                   prose-strong:text-cream
                   prose-code:text-amber-accent"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-6 border-t border-ink-600">
          {tagList.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-ink-700 border border-ink-600 text-slate"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;