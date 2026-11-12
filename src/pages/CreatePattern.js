import { useState } from "react";

function CreatePattern() {
  // ------------------------------------------------------------
  // STATE: Pattern name + rows
  // Later, Firebase will store these values.
  // ------------------------------------------------------------
  const [patternName, setPatternName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [yarnUsed, setYarnUsed] = useState("");

  // Each row is an object: { id: number, text: string }
  const [rows, setRows] = useState([
    { id: 1, text: "" } // Start with one empty row
  ]);

  // ------------------------------------------------------------
  // ADD ROW
  // Creates a new row with the next number
  // ------------------------------------------------------------
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: prev.length + 1, text: "" }
    ]);
  };

  // ------------------------------------------------------------
  // DELETE ROW
  // Removes a row and re-numbers the remaining rows
  // ------------------------------------------------------------
  const deleteRow = (id) => {
    const filtered = rows.filter((row) => row.id !== id);

    // Re-number rows after deletion
    const renumbered = filtered.map((row, index) => ({
      ...row,
      id: index + 1
    }));

    setRows(renumbered);
  };

  // ------------------------------------------------------------
  // UPDATE ROW TEXT
  // Called when user types in a row
  // ------------------------------------------------------------
  const updateRowText = (id, newText) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, text: newText } : row
      )
    );
  };

  // ------------------------------------------------------------
  // SAVE PATTERN
  // Placeholder — Firebase will be added later
  // ------------------------------------------------------------
  const handleSave = () => {
    alert("Saving pattern… (Firebase will be added later)");
  };

  return (
    <div
      style={{
        padding: "40px",          // Change page padding here
        maxWidth: "700px",        // Change width of editor
        margin: "0 auto"          // Centers the page
      }}
    >
      {/* --------------------------------------------------------
          PAGE TITLE
      --------------------------------------------------------- */}
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px"
        }}
      >
        Create Pattern
      </h1>

      {/* --------------------------------------------------------
          PATTERN NAME INPUT
      --------------------------------------------------------- */}
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
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
          width: "100%",
          padding: "10px",
          marginBottom: "30px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your pattern here..."
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        Category
      </label>
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">Select a category</option>
        <option value="Clothing">Clothing</option>
        <option value="Blanket">Blanket</option>
        <option value="Amigurumi">Amigurumi</option>
        <option value="Accessories">Accessories</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Filet Crochet">Filet Crochet</option>
        <option value="Other">Other</option>
      </select>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        YouTube Link
      </label>
      <input
        type="text"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        placeholder="Enter YouTube tutorial link"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        Yarn Used
      </label>
      <input
        type="text"
        value={yarnUsed}
        onChange={(e) => setYarnUsed(e.target.value)}
        placeholder="Enter yarn brand and name"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "30px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      {/* --------------------------------------------------------
          ROW EDITOR
          Each row is numbered and editable
      --------------------------------------------------------- */}
      <div>
        {rows.map((row) => (
          <div
            key={row.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px"
            }}
          >
            {/* Row number */}
            <span
              style={{
                width: "40px",
                fontWeight: "bold",
                fontSize: "1.2rem"
              }}
            >
              {row.id}.
            </span>

            {/* Row text input */}
            <input
              type="text"
              value={row.text}
              onChange={(e) => updateRowText(row.id, e.target.value)}
              placeholder="Write row instructions here..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />

            {/* Delete row button */}
            <button
              onClick={() => deleteRow(row.id)}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                background: "#ffdddd", // Change delete color here
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------
          ADD ROW BUTTON
      --------------------------------------------------------- */}
      <button
        onClick={addRow}
        style={{
          padding: "12px 20px",
          background: "#e8d5ff",   // Change color here
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "10px"
        }}
      >
        + Add Row
      </button>

      {/* --------------------------------------------------------
          SAVE BUTTON
      --------------------------------------------------------- */}
      <button
        onClick={handleSave}
        style={{
          padding: "12px 20px",
          background: "#c8a8ff",   // Change color here
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "20px",
          marginLeft: "10px"
        }}
      >
        Save Pattern
      </button>
    </div>
  );
}

export default CreatePattern;
