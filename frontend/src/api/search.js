// クイズAPI関連

//axiosを導入することでbaseURLやContent-Typeの指定を毎回書かずに済み、保守性も上がる
import axios from "./axios"; // 共通のaxiosインスタンスを使う

// 外部辞書APIから意味を取得
export const fetchDefinition = async (word) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const res = await axios.get(url); // axiosはfetchと違って自動でJSON化される
  return res.data;
};

// 単語をFastAPIに登録
export const registerWord = async (word, meaning) => {
  await axios.post("/words", {
    word,
    meaning,
    memo: "",
    mistakeCount: 0,
  });
};
