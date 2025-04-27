// 登録フォームページ
import React from "react";
import { useState, useEffect } from "react";

function Home() {
  // 入力フォーム用ステート
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  // 単語一覧ステート
  const [words, setWords] = useState([]);

  // 一覧取得(初回マウント時にuseEffect()でGET/wordsを実行)
  useEffect(() => {
    fetchWords();
  }, []);

  // GETリクエスト
  const fetchWords = async (e) => {
    const res = await fetch("http://localhost:8000/words");
    const data = await res.json();
    setWords(data);
  };

  // POSTリクエスト
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, meaning }),
    });

    // 入力欄クリア & 一覧更新
    setWord("");
    setMeaning("");
    fetchWords();
  };

  return (
    <div>
      <h1>英単語 登録ページ</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="英単語"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <input
          placeholder="意味"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
        />
        <button type="submit">登録</button>
      </form>
    </div>
  );
}

export default Home;
