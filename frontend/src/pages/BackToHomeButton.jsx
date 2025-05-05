import React from "react";
import { useNavigate } from "react-router-dom";

const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      Homeへ戻る
    </button>
  );
};

export default BackToHomeButton;