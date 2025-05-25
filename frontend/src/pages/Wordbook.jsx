// 一覧表示ページ
import React, { useState, useEffect } from "react";
import BackToHomeButton from "./components/BackToHomeButton";
import PronounceButton from "./components/PronounceButton";
import useWindowWidth from "../hooks/useWindowWidth";
import { getWords, addWord, updateWord, deleteWord }from "../api/wordbook";

function Wordbook() {
  const [words, setWords] = useState([]);
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
  //非同期のためのState
  const [isLoading, setIsLoading] = useState(true);

  //スマホ用画面
  const width = useWindowWidth();
  const isMobile = width < 768;

  //初期データの取得をAPI経由
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await getWords();
        setWords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("単語の取得に失敗しました", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, []);

  const handleEdit = (word) => {
    setIsEditing(true); //新規登録ボタンを無効に
    setEditId(word.id); //IDベースで編集対象を特定
    setEditWord(word.word);
    setEditMeaning(word.meaning);
    setEditMemo(word.memo);
  };

  const handleSave = async () => {
    if (!editWord.trim() || !editMeaning.trim()) {
      alert("英単語と意味は必須です。");
      return;
    }

    try {
      const updatedWord = await updateWord(editId, editWord, editMeaning, editMemo);
      //APIレスポンスのデータでローカルstateを更新
      setWords((prevwords) =>
        prevwords.map((word) =>
          //IDで対象を照合
          word.id === editId ? updatedWord : word
        )
      );

      setEditId(null); //編集終了
      setIsEditing(false);
      //入力欄のリセット
      setEditWord("");
      setEditMeaning("");
      setEditMemo("");
    } catch (error) {
      alert("編集時にエラーが発生しました");
      console.error(error);
    }
  };

  //登録
  const handleAdd = async () => {
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

    try {
      const newItem = await addWord(newWord, newMeaning, newMemo);
      setWords((prev) => [newItem, ...prev]);// 新しいものを先頭に追加
      setNewWord("");
      setNewMeaning("");
      setNewMemo("");
    } catch (error) {
      alert("登録時にエラーが発生しました");
      console.error(error);
    }
  };

  //Enterキーでも登録できるように
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  //削除
  const handleDelete = async (id) => {
    const confirmed = window.confirm("この単語を削除しますか？");
    if (!confirmed) return;

    try {
      await deleteWord(id);
      setWords((prevWords) => prevWords.filter((word) => word.id !== id));
    } catch (error) {
      alert("削除時にエラーが発生しました");
      console.error(error);
    }
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

      {/* 🔽 ローディング中の表示 */}
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        // カード型のモバイルUIを挿入
        <>
          {/* 新規登録欄（カード上部） */}
          <div style={{
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            maxWidth: "100%",          // 親自身が画面幅以上にならないように
            boxSizing: "border-box",   // 親にも効かせる
          }}>
            <input
              placeholder="英単語"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                padding: "0.5rem",
                boxSizing: "border-box", //paddingを含めてwidth: 100%と解釈されるので、横幅をオーバーしない
              }}
            />
            <input
              placeholder="意味"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                padding: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <input
              placeholder="メモ"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                display: "block",
                margin: "0 auto 0.5rem",
                width: "100%",
                padding: "0.5rem",
                boxSizing: "border-box",
              }}
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
          <BackToHomeButton />
        </>
      )}
    </div>
  );
}

export default Wordbook;
