import React, { useState } from "react";
import { fetchDefinition, registerWord } from "../api/search";
import PronounceButton from "./components/PronounceButton";
import BackToHomeButton from "./components/BackToHomeButton";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 辞書APIから意味を取得
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await fetchDefinition(searchTerm.trim());

      if (!data || data.title === "No Definitions Found") {
        setError("意味が見つかりませんでした。");
      } else {
        const definition = data[0].meanings[0]?.definitions[0]?.definition || "意味なし";
        setResult({
          word: searchTerm.trim(),
          meaning: definition,
        });
      }
    } catch (err) {
      console.error("検索エラー:", err);
      setError("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // SQLiteバックエンドに単語を登録
  const handleRegister = async () => {
    if (!result) return;

    try {
      await registerWord(result.word, result.meaning);
      alert("登録しました！");
    } catch (err) {
      console.error("登録エラー:", err);
      alert("登録に失敗しました");
    }
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
        {loading ? (
          <p style={{ color: "white" }}>読み込み中...</p>
        ) : error ? (
          <p style={{ color: "white" }}>{error}</p>
        ) : result ? (
          <>
            <h3>
              {result.word}
              <PronounceButton text={result.word} />
            </h3>
            <p>意味：{result.meaning}</p>
            <button onClick={handleRegister}>登録</button>
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
