import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./pages/Search";
import Wordbook from "./pages/Wordbook";
import Quiz from "./pages/Quiz";
import Home from "./pages/Home";
import NotFound from "./pages/Notfound";
import "./App.css";

function App() {
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wordbook" element={<Wordbook />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;
