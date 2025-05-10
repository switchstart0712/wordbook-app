// 一覧表示ページ
import React, { useState } from "react";
import BackToHomeButton from "./components/BackToHomeButton";
import PronounceButton from "./components/PronounceButton";
import useWindowWidth from "../hooks/useWindowWidth";

function Wordbook({ words, setWords }) {
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
  //検索・フィルター機能State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMistakesOnly, setFilterMistakesOnly] = useState(false);

  //スマホ用画面
  const width = useWindowWidth();
  const isMobile = width < 768;

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
    const duplicate = words.some(
      (w) => w.word.toLowerCase() === newWord.trim().toLowerCase()
    );
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

    setWords((prev) => [newItem, ...prev]);// 新しいものを先頭に追加
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

  //フィルター
  const filteredWords = words.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMistakeFilter = !filterMistakesOnly || item.mistakeCount > 1;
    return matchesSearch && matchesMistakeFilter;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h3>単語帳ページ</h3>
      {/* 検索・抽出フォームをここに挿入 */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="検索..."
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <label>
          <input
            type="checkbox"
            checked={filterMistakesOnly}
            onChange={(e) => setFilterMistakesOnly(e.target.checked)}
          />
          1回以上間違えた単語のみ表示
        </label>
      </div>

      {words.length === 0 ? (
        <p>まだ単語が登録されていません。</p>
      ) : (
        isMobile ? (
          // カード型のモバイルUIを挿入
          <>
            {/* 新規登録欄（カード上部） */}
            <div style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
            }}>
              <input
                placeholder="英単語"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                maxWidth: "300px",
                padding: "0.5rem", }}
              />
              <input
                placeholder="意味"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                maxWidth: "300px",
                padding: "0.5rem", }}
              />
              <input
                placeholder="メモ"
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                maxWidth: "300px",
                padding: "0.5rem", }}
              />
              <button onClick={handleAdd}>登録</button>
            </div>

            {/* 単語表示：カード形式 */}
            {filteredWords.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              > 
                {editId === item.id ? (
                <>
                  <input
                    value={editWord}
                    onChange={(e) => setEditWord(e.target.value)}
                    style={{ width: "100%", marginBottom: "0.5rem" }}
                  />
                  <input
                    value={editMeaning}
                    onChange={(e) => setEditMeaning(e.target.value)}
                    style={{ width: "100%", marginBottom: "0.5rem" }}
                  />
                  <input
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                    style={{ width: "100%", marginBottom: "0.5rem" }}
                  />
                  <button onClick={handleSave} style={{ marginRight: "0.5rem" }}>
                    保存
                  </button>
                  <button onClick={() => setEditId(null)}>キャンセル</button>
                </>
              ) : (
                <>
                <h2 style={{ marginBottom: "0.5rem" }}>
                  {item.word} <PronounceButton text={item.word} />
                </h2>
                <p>意味：{item.meaning}</p>
                <p>メモ：{item.memo}</p>
                <p>間違えた回数：{item.mistakeCount}</p>
                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: "0.5rem" }}>編集</button>
                  <button onClick={() => handleDelete(item.id)}>削除</button>
                </div>
              </>
            )}
          </div>
          ))}
          </>
        ) : (
          //PC：テーブル表示
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

              {filteredWords.map((item) => (
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
                    <PronounceButton text={item.word} />
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
            </tbody>
          </table>
        )
      )}
      <BackToHomeButton />
    </div>
  );
}

export default Wordbook;
