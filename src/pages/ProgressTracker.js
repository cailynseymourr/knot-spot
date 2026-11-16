import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listPatterns } from "../services/patternsService";
import { listAllProgressLogs, summarizeLogs } from "../services/progressService";

function ProgressTracker() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listPatterns(), listAllProgressLogs()])
      .then(([patterns, logs]) => {
        const built = patterns
          .map((p) => {
            const patternLogs = logs.filter((l) => l.patternId === p.id);
            const { rowsDone, latest } = summarizeLogs(patternLogs);
            const totalRows = p.totalRows || (p.rows ? p.rows.length : 0);
            const progress = totalRows
              ? Math.min(100, Math.round((rowsDone / totalRows) * 100))
              : 0;
            return {
              id: p.id,
              name: p.name,
              rowsDone,
              totalRows,
              progress,
              latest,
              hasLogs: patternLogs.length > 0
            };
          })
          // Only patterns you've logged progress on count as current projects
          .filter((p) => p.hasLogs)
          // Most recently worked-on first
          .sort((a, b) => b.latest.date.localeCompare(a.latest.date));
        setProjects(built);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your projects. Check your Firebase setup.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Progress Tracker</h1>

      <h2>Current Projects</h2>

      {loading && <p>Loading your projects...</p>}
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p>
          No progress logged yet. Open a pattern and log your first session to see
          it here.
        </p>
      )}

      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => navigate(`/pattern/${project.id}`)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          <h3>{project.name}</h3>

          <div
            style={{
              width: "100%",
              height: "20px",
              background: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                width: `${project.progress}%`,
                height: "100%",
                background: "#d9c4ff"
              }}
            />
          </div>

          <p>
            <strong>Progress:</strong> {project.progress}%
          </p>
          <p>
            <strong>Rows Completed:</strong> {project.rowsDone} /{" "}
            {project.totalRows || "?"}
          </p>
          <p>
            <strong>Last Logged:</strong> {project.latest.date}
          </p>
          {project.latest.note && (
            <p>
              <strong>Recent Note:</strong> {project.latest.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressTracker;