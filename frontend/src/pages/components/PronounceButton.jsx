import React, { useEffect, useState } from "react";

const PronounceButton = ({ text }) => {
  const [voice, setVoice] = useState(null);

  // ✅ 音声読み込み（初回だけ）
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // 遅延してる場合があるので再試行
        setTimeout(loadVoices, 500);
        return;
      }
      
      const enVoice =
        voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find((v) => v.lang === "en-US");
      if (enVoice) {
        setVoice(enVoice);
      } else {
        console.warn("音声がまだ読み込まれていません");
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
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

    speechSynthesis.cancel(); // 途中の再生を止める
    speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={handleSpeak}
      style={{
        marginLeft: "0.5rem",
        fontSize: "1.5rem",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      title="発音を聞く"
    >
      🔊
    </button>
  );
};

export default PronounceButton;
