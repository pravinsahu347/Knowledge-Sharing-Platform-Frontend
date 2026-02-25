import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyArticles = async () => {
    try {
      const res = await API.get("/articles/user/my-articles");
      setArticles(res.data.articles);
    } catch (err) {
      console.error("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?",
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article deleted");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <Loader text="Loading articles..." />;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center mt-20 text-slate">
        You haven’t written any articles yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6 animate-fade-up">
      <h1 className="text-3xl font-display">My Articles</h1>

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-ink-800 border border-ink-600 rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-display">{article.title}</h2>
              <p className="text-slate text-sm mt-1">{article.category}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/edit/${article.id}`)}
                className="text-amber-accent hover:text-amber-light"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(article.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
