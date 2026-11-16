import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPattern } from "../services/patternsService";
import { listYarns } from "../services/yarnService";
import { listProgressLogs } from "../services/progressService";

// Where the Flask server runs (python app.py in the backend folder)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SERVER_HELP =
  "Could not reach the AI server. Make sure it's running (python app.py in the backend folder), then try again.";

async function callApi(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Server returned ${response.status}`);
  return response.json();
}

// "2026-11-24" becomes "November 24, 2026"
function formatDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "20px",
  background: "#fff"
};

const FIT_COLORS = {
  "Great match": "#e4f7e7",
  "Good match": "#f3eaff",
  "Possible match": "#fff6dc"
};

const METHOD_TEXT = {
  linear_regression: "Based on the trend in your pace (linear regression)",
  average_pace: "Based on your average pace"
};

function RecommendationItem({ rec, isTop }) {
  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginTop: "10px",
        background: FIT_COLORS[rec.fit] || "#fff"
      }}
    >
      <strong>
        {isTop ? "Best pick: " : ""}
        {rec.name}
      </strong>
      {rec.brand ? ` (${rec.brand})` : ""} · {rec.fit} · score {rec.score}/100
      <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
        {rec.reasons.map((line) => (
          <li key={line}>{line}</li>
        ))}
        {rec.warnings.map((line) => (
          <li key={line} style={{ color: "#9a5b00" }}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AIInsights() {
  const { id } = useParams();

  const [pattern, setPattern] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [yarnResult, setYarnResult] = useState(null);
  const [yarnError, setYarnError] = useState("");
  const [timeResult, setTimeResult] = useState(null);
  const [timeError, setTimeError] = useState("");
  const [attempt, setAttempt] = useState(0); // bump this to run the analysis again

  useEffect(() => {
    if (!id) return; // /ai with no pattern selected: nothing to analyze

    let cancelled = false;

    async function run() {
      setStatus("loading");
      setYarnResult(null);
      setYarnError("");
      setTimeResult(null);
      setTimeError("");

      try {
        // 1. Load everything from Firebase
        const [patternData, yarns, logs] = await Promise.all([
          getPattern(id),
          listYarns(),
          listProgressLogs(id)
        ]);
        if (cancelled) return;

        if (!patternData) {
          setErrorMsg("Pattern not found.");
          setStatus("error");
          return;
        }
        setPattern(patternData);

        const totalRows =
          patternData.totalRows || (patternData.rows ? patternData.rows.length : 0);

        // 2. Ask the Flask server for both results (photos are not sent)
        const [yarnRes, timeRes] = await Promise.allSettled([
          callApi("/recommend-yarn", {
            pattern: {
              name: patternData.name,
              yarnWeight: patternData.yarnWeight,
              yardageNeeded: patternData.yardageNeeded,
              yarnUsed: patternData.yarnUsed
            },
            yarns: yarns.map((y) => ({
              id: y.id,
              name: y.name,
              brand: y.brand,
              color: y.color,
              weight: y.weight,
              yards: y.yards
            }))
          }),
          callApi("/predict-time", {
            totalRows,
            logs: logs.map((l) => ({ date: l.date, rowsDone: l.rowsDone }))
          })
        ]);
        if (cancelled) return;

        if (yarnRes.status === "fulfilled") setYarnResult(yarnRes.value);
        else setYarnError(SERVER_HELP);

        if (timeRes.status === "fulfilled") setTimeResult(timeRes.value);
        else setTimeError(SERVER_HELP);

        setStatus("ready");
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        setErrorMsg("Could not load this pattern's data. Check your Firebase setup.");
        setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  // No pattern chosen (e.g. user came from the Home page "Learn More" button)
  if (!id) {
    return (
      <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>AI Insights</h1>
        <p>
          Pick a pattern to get a yarn recommendation from your stash and an
          estimate of when you'll finish.
        </p>
        <Link to="/patterns">Go to Patterns</Link>
      </div>
    );
  }

  if (status === "loading") {
    return <p style={{ padding: "40px" }}>Running AI analysis...</p>;
  }

  if (status === "error") {
    return (
      <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
        <p>{errorMsg}</p>
        <Link to="/patterns">Back to Patterns</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "5px" }}>AI Insights</h1>
      <p style={{ marginTop: 0, marginBottom: "25px", fontSize: "1.1rem" }}>
        {pattern.name}
      </p>

      {/* YARN RECOMMENDATION */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Recommended Yarn</h2>

        {yarnError && <p style={{ color: "#b00020" }}>{yarnError}</p>}

        {yarnResult && yarnResult.status !== "ok" && <p>{yarnResult.message}</p>}

        {yarnResult && yarnResult.status === "ok" && (
          <div>
            <p style={{ marginBottom: 0 }}>
              This pattern needs <strong>{yarnResult.patternWeight}</strong>
              {yarnResult.yardageNeeded > 0 && (
                <span> and about {yarnResult.yardageNeeded} yards</span>
              )}
              .
            </p>
            {yarnResult.recommendations.map((rec, index) => (
              <RecommendationItem key={rec.id || rec.name} rec={rec} isTop={index === 0} />
            ))}
            {yarnResult.notes.map((note) => (
              <p key={note} style={{ color: "#555", marginBottom: 0 }}>
                {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* TIME ESTIMATE */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Estimated Time to Complete</h2>

        {timeError && <p style={{ color: "#b00020" }}>{timeError}</p>}

        {timeResult && timeResult.status !== "ok" && <p>{timeResult.message}</p>}

        {timeResult && timeResult.status === "ok" && (
          <div>
            <p style={{ fontSize: "1.2rem", marginTop: 0 }}>
              <strong>{formatDate(timeResult.estimatedCompletion)}</strong>
              {" "}({timeResult.daysLeft} day{timeResult.daysLeft === 1 ? "" : "s"} left)
            </p>
            <p>
              <strong>Rows done:</strong> {timeResult.rowsDone} of {timeResult.totalRows}
            </p>
            <p>
              <strong>Your pace:</strong> about {timeResult.rowsPerDay} rows per day
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Confidence:</strong> {timeResult.confidence}.{" "}
              {METHOD_TEXT[timeResult.method]}.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setAttempt((n) => n + 1)}
        style={{
          padding: "10px 15px",
          background: "#e8d5ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "10px"
        }}
      >
        Run again
      </button>
      <Link to={`/pattern/${id}`}>Back to pattern</Link>
    </div>
  );
}

export default AIInsights;