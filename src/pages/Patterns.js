
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Patterns() {
  const navigate = useNavigate();
  // ------------------------------------------------------------
  // PATTERN DATA (placeholder until Firebase is connected)
  // You will replace this with real data later.
  // ------------------------------------------------------------
  const [patterns, setPatterns] = useState([
    {
      id: 1,
      name: "Pattern #1",               // Pattern name shown in dropdown header
      description: "Short description", // Shown when dropdown opens
      details: "More detailed info",    // Shown when dropdown opens
      open: false                       // Controls dropdown open/close
    },
    {
      id: 2,
      name: "Pattern #2",
      description: "Another description",
      details: "More details here",
      open: false
    }
  ]);

  // ------------------------------------------------------------
  // FUNCTION: Toggles dropdown open/close
  // can style the arrow, animation, etc. later.
  // ------------------------------------------------------------
  const toggleDropdown = (id) => {
    setPatterns((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, open: !p.open } : p
      )
    );
  };

  return (
    <div
      style={{
        padding: "40px",          // Change page padding here
        maxWidth: "900px",        // Change page width here
        margin: "0 auto"          // Centers the page
      }}
    >
      {/* --------------------------------------------------------
          PAGE TITLE
          Change font size, color, spacing here
      --------------------------------------------------------- */}
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px"
          // color: "#yourColor"
        }}
      >
        Patterns
      </h1>

      {/* --------------------------------------------------------
          ADD BUTTON (+)
          This is your floating circle button from the sketch.
          You can change size, color, position, shadow, etc.
      --------------------------------------------------------- */}
      <button
        style={{
          position: "fixed",       // Makes it float on screen
          bottom: "30px",          // Distance from bottom
          right: "30px",           // Distance from right
          width: "60px",           // Button size
          height: "60px",
          borderRadius: "50%",     // Makes it a circle
          background: "#e8d5ff",   // Change button color here
          border: "none",
          fontSize: "2rem",        // Size of the +
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)" // Optional shadow
        }}
        onClick={() => navigate("/upload")}
      >
        +
      </button>

      {/* --------------------------------------------------------
          PATTERN LIST
          Each pattern is displayed in a card-style box.
          You can change border, background, spacing, etc.
      --------------------------------------------------------- */}
      <div>
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            style={{
              border: "1px solid #ddd",     // Change border color
              borderRadius: "10px",         // Change corner roundness
              padding: "20px",              // Change card padding
              marginBottom: "20px",         // Space between cards
              background: "#fff"            // Change card background
            }}
          >
            {/* ----------------------------------------------------
                PATTERN HEADER (click to open dropdown)
                can style the arrow, hover effect, spacing, etc.
            ----------------------------------------------------- */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() => toggleDropdown(pattern.id)}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.5rem"
                  // color: "#yourColor"
                }}
              >
                {pattern.name}
              </h2>

              {/* Dropdown arrow */}
              <span style={{ fontSize: "1.5rem" }}>
                {pattern.open ? "▲" : "▼"}
              </span>
            </div>

            {/* ----------------------------------------------------
                DROPDOWN CONTENT
                Only shows when pattern.open === true
                can style spacing, fonts, colors, etc.
            ----------------------------------------------------- */}
            {pattern.open && (
              <div style={{ marginTop: "10px" }}>
                <p>
                  <strong>Description:</strong> {pattern.description}
                </p>

                <p>
                  <strong>Details:</strong> {pattern.details}
                </p>

                {/* ------------------------------------------------
                    VIEW PATTERN BUTTON
                    Takes user to full pattern page later.
                    Change colors, borders, hover effects here.
                ------------------------------------------------- */}
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    background: "#e8d5ff",   // Change button color
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => alert("Open full pattern page")}
                >
                  View Pattern
                </button>

                {/* ------------------------------------------------
                    AI INSIGHT BUTTON
                    
                    “GO TO INSIGHT to see which yarn would be best”
                ------------------------------------------------- */}
                <button
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "10px 15px",
                    background: "#fff",
                    border: "2px solid #e8d5ff", // Outline color
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => alert("Go to AI Insight")}
                >
                  AI Insight
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Patterns;

