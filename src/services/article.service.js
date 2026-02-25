import API from "../api/axios";

export const getArticles = (params) =>
  API.get("/articles", { params });

export const createArticle = (data) =>
  API.post("/articles", data);

export const aiAssist = (data) =>
  API.post("/articles/ai/assist", data);