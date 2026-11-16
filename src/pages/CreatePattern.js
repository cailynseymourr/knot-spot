import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { savePattern, getPattern, updatePattern } from "../services/patternsService";
import YarnWeightSelect from "../components/YarnWeightSelect";

function CreatePattern() {
  const { id: editId } = useParams(); // present on /edit/:id, missing on /create
  const isEditing = Boolean(editId);
  const navigate = useNavigate();

  const [patternName, setPatternName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [yarnUsed, setYarnUsed] = useState("");
  const [yarnWeight, setYarnWeight] = useState("");
  const [yardageNeeded, setYardageNeeded] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  // Each row is an object: { id: number, text: string }
  const [rows, setRows] = useState([{ id: 1, text: "" }]);

  // When editing, load the saved pattern and fill in the form
  useEffect(() => {
    if (!editId) return;
    getPattern(editId)
      .then((data) => {
        if (!data) {
          alert("Pattern not found.");
          navigate("/patterns");
          return;
        }
        setPatternName(data.name || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setYoutubeLink(data.youtubeLink || "");
        setYarnUsed(data.yarnUsed || "");
        setYarnWeight(data.yarnWeight || "");
        setYardageNeeded(data.yardageNeeded ? String(data.yardageNeeded) : "");
        const savedRows = data.rows && data.rows.length ? data.rows : [""];
        setRows(savedRows.map((text, index) => ({ id: index + 1, text })));
      })
      .catch((err) => {
        console.error(err);
        alert("Could not load this pattern.");
        navigate("/patterns");
      })
      .finally(() => setLoading(false));
  }, [editId, navigate]);

  // ADD ROW
  const addRow = () => {
    setRows((prev) => [...prev, { id: prev.length + 1, text: "" }]);
  };

  // DELETE ROW (re-numbers the remaining rows)
  const deleteRow = (id) => {
    const filtered = rows.filter((row) => row.id !== id);
    setRows(filtered.map((row, index) => ({ ...row, id: index + 1 })));
  };

  // UPDATE ROW TEXT
  const updateRowText = (id, newText) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, text: newText } : row))
    );
  };

  // SAVE: creates a new pattern, or updates the existing one when editing
  const handleSave = async () => {
    if (!patternName.trim()) {
      alert("Please enter a pattern name.");
      return;
    }

    const fields = {
      name: patternName.trim(),
      description,
      category,
      youtubeLink,
      yarnUsed,
      yarnWeight,
      yardageNeeded: Number(yardageNeeded) || 0,
      // Save just the instruction text; the view page adds the row numbers
      rows: rows.map((r) => r.text.trim()).filter(Boolean)
    };

    setSaving(true);
    try {
      if (isEditing) {
        await updatePattern(editId, fields);
        navigate(`/pattern/${editId}`);
      } else {
        const id = await savePattern({ ...fields, fileUrl: null });
        navigate(`/pattern/${id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Could not save the pattern. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading pattern...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        {isEditing ? "Edit Pattern" : "Create Pattern"}
      </h1>

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
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

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
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

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
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

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
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

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
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

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
        Yarn Weight Needed
      </label>
      <YarnWeightSelect value={yarnWeight} onChange={setYarnWeight} />

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
        Yardage Needed
      </label>
      <input
        type="number"
        min="0"
        value={yardageNeeded}
        onChange={(e) => setYardageNeeded(e.target.value)}
        placeholder="Approximate yards needed"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "30px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* ROW EDITOR: each row is numbered and editable */}
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
            <span style={{ width: "40px", fontWeight: "bold", fontSize: "1.2rem" }}>
              {row.id}.
            </span>

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

            <button
              onClick={() => deleteRow(row.id)}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
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
      </div>

      <button
        onClick={addRow}
        style={{
          padding: "12px 20px",
          background: "#e8d5ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "10px"
        }}
      >
        + Add Row
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "12px 20px",
          background: "#c8a8ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "20px",
          marginLeft: "10px"
        }}
      >
        {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Pattern"}
      </button>
    </div>
  );
}

export default CreatePattern;