import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      className="auth-card hover:border-amber-accent transition"
    >
      <div className="bg-ink-800 border border-ink-600 rounded-xl p-6 hover:border-amber-accent transition duration-200 group">
        <h2 className="text-xl font-display mb-3 group-hover:text-amber-light transition">
          {article.title}
        </h2>

        <p className="text-slate text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        <div className="flex justify-between items-center text-xs text-slate-dim">
          <span className="px-2 py-1 bg-ink-700 rounded-full border border-ink-600">
            {article.category}
          </span>

          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
