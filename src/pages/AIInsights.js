import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPattern } from "../services/patternsService";
import { listYarns } from "../services/yarnService";
import { listProgressLogs } from "../services/progressService";

// Where the Flask server runs (python app.py in the backend folder)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SERVER_HELP =
  "Could not reach the AI server. Make sure it's running (python app.py in the backend folder), then run again.";

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

const FIT_CLASS = {
  "Great match": "fit-great",
  "Good match": "fit-good",
  "Possible match": "fit-possible"
};

const METHOD_TEXT = {
  linear_regression: "Based on the trend in your pace (linear regression)",
  average_pace: "Based on your average pace"
};

function RecommendationItem({ rec, isTop }) {
  return (
    <div className={`pick${isTop ? " best" : ""}`}>
      <div className="pick-head">
        <span className="pick-name">
          {isTop ? "Best pick: " : ""}
          {rec.name}
        </span>
        <span>
          <span className={`chip ${FIT_CLASS[rec.fit] || ""}`}>{rec.fit}</span>{" "}
          <span className="muted">score {rec.score}/100</span>
        </span>
      </div>
      {rec.brand && <div className="muted">{rec.brand}</div>}
      <ul>
        {rec.reasons.map((line) => (
          <li key={line}>{line}</li>
        ))}
        {rec.warnings.map((line) => (
          <li key={line} className="warn">
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

  // No pattern chosen (e.g. user came from the navbar)
  if (!id) {
    return (
      <div className="page page-narrow">
        <h1>AI Insights</h1>
        <p className="page-intro">
          Pick a pattern to get a yarn recommendation from your stash and an estimate
          of when you'll finish.
        </p>
        <Link className="btn btn-primary" to="/patterns">
          Choose a pattern
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="page page-narrow">
        <p className="muted">Running the analysis...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="page page-narrow">
        <p className="error-text">{errorMsg}</p>
        <Link to="/patterns">Back to patterns</Link>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <h1>AI Insights</h1>
      <p className="page-intro">{pattern.name}</p>

      {/* YARN RECOMMENDATION */}
      <div className="card">
        <h2>Recommended yarn</h2>

        {yarnError && <p className="error-text">{yarnError}</p>}

        {yarnResult && yarnResult.status !== "ok" && <p>{yarnResult.message}</p>}

        {yarnResult && yarnResult.status === "ok" && (
          <div>
            <p style={{ marginTop: 0 }}>
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
              <p key={note} className="muted">
                {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* TIME ESTIMATE */}
      <div className="card">
        <h2>Estimated finish</h2>

        {timeError && <p className="error-text">{timeError}</p>}

        {timeResult && timeResult.status !== "ok" && <p>{timeResult.message}</p>}

        {timeResult && timeResult.status === "ok" && (
          <div>
            <p className="finish-date">{formatDate(timeResult.estimatedCompletion)}</p>
            <p className="muted" style={{ marginTop: 0 }}>
              {timeResult.daysLeft} day{timeResult.daysLeft === 1 ? "" : "s"} left
            </p>
            <p>
              <strong>Rows done:</strong> {timeResult.rowsDone} of {timeResult.totalRows}
            </p>
            <p>
              <strong>Your pace:</strong> about {timeResult.rowsPerDay} rows per day
            </p>
            <p>
              <strong>Confidence:</strong> {timeResult.confidence}.{" "}
              {METHOD_TEXT[timeResult.method]}.
            </p>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => setAttempt((n) => n + 1)}>
          Run again
        </button>
        <Link className="btn btn-secondary" to={`/pattern/${id}`}>
          Back to pattern
        </Link>
      </div>
    </div>
  );
}

export default AIInsights;