import React, { useState } from "react";
import PronounceButton from "./components/PronounceButton";
import BackToHomeButton from "./components/BackToHomeButton";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);

  // 仮の検索処理（本来はAPI呼び出し）
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // ダミーデータ：本番はAPI連携
    const dummyResult = {
      word: searchTerm.trim(),
      meaning: "○○",
    };

    setResult(dummyResult);
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "100%",
        overflowX: "hidden", // 横スクロール防止
      }}
    >
      <h2 style={{ textAlign: "center" }}>英単語検索</h2>

      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <input
          type="text"
          placeholder="英単語を入力..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "0.5rem",
            width: "80%", // スマホでも収まる幅に
            maxWidth: "300px",
            marginBottom: "0.5rem",
          }}
        />
        <br />
        <button onClick={handleSearch}>検索</button>
      </div>

      <div
        style={{
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1rem",
          maxWidth: "500px",
          backgroundColor: "#f4a460",
          minHeight: "80px",
        }}
      >
        {result ? (
          <>
            <h3>
              {result.word}
              <PronounceButton text={result.word} />
            </h3>
            <p>意味：{result.meaning}</p>
            <button>登録</button>
          </>
        ) : (
          <p style={{ color: "white" }}>ここに検索結果が表示されます</p>
        )}
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <BackToHomeButton />
      </div>
    </div>
  );
}

export default Search;
