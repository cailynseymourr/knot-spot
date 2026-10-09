import { useState } from "react";

function UploadPattern() {
  // ------------------------------------------------------------
  // STATE: Holds the uploaded file + pattern name
  // Later, Firebase will store these values.
  // ------------------------------------------------------------
  const [patternName, setPatternName] = useState("");
  const [file, setFile] = useState(null);

  // ------------------------------------------------------------
  // HANDLES FILE UPLOAD
  // You can restrict file types later (PDF, images, txt, etc.)
  // ------------------------------------------------------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ------------------------------------------------------------
  // HANDLES SAVE BUTTON
  // Later, this will upload to Firebase Storage + Firestore.
  // ------------------------------------------------------------
  const handleSave = () => {
    alert("Saving pattern… (Firebase will be added later)");
  };

  return (
    <div
      style={{
        padding: "40px",          // Change page padding here
        maxWidth: "600px",        // Change width of the upload form
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
        Upload Pattern
      </h1>

      {/* --------------------------------------------------------
          PATTERN NAME INPUT
          You can style the input box later.
      --------------------------------------------------------- */}
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
          // color: "#yourColor"
        }}
      >
        Pattern Name
      </label>

      <input
        type="text"
        value={patternName}
        onChange={(e) => setPatternName(e.target.value)}
        placeholder="Enter pattern name"
        style={{
          width: "100%",            // Input width
          padding: "10px",          // Input padding
          marginBottom: "20px",     // Space under input
          borderRadius: "8px",      // Rounded corners
          border: "1px solid #ccc"  // Border color
          // background: "#yourColor"
        }}
      />

      {/* --------------------------------------------------------
          FILE UPLOAD INPUT
          You can style this or replace it with a custom upload UI.
      --------------------------------------------------------- */}
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        Upload File
      </label>

      <input
        type="file"
        onChange={handleFileChange}
        style={{
          marginBottom: "20px"
          // You can hide this and make a custom upload button later
        }}
      />

      {/* --------------------------------------------------------
          SAVE BUTTON
          Later this will save to Firebase.
          You can style colors, hover effects, etc.
      --------------------------------------------------------- */}
      <button
        onClick={handleSave}
        style={{
          padding: "12px 20px",
          background: "#e8d5ff",     // Change button color here
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Save Pattern
      </button>
    </div>
  );
}

export default UploadPattern;
