import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#f2f2f2" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
      <Link to="/patterns" style={{ marginRight: "15px" }}>Patterns</Link>
      <Link to="/yarn" style={{ marginRight: "15px" }}>Yarn Stash</Link>
      <Link to="/progress" style={{ marginRight: "15px" }}>Progress Tracker</Link>
      <Link to="/ai">AI Insights</Link>
    </nav>
  );
}

export default Navbar;
