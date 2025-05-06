import React, { useState, useMemo } from "react";
import BackToHomeButton from "./components/BackToHomeButton";

// クイズページ// src/pages/Quiz.jsx
function Quiz({ words }) {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedRange, setSelectedRange] = useState("all");
  const [questionCount, setQuestionCount] = useState(5);
  const [quizWords, setQuizWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStart = () => {
    // フィルター処理
    let filtered = [...words];
    const now = new Date();

    if (selectedRange === "mistake") {
      filtered = filtered.filter((w) => w.mistakeCount > 0);
    } else if (selectedRange === "week") {
      filtered = filtered.filter(
        (w) => new Date(w.createdAt) >= new Date(now.setDate(now.getDate() - 7))
      );
    } else if (selectedRange === "month") {
      filtered = filtered.filter(
        (w) =>
          new Date(w.createdAt) >= new Date(now.setMonth(now.getMonth() - 1))
      );
    }

    // シャッフルして出題数分だけ選ぶ
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);

    setQuizWords(selected);
    setIsQuizStarted(true);
    setCurrentIndex(0);
  };

  const currentWord = quizWords[currentIndex];

  const handleNext = () => {
    if (currentIndex + 1 < quizWords.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("クイズ終了！");
      setIsQuizStarted(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>クイズに挑戦！</h1>

      {!isQuizStarted ? (
        <>
          <div>
            <h4>出題範囲</h4>
            {["all", "week", "month", "mistake"].map((val) => (
              <label key={val} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  value={val}
                  checked={selectedRange === val}
                  onChange={(e) => setSelectedRange(e.target.value)}
                />
                {
                  {
                    all: "全範囲",
                    week: "過去一週間",
                    month: "過去1カ月",
                    mistake: "間違えた単語",
                  }[val]
                }
              </label>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4>出題数</h4>
            {[5, 10, 20].map((num) => (
              <label key={num} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  value={num}
                  checked={questionCount === num}
                  onChange={() => setQuestionCount(num)}
                />
                {num}問
              </label>
            ))}
          </div>

          <button style={{ marginTop: "1rem" }} onClick={handleStart}>
            スタート
          </button>
        </>
      ) : (
        <div>
          <p>
            第 {currentIndex + 1} 問 / {quizWords.length}
          </p>
          <h3>{currentWord.word}</h3>
          <p>意味：{currentWord.meaning}</p>
          <button onClick={handleNext}>次へ</button>
        </div>
      )}
      <BackToHomeButton />
    </div>
  );
}
export default Quiz;
