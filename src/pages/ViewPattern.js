import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPattern, deletePattern } from "../services/patternsService";
import {
  addProgressLog,
  listProgressLogs,
  deleteProgressLog,
  summarizeLogs
} from "../services/progressService";

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

function ViewPattern() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    const rowsDone = Number(logForm.rows) || 0;
    const stitches = Number(logForm.stitches) || 0;

    if (!logForm.date) {
      alert("Please pick a date.");
      return;
    }
    if (rowsDone <= 0 && stitches <= 0) {
      alert("Enter the rows or stitches you finished.");
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
      alert("Could not save the log. Check the console for details.");
    } finally {
      setSavingLog(false);
    }
  };

  const removeLog = async (logId) => {
    if (!window.confirm("Delete this log entry?")) return;
    try {
      await deleteProgressLog(logId);
      setLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch (err) {
      console.error(err);
      alert("Could not delete the log.");
    }
  };

  // Deletes the pattern from Firestore, then goes back to the list
  const handleDelete = async () => {
    if (!window.confirm("Delete this pattern? This can't be undone.")) return;
    try {
      await deletePattern(id);
      navigate("/patterns");
    } catch (err) {
      console.error(err);
      alert("Could not delete the pattern.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading pattern...</p>;
  if (error || !pattern) {
    return <p style={{ padding: "40px" }}>{error || "Pattern not found."}</p>;
  }

  const embedUrl = pattern.youtubeLink ? getYoutubeEmbedUrl(pattern.youtubeLink) : null;

  // Progress comes from adding up the logs
  const { rowsDone, stitches } = summarizeLogs(logs);
  const totalRows = pattern.totalRows || pattern.rows.length;
  const progressPercent = totalRows
    ? Math.min(100, Math.round((rowsDone / totalRows) * 100))
    : 0;

  const smallInput = {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{pattern.name}</h1>

      <p style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
        {pattern.description}
      </p>

      {pattern.fileUrl && (
        <div style={{ marginBottom: "20px" }}>
          <a href={pattern.fileUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </div>
      )}

      {embedUrl && (
        <div style={{ marginBottom: "20px" }}>
          <iframe
            width="100%"
            height="315"
            src={embedUrl}
            title="Pattern tutorial"
            allowFullScreen
            style={{ border: 0, borderRadius: "10px" }}
          />
        </div>
      )}

      {/* PROJECT PROGRESS (totals come from the logs below) */}
      <h2 style={{ marginBottom: "15px" }}>Project Progress</h2>
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "8px solid #d9c4ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        {progressPercent}%
      </div>
      <p>
        <strong>Rows Completed:</strong> {rowsDone} / {totalRows || "?"}
      </p>
      <p>
        <strong>Stitches Completed:</strong> {stitches}
      </p>
      <p>
        <strong>Estimated Completion:</strong> See AI Insight for an estimate.
      </p>

      {/* LOG PROGRESS FORM */}
      <h3>Log Progress</h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "10px"
        }}
      >
        <input
          type="date"
          value={logForm.date}
          onChange={(e) => updateLogForm("date", e.target.value)}
          style={smallInput}
        />
        <input
          type="number"
          min="0"
          placeholder="Rows done"
          value={logForm.rows}
          onChange={(e) => updateLogForm("rows", e.target.value)}
          style={{ ...smallInput, width: "110px" }}
        />
        <input
          type="number"
          min="0"
          placeholder="Stitches"
          value={logForm.stitches}
          onChange={(e) => updateLogForm("stitches", e.target.value)}
          style={{ ...smallInput, width: "110px" }}
        />
      </div>
      <textarea
        value={logForm.note}
        onChange={(e) => updateLogForm("note", e.target.value)}
        placeholder="Note (optional), like 'working on the wings'"
        style={{
          width: "100%",
          minHeight: "70px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "10px"
        }}
      />
      <button
        onClick={addLog}
        disabled={savingLog}
        style={{
          padding: "10px 15px",
          background: "#c8a8ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        {savingLog ? "Saving..." : "Add Log"}
      </button>

      {/* LOG HISTORY */}
      <h3>Log History</h3>
      {logs.length === 0 && <p>No progress logged yet.</p>}
      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "10px"
          }}
        >
          <div>
            <strong>{log.date}</strong>: +{log.rowsDone} rows, +{log.stitches} stitches
            {log.note && <div style={{ color: "#555" }}>{log.note}</div>}
          </div>
          <button
            onClick={() => removeLog(log.id)}
            style={{
              padding: "6px 10px",
              background: "#ffdddd",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            X
          </button>
        </div>
      ))}

      {/* ROW LIST: rows you've finished are shaded */}
      <h2 style={{ margin: "20px 0 10px" }}>Rows</h2>
      <div>
        {pattern.rows.map((row, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              background: index < rowsDone ? "#f3eaff" : "#fff"
            }}
          >
            <strong>Row {index + 1}:</strong> {row}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleEdit}
          style={{
            padding: "10px 15px",
            background: "#e8d5ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Edit Pattern
        </button>

        <button
          onClick={handleDelete}
          style={{
            padding: "10px 15px",
            background: "#ffdddd",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Delete Pattern
        </button>

        <button
          onClick={() => navigate(`/ai/${id}`)}
          style={{
            padding: "10px 15px",
            background: "#d9c4ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          AI Insight
        </button>
      </div>
    </div>
  );
}

export default ViewPattern;