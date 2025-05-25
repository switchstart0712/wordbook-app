// 単語帳API関連の処理

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 単語一覧を取得（クイズ出題用）
export const getQuizWords = async () => {
  const response = await fetch(`${API_BASE}/words`);
  if (!response.ok) throw new Error("単語の取得に失敗しました");
  return await response.json();
};

// mistakeCount を 1 増やす
export const markWordAsMistaken = async (id) => {
  const response = await fetch(`${API_BASE}/words/${id}/mistake`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("mistakeCount 更新に失敗しました");
};
