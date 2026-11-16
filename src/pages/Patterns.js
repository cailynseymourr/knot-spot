import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatternMenu from "../components/AddPatternMenu";
import { YARN_WEIGHTS } from "../components/YarnWeightSelect";
import { listPatterns } from "../services/patternsService";

const weightLabel = (value) =>
  YARN_WEIGHTS.find((w) => w.value === value)?.label || "Not set";

function Patterns() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Patterns are loaded from Firestore. openId remembers which card is open.
  const [patterns, setPatterns] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listPatterns()
      .then(setPatterns)
      .catch((err) => {
        console.error(err);
        setError("Could not load your patterns. Check your Firebase setup.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="page">
      <h1>Patterns</h1>
      <p className="page-intro">Your saved patterns. Open one to see the details.</p>

      <button
        className="fab"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Add a pattern"
      >
        +
      </button>
      {showMenu && <AddPatternMenu onClose={() => setShowMenu(false)} />}

      {loading && <p className="muted">Loading your patterns...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && patterns.length === 0 && (
        <p>No patterns yet. Tap the + button to add your first one.</p>
      )}

      {patterns.map((pattern) => {
        const isOpen = openId === pattern.id;
        return (
          <div className="card" key={pattern.id}>
            <button
              className="card-toggle"
              aria-expanded={isOpen}
              onClick={() => toggle(pattern.id)}
            >
              <span className="card-title">{pattern.name}</span>
              {pattern.category && <span className="chip">{pattern.category}</span>}
              <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div style={{ marginTop: "12px" }}>
                {pattern.description && <p>{pattern.description}</p>}
                <p>
                  <strong>Yarn:</strong> {pattern.yarnUsed || "Not set"}
                </p>
                <p>
                  <strong>Weight:</strong> {weightLabel(pattern.yarnWeight)}
                </p>
                {pattern.yardageNeeded > 0 && (
                  <p>
                    <strong>Yardage:</strong> about {pattern.yardageNeeded} yd
                  </p>
                )}

                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => navigate(`/pattern/${pattern.id}`)}
                  >
                    View pattern
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => navigate(`/ai/${pattern.id}`)}
                  >
                    AI insight
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Patterns;