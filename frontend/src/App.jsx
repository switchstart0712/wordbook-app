import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./pages/Search";
import Wordbook from "./pages/Wordbook";
import Quiz from "./pages/Quiz";
import Home from "./pages/Home";
import NotFound from "./pages/Notfound";
import "./App.css";

function App() {
  const [words, setWords] = useState([
      {
        id: 1,
        word: "apple",
        meaning: "りんご",
        memo: "果物の例",
        mistakeCount: 2,
        createdAt: "2025-05-01",
      },
      {
        id: 2,
        word: "book",
        meaning: "本",
        memo: "名詞",
        mistakeCount: 0,
        createdAt: "2025-05-03",
      },
      {
        id: 3,
        word: "confirm",
        meaning: "確認する",
        memo: "東大2023年出題",
        mistakeCount: 5,
        createdAt: "2025-05-07",
      },
      {
        id: 4,
        word: "Procrastination",
        meaning: "先延ばし",
        memo: "九大模試/河合",
        mistakeCount: 3,
        createdAt: "2025-05-08",
      },
    ]);
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wordbook" element={<Wordbook words={words} setWords={setWords}/>} />
          <Route path="/quiz" element={<Quiz words={words}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;
