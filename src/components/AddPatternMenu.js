import React from "react";
import { useNavigate } from "react-router-dom";

function AddPatternMenu({ onClose }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",              // Popup floats above page
        bottom: "110px",                // Position above + button
        right: "30px",
        background: "white",            // Change popup color here
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        padding: "20px",
        width: "200px",
        zIndex: 1000                    // Ensures popup is on top
      }}
    >
      {/* Popup Title */}
      <h3
        style={{
          marginTop: 0,
          marginBottom: "15px",
          fontSize: "1.2rem"
        }}
      >
        Add Pattern
      </h3>

      {/* Upload Pattern Option */}
      <button
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#e8d5ff",        // Change color here
          cursor: "pointer"
        }}
        onClick={() => {
          navigate("/upload");
          onClose();                    // Close popup after click
        }}
      >
        Upload Pattern
      </button>

      {/* Create Pattern Option */}
      <button
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#d9c4ff",        // Change color here
          cursor: "pointer"
        }}
        onClick={() => {
          navigate("/create");
          onClose();
        }}
      >
        Create Pattern
      </button>
    </div>
  );
}

export default AddPatternMenu;
