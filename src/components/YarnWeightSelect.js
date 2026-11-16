// Standard craft yarn weights. Using the same list everywhere (patterns + yarn stash)
// is what lets the yarn recommender compare a pattern's needs to your stash.
export const YARN_WEIGHTS = [
  { value: "0", label: "Lace (0)" },
  { value: "1", label: "Super Fine (1)" },
  { value: "2", label: "Fine (2)" },
  { value: "3", label: "Light (3)" },
  { value: "4", label: "Medium / Worsted (4)" },
  { value: "5", label: "Bulky (5)" },
  { value: "6", label: "Super Bulky (6)" },
  { value: "7", label: "Jumbo (7)" }
];

function YarnWeightSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}
    >
      <option value="">Select yarn weight</option>
      {YARN_WEIGHTS.map((w) => (
        <option key={w.value} value={w.value}>
          {w.label}
        </option>
      ))}
    </select>
  );
}

export default YarnWeightSelect;