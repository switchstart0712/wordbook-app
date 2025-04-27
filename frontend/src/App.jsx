import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Wordbook from "./pages/Wordbook";
import Quiz from "./pages/Quiz";
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/wordbook">単語帳</Link> |{" "}
        <Link to="/quiz">クイズ</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wordbook" element={<Wordbook />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
