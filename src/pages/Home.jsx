import { useEffect, useState } from "react";
import { getArticles } from "../services/article.service";
import ArticleCard from "../components/ArticleCard";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchArticles = async () => {
    const res = await getArticles({ search, category });
    setArticles(res.data.articles);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-up">
      <div className="flex gap-4 mb-8">
        <input
          className="input-field"
          placeholder="Search articles..."
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchArticles();
          }}
        />

        <select
          className="input-field"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="AI">AI</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
        </select>

        <button onClick={fetchArticles} className="btn-primary w-auto px-6">
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Home;
