import { useState } from "react";

function YarnStash() {
  // ------------------------------------------------------------
  // STATE: List of yarns
  // Later, this will come from Firebase.
  // ------------------------------------------------------------
  const [yarns, setYarns] = useState([
    {
      id: 1,
      name: "Red Heart Super Saver",
      color: "Soft White",
      weight: "Worsted (4)",
      yards: 364,
      brand: "Red Heart"
    }
  ]);

  // ------------------------------------------------------------
  // STATE: New yarn form inputs
  // ------------------------------------------------------------
  const [newYarn, setNewYarn] = useState({
    name: "",
    color: "",
    weight: "",
    yards: "",
    brand: ""
  });

  // ------------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ------------------------------------------------------------
  const handleChange = (e) => {
    setNewYarn({
      ...newYarn,
      [e.target.name]: e.target.value
    });
  };

  // ------------------------------------------------------------
  // ADD YARN
  // Later: save to Firebase
  // ------------------------------------------------------------
  const addYarn = () => {
    if (!newYarn.name) {
      alert("Please enter a yarn name.");
      return;
    }

    setYarns((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newYarn,
        yards: Number(newYarn.yards)
      }
    ]);

    // Reset form
    setNewYarn({
      name: "",
      color: "",
      weight: "",
      yards: "",
      brand: ""
    });
  };

  // ------------------------------------------------------------
  // DELETE YARN
  // Later: delete from Firebase
  // ------------------------------------------------------------
  const deleteYarn = (id) => {
    setYarns((prev) => prev.filter((y) => y.id !== id));
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
          PAGE TITLE
      --------------------------------------------------------- */}
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px"
        }}
      >
        Yarn Stash
      </h1>

      {/* --------------------------------------------------------
          ADD NEW YARN FORM
      --------------------------------------------------------- */}
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
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          name="color"
          value={newYarn.color}
          onChange={handleChange}
          placeholder="Color"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          name="weight"
          value={newYarn.weight}
          onChange={handleChange}
          placeholder="Weight (e.g., Worsted 4)"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          name="yards"
          value={newYarn.yards}
          onChange={handleChange}
          placeholder="Yardage"
          type="number"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          name="brand"
          value={newYarn.brand}
          onChange={handleChange}
          placeholder="Brand"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={addYarn}
          style={{
            padding: "12px 20px",
            background: "#e8d5ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Add Yarn
        </button>
      </div>

      {/* --------------------------------------------------------
          YARN LIST
      --------------------------------------------------------- */}
      <h2>Your Yarn</h2>

      {yarns.map((yarn) => (
        <div
          key={yarn.id}
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        >
          <strong>{yarn.name}</strong>
          <p>Color: {yarn.color}</p>
          <p>Weight: {yarn.weight}</p>
          <p>Yards: {yarn.yards}</p>
          <p>Brand: {yarn.brand}</p>

          <button
            onClick={() => deleteYarn(yarn.id)}
            style={{
              padding: "8px 12px",
              background: "#ffdddd",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default YarnStash;
