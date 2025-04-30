// 一覧表示ページ
import React, { useState } from "react";

function Wordbook() {
  const [words, setWords] = useState([
    {
      id: 1,
      word: "apple",
      meaning: "りんご",
      memo: "果物の例",
      mistakeCount: 2,
    },
    {
      id: 2,
      word: "book",
      meaning: "本",
      memo: "名詞",
      mistakeCount: 0,
    },
  ]);

  //音声を再生する
  const handleSpeak = (text) => {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === "Google US English");

    if (!voice) {
      console.error("音声が見つかりません");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utterance.lang = "en-US";

    utter.onstart = () => console.log(`発音中：${text}`);
    utter.onerror = (e) => console.error("エラー：", e);

    speechSynthesis.cancel(); //キューをリセット
    speechSynthesis.speak(utter);
  };

  

  return (
    <div style={{ padding: "2rem" }}>
      <h2>単語帳ページ</h2>
      {words.length === 0 ? (
        <p>まだ単語が登録されていません。</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>英単語</th>
              <th>意味</th>
              <th>発音</th>
              <th>メモ</th>
              <th>間違えた回数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {words.map((item) => (
              <tr key={item.id}>
                <td>{item.word}</td>
                <td>{item.meaning}</td>
                <td>
                  <button onClick={() => handleSpeak(item.word)}>🔊</button>
                </td>
                <td>{item.memo}</td>
                <td>{item.mistakeCount}</td>
                <td>
                  <button disabled>編集</button> <button disabled>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wordbook;
