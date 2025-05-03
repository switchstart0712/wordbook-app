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
  const [editMemo, setEditMemo] = useState("");
  //編集中かどうかの状態管理 
  const [isEditing, setIsEditing] = useState(false);
  //新しい単語登録用のStateを定義
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newMemo, setNewMemo] = useState("");
  

  const handleEdit = (word) => {
    setIsEditing(true); //新規登録ボタンを無効に
    setEditId(word.id); //IDベースで編集対象を特定
    setEditWord(word.word);
    setEditMeaning(word.meaning);
    setEditMemo(word.memo);
  };

  const handleSave = () => {
    setWords((prevwords) =>
      prevwords.map((word) =>
        word.id === editId //IDで対象を照合
          ? { ...word, word: editWord, meaning: editMeaning, memo: editMemo }
          : word
      )
    );
    setEditId(null); //編集終了
    setIsEditing(false);
  };

  //登録
  const handleAdd = () => {
    if (isEditing) {
      alert("編集中は新規登録できません。");
      return;
    } //編集中は登録させない
  
    if (!newWord.trim() || !newMeaning.trim()) {
      alert("英単語と意味は必須です。");
      return;
    }

    //重複チェック
    const duplicate = words.some(w => w.word.toLowerCase() === newWord.trim().toLowerCase());
    if (duplicate) {
      alert("この単語はすでに登録されています。");
      return;
    }
  
    const newItem = {
      id: Date.now(),
      word: newWord,
      meaning: newMeaning,
      memo: newMemo,
      mistakeCount: 0,
    };
  
    setWords(prev => [...prev, newItem]);
    setNewWord("");
    setNewMeaning("");
    setNewMemo("");
  };
  
  //Enterキーでも登録できるように
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
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
                <td>
                  {editId === item.id ? (
                    <input
                      value={editMemo}
                      onChange={(e) => setEditMemo(e.target.value)}
                    />
                  ) : (
                    item.memo
                  )}
                </td>
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

<tr>
              <td>
                <input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="英単語"
                />
              </td>
              <td>
                <input
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="意味"
                />
              </td>
              <td></td>
              <td>
                <input
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="メモ"
                />
              </td>
              <td>0</td>
              <td>
                <button onClick={handleAdd}>登録</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wordbook;
