import API from "../api/axios";

export const getArticles = (params) => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  API.get("/articles", { params });
};

export const createArticle = (data) => API.post("/articles", data);

export const aiAssist = (data) => API.post("/articles/ai/assist", data);
