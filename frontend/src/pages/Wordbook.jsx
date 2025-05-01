// 一覧表示ページ
import React, { useState, useEffect } from "react";

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

  const [voice, setVoice] = useState(null);

  //編集
  const [editId, setEditId] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editMeaning, setEditMeaning] = useState("");

  const handleEdit = (word) => {
    setEditId(word.id);
    setEditWord(word.word);
    setEditMeaning(word.meaning);
  };

  const handleSave = () => {
    setWords((prevwords) =>
      prevwords.map((word) =>
        word.id == editId
          ? { ...word, word: editWord, meaning: editMeaning }
          : word
      )
    );
    setEditId(null); //編集終了
  };

  //削除
  const handleDelete = (id) => {
    const confirmed = window.confirm("この単語を削除しますか？");
    if (!confirmed) return;

    setWords((prevwords) => prevwords.filter((word) => word.id !== id));
  };

  // ✅ 音声読み込み（初回だけ）
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const enVoice = voices.find(
        (v) => v.lang === "en-US" && v.name.includes("Google")
      );
      if (enVoice) {
        setVoice(enVoice);
      } else {
        console.warn("音声がまだ読み込まれていません");
      }
    };

    loadVoices(); // 初回実行

    // イベントで再取得（Chromeなどで遅延するため）
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = (text) => {
    if (!voice) {
      console.error("音声が見つかりません");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = "en-US";
    utter.volume = 1;
    utter.pitch = 1;
    utter.rate = 1;

    utter.onstart = () => console.log(`発音開始：${text}`);
    utter.onerror = (e) => console.error("発音エラー:", e);

    speechSynthesis.cancel();
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
                <td>
                  {editId === item.id ? (
                    <input
                      value={editWord}
                      onChange={(e) => setEditWord(e.target.value)}
                    />
                  ) : (
                    item.word
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <input
                      value={editMeaning}
                      onChange={(e) => setEditMeaning(e.target.value)}
                    />
                  ) : (
                    item.meaning
                  )}
                </td>
                <td>
                  <button onClick={() => handleSpeak(item.word)}>🔊</button>
                </td>
                <td>{item.memo}</td>
                <td>{item.mistakeCount}</td>
                <td>
                  {editId === item.id ? (
                    <>
                      <button onClick={handleSave}>保存</button>
                      <button onClick={() => setEditId(null)}>
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)}>編集</button>
                      <button onClick={() => handleDelete(item.id)}>
                        削除
                      </button>
                    </>
                  )}
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
