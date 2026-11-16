import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");

  // Each row is an object: { id: number, text: string }
  const [rows, setRows] = useState([{ id: 1, text: "" }]);

  // When editing, load the saved pattern and fill in the form
  useEffect(() => {
    if (!editId) return;
    getPattern(editId)
      .then((data) => {
        if (!data) {
          setLoadError("Pattern not found.");
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
        setLoadError("Could not load this pattern.");
      })
      .finally(() => setLoading(false));
  }, [editId]);

  const addRow = () => {
    setRows((prev) => [...prev, { id: prev.length + 1, text: "" }]);
  };

  // Removes a row and re-numbers the rest
  const deleteRow = (id) => {
    const filtered = rows.filter((row) => row.id !== id);
    setRows(filtered.map((row, index) => ({ ...row, id: index + 1 })));
  };

  const updateRowText = (id, newText) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, text: newText } : row))
    );
  };

  // SAVE: creates a new pattern, or updates the existing one when editing
  const handleSave = async () => {
    setFormError("");
    if (!patternName.trim()) {
      setFormError("Give your pattern a name first.");
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
      setFormError("Could not save the pattern. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page page-narrow">
        <p className="muted">Loading your pattern...</p>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="page page-narrow">
        <p className="error-text">{loadError}</p>
        <Link to="/patterns">Back to patterns</Link>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <h1>{isEditing ? "Edit pattern" : "Write a pattern"}</h1>
      <p className="page-intro">
        {isEditing
          ? "Change anything below, then save."
          : "Add the details, then write it out row by row."}
      </p>

      <div className="card">
        <h2>Details</h2>

        <label className="label" htmlFor="pattern-name">Pattern name</label>
        <input
          id="pattern-name"
          className="input"
          type="text"
          value={patternName}
          onChange={(e) => setPatternName(e.target.value)}
          placeholder="Granny square blanket"
        />

        <label className="label" htmlFor="pattern-description">Description</label>
        <textarea
          id="pattern-description"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is it, and who is it for?"
        />

        <label className="label" htmlFor="pattern-category">Category</label>
        <select
          id="pattern-category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

        <label className="label" htmlFor="pattern-youtube">YouTube tutorial link</label>
        <input
          id="pattern-youtube"
          className="input"
          type="text"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="card">
        <h2>Yarn</h2>

        <label className="label" htmlFor="pattern-yarn">Yarn used</label>
        <input
          id="pattern-yarn"
          className="input"
          type="text"
          value={yarnUsed}
          onChange={(e) => setYarnUsed(e.target.value)}
          placeholder="Brand and name"
        />

        <div className="form-grid">
          <div>
            <label className="label">Yarn weight needed</label>
            <YarnWeightSelect value={yarnWeight} onChange={setYarnWeight} />
          </div>
          <div>
            <label className="label" htmlFor="pattern-yardage">Yardage needed</label>
            <input
              id="pattern-yardage"
              className="input"
              type="number"
              min="0"
              value={yardageNeeded}
              onChange={(e) => setYardageNeeded(e.target.value)}
              placeholder="Approximate yards"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Rows</h2>
        {rows.map((row) => (
          <div className="row-editor-item" key={row.id}>
            <span className="row-editor-num">{row.id}.</span>
            <input
              className="input"
              type="text"
              aria-label={`Row ${row.id} instructions`}
              value={row.text}
              onChange={(e) => updateRowText(row.id, e.target.value)}
              placeholder="Write the instructions for this row"
            />
            <button
              className="btn btn-danger btn-small"
              onClick={() => deleteRow(row.id)}
              aria-label={`Remove row ${row.id}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn btn-secondary btn-small" onClick={addRow}>
          Add a row
        </button>
      </div>

      {formError && <p className="error-text">{formError}</p>}

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Save changes" : "Save pattern"}
        </button>
        <Link
          className="btn btn-secondary"
          to={isEditing ? `/pattern/${editId}` : "/patterns"}
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default CreatePattern;