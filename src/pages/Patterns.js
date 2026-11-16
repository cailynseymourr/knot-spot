import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatternMenu from "../components/AddPatternMenu";
import { listPatterns } from "../services/patternsService";

function Patterns() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Patterns are loaded from Firestore. openId remembers which dropdown is open.
  const [patterns, setPatterns] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listPatterns()
      .then(setPatterns)
      .catch((err) => {
        console.error(err);
        setError("Could not load patterns. Check your Firebase setup.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Toggles a dropdown open/closed (clicking the open one closes it)
  const toggleDropdown = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Patterns</h1>

      {/* ADD BUTTON (+) */}
      <button
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#e8d5ff",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onClick={() => setShowMenu(!showMenu)}
      >
        +
      </button>

      {showMenu && <AddPatternMenu onClose={() => setShowMenu(false)} />}

      {loading && <p>Loading patterns...</p>}
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!loading && !error && patterns.length === 0 && (
        <p>No patterns yet. Tap the + button to add your first one!</p>
      )}

      {/* PATTERN LIST */}
      <div>
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              background: "#fff"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() => toggleDropdown(pattern.id)}
            >
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{pattern.name}</h2>
              <span style={{ fontSize: "1.5rem" }}>
                {openId === pattern.id ? "▲" : "▼"}
              </span>
            </div>

            {openId === pattern.id && (
              <div style={{ marginTop: "10px" }}>
                <p>
                  <strong>Description:</strong> {pattern.description || "None"}
                </p>
                <p>
                  <strong>Category:</strong> {pattern.category || "None"}
                </p>
                <p>
                  <strong>Yarn:</strong> {pattern.yarnUsed || "None"}
                </p>

                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    background: "#e8d5ff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/pattern/${pattern.id}`)}
                >
                  View Pattern
                </button>

                <button
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "10px 15px",
                    background: "#fff",
                    border: "2px solid #e8d5ff",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/ai/${pattern.id}`)}
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