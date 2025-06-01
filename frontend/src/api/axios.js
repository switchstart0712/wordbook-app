// axiosインスタンス
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  //5秒の制限を儲けることで異常検知とリトライの判断が明確になる
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 共通エラーハンドリング(UX向上)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;


