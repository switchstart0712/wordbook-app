// Web検索API関連

// ベースURL（環境変数 or ローカル開発用）
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 単語一覧取得
export const getWords = async () => {
  const res = await fetch(`${API_BASE}/words`);
  if (!res.ok) throw new Error("単語の取得に失敗しました");
  return await res.json();
};

// 単語登録
export const addWord = async (word, meaning, memo) => {
  const res = await fetch(`${API_BASE}/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, meaning, memo }),
  });
  if (!res.ok) throw new Error("登録に失敗しました");
  return await res.json();
};

// 単語更新
export const updateWord = async (id, word, meaning, memo) => {
  const res = await fetch(`${API_BASE}/words/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, meaning, memo }),
  });
  if (!res.ok) throw new Error("編集に失敗しました");
  return await res.json();
};

// 単語削除
export const deleteWord = async (id) => {
  const res = await fetch(`${API_BASE}/words/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("削除に失敗しました");
};
