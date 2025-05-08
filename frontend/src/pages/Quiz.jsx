import React, { useEffect, useState, useMemo } from "react";
import BackToHomeButton from "./components/BackToHomeButton";
import PronounceButton from "./components/PronounceButton";

// クイズページ// src/pages/Quiz.jsx
function Quiz({ words }) {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedRange, setSelectedRange] = useState("all");
  const [questionCount, setQuestionCount] = useState(5);
  const [quizWords, setQuizWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  //4択ロジックのState
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [choices, setChoices] = useState([]);

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
    setSelectedChoice(null);
    setShowAnswer(false);
  };

  const currentWord = quizWords[currentIndex];

  useEffect(() => {
    if (isQuizStarted && currentWord) {
      const incorrect = words
        .filter((w) => w.word !== currentWord.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [...incorrect, currentWord].sort(
        () => 0.5 - Math.random()
      );
      setChoices(options);
      setSelectedChoice(null);
      setShowAnswer(false);
    }
  }, [currentWord, isQuizStarted]);

  const handleChoice = (choice) => {
    if (showAnswer) return;
    setSelectedChoice(choice);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizWords.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("クイズ終了！");
      setIsQuizStarted(false);
    }
  };

  const getButtonStyle = (choice) => {
    const isCorrect = choice.word === currentWord.word;
    const isSelected = choice === selectedChoice;

    let backgroundColor = "#f0f0f0";
    let color = "#333";

    if (showAnswer) {
      if (isCorrect) {
        backgroundColor = "#fa8072"; // 薄赤（正解）
        color = isSelected ? "black" : "#333";
      } else if (isSelected) {
        backgroundColor = "#87cefa"; // 薄青（不正解）
        color = "black";
      }
    }

    return {
      backgroundColor,
      color,
      padding: "1rem",
      fontSize: "1.2rem",
      border: "1px solid #ccc",
      borderRadius: "6px",
      cursor: showAnswer ? "default" : "pointer",
    };
  };

  return (
    <div
      style={{
        padding: isQuizStarted ? "0.5rem" : "2rem 1rem 1rem", // ← ここで上余白調整
        maxWidth: "100%",
        overflowX: "hidden",
        minHeight: "100vh", // 画面全体
        boxSizing: "border-box",
      }}
    >
      {!isQuizStarted && (
        <h2 style={{ textAlign: "center" }}>クイズに挑戦！</h2>
      )}

      {!isQuizStarted ? (
        <>
          <div>
            <h3>出題範囲</h3>
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
            <h3>出題数</h3>
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
          <div
            style={{
              border: "2px solid white",
              borderRadius: "8px",
              padding: "0.75rem 1rem", // ← 枠内左右余白UP
              textAlign: "center",
              margin: "0.5rem 1rem",   // ← 枠の外側左右余白UP
              backgroundColor: "#222", // 暗背景
              color: "white",
              display: "inline-block",
            }}
          >
            <h2 style={{ fontSize: "2rem", margin: 0 }}>
              {currentWord.word}
              <PronounceButton text={currentWord.word} />
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "1fr",
              marginTop: "1rem",
            }}
          >
            {" "}
            {/*gridTemplateColumns: "1fr",で*/}
            {choices.map((choice) => (
              <button
                key={choice.word}
                onClick={() => handleChoice(choice)}
                disabled={showAnswer}
                style={getButtonStyle(choice)}
              >
                {choice.meaning}
              </button>
            ))}
          </div>

          {showAnswer && (
            <button
              style={{ marginTop: "1.5rem", padding: "0.5rem 1.5rem" }}
              onClick={handleNext}
            >
              次へ
            </button>
          )}
        </div>
      )}
      <BackToHomeButton />
    </div>
  );
}
export default Quiz;
