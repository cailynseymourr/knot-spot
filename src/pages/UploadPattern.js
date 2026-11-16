import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePattern, uploadPatternFile } from "../services/patternsService";
import YarnWeightSelect from "../components/YarnWeightSelect";

function UploadPattern() {
  const [patternName, setPatternName] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [yarnUsed, setYarnUsed] = useState("");
  const [yarnWeight, setYarnWeight] = useState("");
  const [yardageNeeded, setYardageNeeded] = useState("");
  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Uploads the file (if any), saves the pattern to Firestore, then opens it
  const handleSave = async () => {
    if (!patternName.trim()) {
      alert("Please enter a pattern name.");
      return;
    }

    setSaving(true);
    try {
      let fileUrl = null;
      if (file) {
        try {
          fileUrl = await uploadPatternFile(file);
        } catch (err) {
          console.error(err);
          alert(
            "The file could not be uploaded (check Firebase Storage). The pattern will be saved without it."
          );
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
      navigate(`/pattern/${id}`);
    } catch (err) {
      console.error(err);
      alert("Could not save the pattern. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Upload Pattern</h1>

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
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
        Pattern Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your pattern..."
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          minHeight: "100px"
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
        <option value="">Select Category</option>
        <option value="Clothing">Clothing</option>
        <option value="Blanket">Blanket</option>
        <option value="Amigurumi">Amigurumi</option>
        <option value="Accessories">Accessories</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Filet Crochet">Filet Crochet</option>
        <option value="Other">Other</option>
      </select>

      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
        YouTube Tutorial Link
      </label>
      <input
        type="text"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        placeholder="Paste YouTube tutorial link here"
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
          marginBottom: "20px",
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
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
    <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
    Total Rows (for progress tracking)
    </label>
    <input
      type="number"
      min="0"
      value={totalRows}
      onChange={(e) => setTotalRows(e.target.value)}
      placeholder="How many rows is the whole pattern?"
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    }}
  />
      <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
        Upload File
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
      {file && (
        <p style={{ marginTop: 0, marginBottom: "20px" }}>Selected: {file.name}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "12px 20px",
          background: "#e8d5ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {saving ? "Saving..." : "Save Pattern"}
      </button>
    </div>
  );
}

export default UploadPattern;