import { useState, useEffect } from "react";
import { saveYarn, listYarns, deleteYarn, imageToDataUrl } from "../services/yarnService";
import YarnWeightSelect, { YARN_WEIGHTS } from "../components/YarnWeightSelect";
import YarnBall from "../components/YarnBall";
import ConfirmDialog from "../components/ConfirmDialog";

const emptyYarn = { name: "", brand: "", color: "", weight: "", yards: "" };

const weightLabel = (value) =>
  YARN_WEIGHTS.find((w) => w.value === value)?.label || "Not set";

// Shown on a yarn card that has no photo
function YarnIcon() {
  return <YarnBall size={96} />;
}

function YarnStash() {
  const [yarns, setYarns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // problems from adding or deleting
  const [newYarn, setNewYarn] = useState(emptyYarn);
  const [photo, setPhoto] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // changing this clears the file input
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // the yarn waiting for confirmation

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

  // ADD YARN: shrinks the photo (if any), saves to Firestore, adds to the list
  const addYarn = async () => {
    setMessage("");
    if (!newYarn.name.trim()) {
      setMessage("Enter a yarn name first.");
      return;
    }

    setSaving(true);
    try {
      let photoUrl = null;
      let photoWarning = "";
      if (photo) {
        try {
          photoUrl = await imageToDataUrl(photo);
        } catch (err) {
          console.error(err);
          photoWarning = "The photo could not be processed, so the yarn was saved without it.";
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
      setMessage(photoWarning);
    } catch (err) {
      console.error(err);
      setMessage("Could not save the yarn. Check the console for details.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE: runs after the person confirms in the dialog
  const confirmDelete = async () => {
    const yarn = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteYarn(yarn.id);
      setYarns((prev) => prev.filter((y) => y.id !== yarn.id));
    } catch (err) {
      console.error(err);
      setMessage("Could not delete that yarn. Try again.");
    }
  };

  return (
    <div className="page">
      <h1>Yarn Stash</h1>
      <p className="page-intro">
        Everything you own, with the weight and yardage the AI uses to pick yarn for a pattern.
      </p>

      {/* ADD YARN */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Add yarn</h2>

        <div className="form-grid">
          <div>
            <label className="label" htmlFor="yarn-name">Yarn name</label>
            <input
              id="yarn-name"
              className="input"
              name="name"
              value={newYarn.name}
              onChange={handleChange}
              placeholder="Red Heart Super Saver"
            />
          </div>
          <div>
            <label className="label" htmlFor="yarn-brand">Brand</label>
            <input
              id="yarn-brand"
              className="input"
              name="brand"
              value={newYarn.brand}
              onChange={handleChange}
              placeholder="Red Heart"
            />
          </div>
          <div>
            <label className="label" htmlFor="yarn-color">Color</label>
            <input
              id="yarn-color"
              className="input"
              name="color"
              value={newYarn.color}
              onChange={handleChange}
              placeholder="Soft white"
            />
          </div>
          <div>
            <label className="label" htmlFor="yarn-weight">Weight</label>
            <YarnWeightSelect
              value={newYarn.weight}
              onChange={(value) => setNewYarn({ ...newYarn, weight: value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="yarn-yards">Yardage</label>
            <input
              id="yarn-yards"
              className="input"
              name="yards"
              type="number"
              min="0"
              value={newYarn.yards}
              onChange={handleChange}
              placeholder="364"
            />
          </div>
          <div>
            <label className="label" htmlFor="yarn-photo">Photo (optional)</label>
            <input
              id="yarn-photo"
              key={fileInputKey}
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
            />
          </div>
        </div>

        {message && <p className="error-text">{message}</p>}

        <button className="btn btn-primary" onClick={addYarn} disabled={saving}>
          {saving ? "Saving..." : "Add yarn"}
        </button>
      </div>

      {/* YARN LIST */}
      <h2>Your yarn</h2>

      {loading && <p className="muted">Loading your yarn...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && yarns.length === 0 && (
        <p>Your stash is empty. Add your first skein above.</p>
      )}

      <div className="yarn-grid">
        {yarns.map((yarn) => (
          <div className="card yarn-card" key={yarn.id}>
            {yarn.photoUrl ? (
              <img className="yarn-photo" src={yarn.photoUrl} alt={yarn.name} />
            ) : (
              <div className="yarn-photo yarn-photo-empty">
                <YarnIcon />
              </div>
            )}

            <h3>{yarn.name}</h3>
            {yarn.brand && <p className="muted">{yarn.brand}</p>}
            <p>
              <strong>Color:</strong> {yarn.color || "Not set"}
            </p>
            <p>
              <strong>Weight:</strong> {weightLabel(yarn.weight)}
            </p>
            <p>
              <strong>Yardage:</strong> {yarn.yards} yd
            </p>

            <div className="card-actions">
              <button
                className="btn btn-danger btn-small"
                onClick={() => setPendingDelete(yarn)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this yarn?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from your stash. This can't be undone.`
            : ""
        }
        confirmLabel="Delete yarn"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default YarnStash;