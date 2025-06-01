// 単語帳API関連の処理

//axiosを導入することでbaseURLやContent-Typeの指定を毎回書かずに済み、保守性も上がる
import axios from "./axios"; // 共通のaxiosインスタンスを使う

// 単語一覧を取得（クイズ出題用）
export const getQuizWords = async () => {
  const response = await axios.get("/words");
  return response.data;
};

// mistakeCount を 1 増やす
export const markWordAsMistaken = async (id) => {
  await axios.patch(`/words/${id}/mistake`);
};
