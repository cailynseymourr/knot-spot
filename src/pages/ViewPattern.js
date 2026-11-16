import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getPattern, deletePattern } from "../services/patternsService";
import {
  addProgressLog,
  listProgressLogs,
  deleteProgressLog,
  summarizeLogs
} from "../services/progressService";
import { YARN_WEIGHTS } from "../components/YarnWeightSelect";
import ConfirmDialog from "../components/ConfirmDialog";

// Turns a normal YouTube link into the embeddable version (or null if unrecognized)
function getYoutubeEmbedUrl(link) {
  try {
    const url = new URL(link);
    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/")[2];
    } else {
      videoId = url.searchParams.get("v") || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

// Today's date as YYYY-MM-DD in the user's own time zone
function getToday() {
  return new Date().toLocaleDateString("en-CA");
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

const weightLabel = (value) =>
  YARN_WEIGHTS.find((w) => w.value === value)?.label || "";

function ViewPattern() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state && location.state.notice; // e.g. "file could not be uploaded"

  // Pattern data is loaded from Firestore using the id in the URL
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Progress logs for this pattern + the "add a log" form
  const [logs, setLogs] = useState([]);
  const [logForm, setLogForm] = useState({
    date: getToday(),
    rows: "",
    stitches: "",
    note: ""
  });
  const [savingLog, setSavingLog] = useState(false);
  const [logMessage, setLogMessage] = useState("");

  // Delete confirmation: { type: "pattern" } or { type: "log", log }
  const [pendingDelete, setPendingDelete] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    getPattern(id)
      .then((data) => {
        if (data) {
          setPattern({ rows: [], ...data }); // make sure rows is always an array
        } else {
          setError("Pattern not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load this pattern.");
      })
      .finally(() => setLoading(false));

    listProgressLogs(id)
      .then(setLogs)
      .catch((err) => console.error("Could not load progress logs", err));
  }, [id]);

  const updateLogForm = (field, value) => {
    setLogForm((prev) => ({ ...prev, [field]: value }));
  };

  // ADD LOG: saves one work session to Firestore
  const addLog = async () => {
    setLogMessage("");
    const rowsDone = Number(logForm.rows) || 0;
    const stitches = Number(logForm.stitches) || 0;

    if (!logForm.date) {
      setLogMessage("Pick a date for this session.");
      return;
    }
    if (rowsDone <= 0 && stitches <= 0) {
      setLogMessage("Enter the rows or stitches you finished.");
      return;
    }

    setSavingLog(true);
    try {
      const entry = {
        patternId: id,
        date: logForm.date,
        rowsDone,
        stitches,
        note: logForm.note.trim()
      };
      const logId = await addProgressLog(entry);
      setLogs((prev) =>
        [{ id: logId, ...entry }, ...prev].sort((a, b) => b.date.localeCompare(a.date))
      );
      setLogForm({ date: logForm.date, rows: "", stitches: "", note: "" });
    } catch (err) {
      console.error(err);
      setLogMessage("Could not save that log. Check the console for details.");
    } finally {
      setSavingLog(false);
    }
  };

  // Runs after the person confirms in the dialog
  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    setActionError("");
    try {
      if (target.type === "pattern") {
        await deletePattern(id);
        navigate("/patterns");
      } else {
        await deleteProgressLog(target.log.id);
        setLogs((prev) => prev.filter((l) => l.id !== target.log.id));
      }
    } catch (err) {
      console.error(err);
      setActionError("Could not delete that. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading your pattern...</p>
      </div>
    );
  }
  if (error || !pattern) {
    return (
      <div className="page">
        <p className="error-text">{error || "Pattern not found."}</p>
        <Link to="/patterns">Back to patterns</Link>
      </div>
    );
  }

  const embedUrl = pattern.youtubeLink ? getYoutubeEmbedUrl(pattern.youtubeLink) : null;

  // Progress comes from adding up the logs
  const { rowsDone, stitches } = summarizeLogs(logs);
  const totalRows = pattern.totalRows || pattern.rows.length;
  const progressPercent = totalRows
    ? Math.min(100, Math.round((rowsDone / totalRows) * 100))
    : 0;
  const ringColor = progressPercent >= 100 ? "var(--sage)" : "var(--marigold)";

  return (
    <div className="page">
      {notice && <p className="notice">{notice}</p>}

      <h1>{pattern.name}</h1>
      <div className="pattern-chips">
        {pattern.category && <span className="chip">{pattern.category}</span>}
        {weightLabel(pattern.yarnWeight) && (
          <span className="chip">{weightLabel(pattern.yarnWeight)}</span>
        )}
        {pattern.yardageNeeded > 0 && (
          <span className="chip">about {pattern.yardageNeeded} yd</span>
        )}
        {pattern.yarnUsed && <span className="chip">{pattern.yarnUsed}</span>}
      </div>
      {pattern.description && (
        <p style={{ fontSize: "1.1rem", marginTop: 0 }}>{pattern.description}</p>
      )}

      {pattern.fileUrl && (
        <p>
          <a href={pattern.fileUrl} target="_blank" rel="noopener noreferrer">
            View the uploaded pattern file
          </a>
        </p>
      )}

      {embedUrl && (
        <div className="video-frame">
          <iframe src={embedUrl} title="Pattern tutorial" allowFullScreen />
        </div>
      )}

      {/* PROGRESS (totals come from the logs below) */}
      <div className="card">
        <h2>Progress</h2>
        <div className="progress-summary">
          <div
            className="progress-ring"
            style={{
              background: `conic-gradient(${ringColor} ${progressPercent * 3.6}deg, var(--lavender) 0deg)`
            }}
            role="img"
            aria-label={`${progressPercent} percent complete`}
          >
            <div className="progress-ring-inner">{progressPercent}%</div>
          </div>
          <div>
            <p>
              <strong>Rows:</strong> {rowsDone} of {totalRows || "?"}
            </p>
            <p>
              <strong>Stitches:</strong> {stitches}
            </p>
            <p>
              <Link to={`/ai/${id}`}>See your estimated finish date</Link>
            </p>
          </div>
        </div>
      </div>

      {/* LOG A SESSION */}
      <div className="card">
        <h2>Log a session</h2>
        <div className="form-grid tight">
          <div>
            <label className="label" htmlFor="log-date">Date</label>
            <input
              id="log-date"
              className="input"
              type="date"
              value={logForm.date}
              onChange={(e) => updateLogForm("date", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="log-rows">Rows done</label>
            <input
              id="log-rows"
              className="input"
              type="number"
              min="0"
              value={logForm.rows}
              onChange={(e) => updateLogForm("rows", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="log-stitches">Stitches</label>
            <input
              id="log-stitches"
              className="input"
              type="number"
              min="0"
              value={logForm.stitches}
              onChange={(e) => updateLogForm("stitches", e.target.value)}
            />
          </div>
        </div>
        <label className="label" htmlFor="log-note">Note (optional)</label>
        <textarea
          id="log-note"
          className="input"
          style={{ minHeight: "70px" }}
          placeholder="Working on the wings"
          value={logForm.note}
          onChange={(e) => updateLogForm("note", e.target.value)}
        />
        {logMessage && <p className="error-text">{logMessage}</p>}
        <button className="btn btn-primary btn-small" onClick={addLog} disabled={savingLog}>
          {savingLog ? "Saving..." : "Add log"}
        </button>
      </div>

      {/* LOG HISTORY */}
      <div className="card">
        <h2>Log history</h2>
        {logs.length === 0 && <p className="muted">No sessions logged yet.</p>}
        {logs.map((log) => (
          <div className="log-entry" key={log.id}>
            <div>
              <strong>{formatDate(log.date)}</strong>
              <p>
                {log.rowsDone} rows, {log.stitches} stitches
              </p>
              {log.note && <p className="muted">{log.note}</p>}
            </div>
            <button
              className="btn btn-danger btn-small"
              onClick={() => setPendingDelete({ type: "log", log })}
              aria-label={`Delete the log from ${formatDate(log.date)}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ROWS: finished rows are shaded and checked */}
      {pattern.rows.length > 0 && (
        <div>
          <h2>Rows</h2>
          {pattern.rows.map((row, index) => {
            const done = index < rowsDone;
            return (
              <div key={index} className={`row-item${done ? " done" : ""}`}>
                <span className="row-num">Row {index + 1}</span>
                <span>{row}</span>
                {done && (
                  <span className="row-check" aria-label="Finished">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {actionError && <p className="error-text">{actionError}</p>}

      <div className="pattern-actions">
        <button className="btn btn-primary" onClick={() => navigate(`/ai/${id}`)}>
          AI insight
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(`/edit/${id}`)}>
          Edit pattern
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setPendingDelete({ type: "pattern" })}
        >
          Delete pattern
        </button>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={
          pendingDelete && pendingDelete.type === "pattern"
            ? "Delete this pattern?"
            : "Delete this log entry?"
        }
        message={
          pendingDelete && pendingDelete.type === "pattern"
            ? `${pattern.name} will be removed. This can't be undone.`
            : "This session will be removed from your progress. This can't be undone."
        }
        confirmLabel={
          pendingDelete && pendingDelete.type === "pattern" ? "Delete pattern" : "Delete entry"
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default ViewPattern;