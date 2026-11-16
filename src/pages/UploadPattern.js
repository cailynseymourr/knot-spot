import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { savePattern, uploadPatternFile } from "../services/patternsService";
import YarnWeightSelect from "../components/YarnWeightSelect";

function UploadPattern() {
  const navigate = useNavigate();

  const [patternName, setPatternName] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [yarnUsed, setYarnUsed] = useState("");
  const [yarnWeight, setYarnWeight] = useState("");
  const [yardageNeeded, setYardageNeeded] = useState("");
  const [totalRows, setTotalRows] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Uploads the file (if any), saves the pattern to Firestore, then opens it
  const handleSave = async () => {
    setFormError("");
    if (!patternName.trim()) {
      setFormError("Give your pattern a name first.");
      return;
    }

    setSaving(true);
    try {
      let fileUrl = null;
      let notice = "";
      if (file) {
        try {
          fileUrl = await uploadPatternFile(file);
        } catch (err) {
          console.error(err);
          notice =
            "The file could not be uploaded (check Firebase Storage), so the pattern was saved without it.";
        }
      }

      const id = await savePattern({
        name: patternName.trim(),
        description,
        category,
        youtubeLink,
        yarnUsed,
        yarnWeight,
        yardageNeeded: Number(yardageNeeded) || 0,
        rows: [],
        totalRows: Number(totalRows) || 0,
        fileUrl
      });
      navigate(`/pattern/${id}`, { state: notice ? { notice } : undefined });
    } catch (err) {
      console.error(err);
      setFormError("Could not save the pattern. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1>Upload a pattern</h1>
      <p className="page-intro">
        Already have a pattern as a PDF or an image? Save it here with its details.
      </p>

      <div className="card">
        <h2>Details</h2>

        <label className="label" htmlFor="upload-name">Pattern name</label>
        <input
          id="upload-name"
          className="input"
          type="text"
          value={patternName}
          onChange={(e) => setPatternName(e.target.value)}
          placeholder="Ocean curtain"
        />

        <label className="label" htmlFor="upload-description">Description</label>
        <textarea
          id="upload-description"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is it, and who is it for?"
        />

        <label className="label" htmlFor="upload-category">Category</label>
        <select
          id="upload-category"
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

        <label className="label" htmlFor="upload-youtube">YouTube tutorial link</label>
        <input
          id="upload-youtube"
          className="input"
          type="text"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="card">
        <h2>Yarn and size</h2>

        <label className="label" htmlFor="upload-yarn">Yarn used</label>
        <input
          id="upload-yarn"
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
            <label className="label" htmlFor="upload-yardage">Yardage needed</label>
            <input
              id="upload-yardage"
              className="input"
              type="number"
              min="0"
              value={yardageNeeded}
              onChange={(e) => setYardageNeeded(e.target.value)}
              placeholder="Approximate yards"
            />
          </div>
          <div>
            <label className="label" htmlFor="upload-rows">Total rows</label>
            <input
              id="upload-rows"
              className="input"
              type="number"
              min="0"
              value={totalRows}
              onChange={(e) => setTotalRows(e.target.value)}
              placeholder="For progress tracking"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Pattern file</h2>
        <label className="label" htmlFor="upload-file">PDF or image</label>
        <input
          id="upload-file"
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
        {file && <p className="muted">Selected: {file.name}</p>}
      </div>

      {formError && <p className="error-text">{formError}</p>}

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save pattern"}
        </button>
        <Link className="btn btn-secondary" to="/patterns">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default UploadPattern;