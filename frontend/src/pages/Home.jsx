// 登録フォームページ
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
  const fetchWords = async () => {
    const res = await fetch("http://localhost:8000/words");
    const data = await res.json();
    setWords(data);
  };

  // POSTリクエスト
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8000/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, meaning }),
      });

      // 入力欄クリア & 一覧更新
      setWord("");
      setMeaning("");
      fetchWords();
    } catch (err) {
      console.error("登録に失敗しました", err);
    }
  };

  return (
    <>
    <h1>Wordbook for me</h1>
      <nav>
        <Link to="/search"><button>Web検索</button></Link>
        <Link to="/wordbook"><button>単語帳</button></Link>
        <Link to="/quiz"><button>クイズ</button></Link>
      </nav>
    </>
  );  
}

export default Home;
