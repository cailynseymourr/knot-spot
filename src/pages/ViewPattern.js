import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewPattern() {
  // ------------------------------------------------------------
  // GET PATTERN ID FROM URL
  // Example: /pattern/3 → id = 3
  // Later, Firebase will load the pattern using this ID.
  // ------------------------------------------------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const [rowsCompleted, setRowsCompleted] = useState(0);
  const [stitchesCompleted, setStitchesCompleted] = useState(0);
  const [notes, setNotes] = useState("");

  // ------------------------------------------------------------
  // STATE: Pattern data
  // This will eventually come from Firebase.
  // For now, it's placeholder data.
  // ------------------------------------------------------------
  const [pattern, setPattern] = useState({
    name: "Sample Pattern",
    description: "This is a placeholder description.",
    rows: [
      "Row 1: ch 10",
      "Row 2: sc across",
      "Row 3: turn, sc across"
    ],
    fileUrl: null // For uploaded PDFs/images later
  });

  // ------------------------------------------------------------
  // LOAD PATTERN (placeholder)
  // Later: fetch pattern from Firebase using ID
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("Loading pattern with ID:", id);
    // Firebase load will go here
  }, [id]);

  // ------------------------------------------------------------
  // DELETE PATTERN (placeholder)
  // Later: delete from Firebase
  // ------------------------------------------------------------
  const handleDelete = () => {
    alert("Deleting pattern… (Firebase will be added later)");
  };

  // ------------------------------------------------------------
  // EDIT PATTERN (placeholder)
  // Later: navigate to CreatePattern with existing data
  // ------------------------------------------------------------
  const handleEdit = () => {
    alert("Editing pattern… (will open CreatePattern with data)");
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      {/* --------------------------------------------------------
          PATTERN NAME
      --------------------------------------------------------- */}
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "10px"
        }}
      >
        {pattern.name}
      </h1>

      {/* --------------------------------------------------------
          DESCRIPTION
      --------------------------------------------------------- */}
      <p
        style={{
          marginBottom: "20px",
          fontSize: "1.1rem"
        }}
      >
        {pattern.description}
      </p>

      {/* --------------------------------------------------------
          FILE PREVIEW (if uploaded)
          Later: show PDF preview or image preview
      --------------------------------------------------------- */}
      {pattern.fileUrl && (
        <div style={{ marginBottom: "20px" }}>
          <a
            href={pattern.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Uploaded File
          </a>
        </div>
      )}
      <h2 style={{ marginBottom: "15px" }}>
        Project Progress
        </h2>
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
          0%
        </div>
        <p>
          <strong>Rows Completed:</strong> {rowsCompleted} / {pattern.rows.length}
        </p>
        <p>
          <strong>Stitches Completed:</strong> {stitchesCompleted}
        </p>
        <p>
          <strong>Estimated Completion:</strong> Not enough data to estimate yet.
        </p>
        <h3>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes here..."
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px"
          }}
        />

      {/* --------------------------------------------------------
          ROW LIST (for created patterns)
      --------------------------------------------------------- */}
      <h2 style={{ marginBottom: "10px" }}>Rows</h2>

      <div>
        {pattern.rows.map((row, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          >
            <strong>Row {index + 1}:</strong> {row}
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------
          BUTTONS: Edit, Delete, AI Insight
      --------------------------------------------------------- */}
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
