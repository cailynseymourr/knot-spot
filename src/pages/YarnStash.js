import { useState, useEffect } from "react";
import { saveYarn, listYarns, deleteYarn, imageToDataUrl } from "../services/yarnService";
import YarnWeightSelect, { YARN_WEIGHTS } from "../components/YarnWeightSelect";

const emptyYarn = { name: "", brand: "", color: "", weight: "", yards: "" };

function YarnStash() {
  const [yarns, setYarns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newYarn, setNewYarn] = useState(emptyYarn);
  const [photo, setPhoto] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // changing this clears the file input
  const [saving, setSaving] = useState(false);

  // Load the stash from Firestore
  useEffect(() => {
    listYarns()
      .then(setYarns)
      .catch((err) => {
        console.error(err);
        setError("Could not load your yarn. Check your Firebase setup.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setNewYarn({ ...newYarn, [e.target.name]: e.target.value });
  };

  // ADD YARN: uploads the photo (if any), saves to Firestore, adds to the list
  const addYarn = async () => {
    if (!newYarn.name.trim()) {
      alert("Please enter a yarn name.");
      return;
    }

    setSaving(true);
    try {
      let photoUrl = null;
      if (photo) {
        try {
          photoUrl = await imageToDataUrl(photo);
        } catch (err) {
          console.error(err);
          alert(
            "The photo could not be processed. The yarn will be saved without a photo."
          );
        }
      }

      const fields = {
        name: newYarn.name.trim(),
        brand: newYarn.brand,
        color: newYarn.color,
        weight: newYarn.weight,
        yards: Number(newYarn.yards) || 0,
        photoUrl
      };
      const id = await saveYarn(fields);

      setYarns((prev) => [{ id, ...fields }, ...prev]);
      setNewYarn(emptyYarn);
      setPhoto(null);
      setFileInputKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      alert("Could not save the yarn. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE YARN
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this yarn?")) return;
    try {
      await deleteYarn(id);
      setYarns((prev) => prev.filter((y) => y.id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete the yarn.");
    }
  };

  const weightLabel = (value) =>
    YARN_WEIGHTS.find((w) => w.value === value)?.label || "Not set";

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Yarn Stash</h1>

      {/* ADD NEW YARN FORM */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "30px"
        }}
      >
        <h2>Add Yarn</h2>

        <input
          name="name"
          value={newYarn.name}
          onChange={handleChange}
          placeholder="Yarn Name"
          style={inputStyle}
        />
        <input
          name="brand"
          value={newYarn.brand}
          onChange={handleChange}
          placeholder="Brand"
          style={inputStyle}
        />
        <input
          name="color"
          value={newYarn.color}
          onChange={handleChange}
          placeholder="Color"
          style={inputStyle}
        />

        <YarnWeightSelect
          value={newYarn.weight}
          onChange={(value) => setNewYarn({ ...newYarn, weight: value })}
        />

        <input
          name="yards"
          value={newYarn.yards}
          onChange={handleChange}
          placeholder="Yardage"
          type="number"
          min="0"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
          Photo (optional)
        </label>
        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0] || null)}
          style={{ marginBottom: "15px" }}
        />

        <div>
          <button
            onClick={addYarn}
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
            {saving ? "Saving..." : "Add Yarn"}
          </button>
        </div>
      </div>

      {/* YARN LIST */}
      <h2>Your Yarn</h2>

      {loading && <p>Loading your yarn...</p>}
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!loading && !error && yarns.length === 0 && (
        <p>No yarn yet. Add your first skein above!</p>
      )}

      {yarns.map((yarn) => (
        <div
          key={yarn.id}
          style={{
            display: "flex",
            gap: "15px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        >
          {yarn.photoUrl && (
            <img
              src={yarn.photoUrl}
              alt={yarn.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <strong>{yarn.name}</strong>
            <p>Brand: {yarn.brand || "Not set"}</p>
            <p>Color: {yarn.color || "Not set"}</p>
            <p>Weight: {weightLabel(yarn.weight)}</p>
            <p>Yards: {yarn.yards}</p>

            <button
              onClick={() => handleDelete(yarn.id)}
              style={{
                padding: "8px 12px",
                background: "#ffdddd",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default YarnStash;