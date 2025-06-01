// Web検索API関連

//axiosを導入することでbaseURLやContent-Typeの指定を毎回書かずに済み、保守性も上がる
import axios from "./axios"; // 共通のaxiosインスタンスを使う

// 単語一覧取得
export const getWords = async () => {
  const response = await axios.get("/words");
  return response.data;
};

// 単語登録
export const addWord = async (word, meaning, memo) => {
  const response = await axios.post("/words", {
    word,
    meaning,
    memo,
  });
  return response.data;
};

// 単語更新
export const updateWord = async (id, word, meaning, memo) => {
  const response = await axios.put(`/words/${id}`, {
    word,
    meaning,
    memo,
  });
  return response.data;
};

// 単語削除
export const deleteWord = async (id) => {
  await axios.delete(`/words/${id}`);
};
