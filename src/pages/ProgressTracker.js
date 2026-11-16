import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listPatterns } from "../services/patternsService";
import { listAllProgressLogs, summarizeLogs } from "../services/progressService";

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

function ProgressTracker() {
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
    <div className="page">
      <h1>Progress Tracker</h1>
      <p className="page-intro">The projects you're working on, most recent first.</p>

      {loading && <p className="muted">Loading your projects...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p>
          No progress logged yet. Open a pattern and log your first session to see it
          here.
        </p>
      )}

      {projects.map((project) => (
        <Link to={`/pattern/${project.id}`} className="card card-link" key={project.id}>
          <div className="project-head">
            <h2>{project.name}</h2>
            <span className="project-percent">{project.progress}%</span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${project.name} progress`}
          >
            <div
              className={`progress-fill${project.progress >= 100 ? " done" : ""}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <p>
            <strong>Rows:</strong> {project.rowsDone} of {project.totalRows || "?"}
          </p>
          <p>
            <strong>Last logged:</strong> {formatDate(project.latest.date)}
          </p>
          {project.latest.note && (
            <p className="muted">"{project.latest.note}"</p>
          )}
        </Link>
      ))}
    </div>
  );
}

export default ProgressTracker;