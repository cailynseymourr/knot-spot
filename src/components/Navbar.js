import { Link, useLocation } from "react-router-dom";
import YarnBall from "./YarnBall";

// Each link lights up when the current page matches. "Patterns" also covers
// the single-pattern, create, edit and upload pages.
const links = [
  { to: "/", label: "Home", match: (p) => p === "/" },
  {
    to: "/patterns",
    label: "Patterns",
    match: (p) =>
      ["/patterns", "/pattern", "/create", "/edit", "/upload"].some(
        (s) => p === s || p.startsWith(s + "/")
      )
  },
  { to: "/yarn", label: "Yarn Stash", match: (p) => p === "/yarn" },
  { to: "/progress", label: "Progress Tracker", match: (p) => p === "/progress" },
  { to: "/ai", label: "AI Insights", match: (p) => p.startsWith("/ai") }
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <YarnBall size={52} />
        Knot Spot
      </Link>

      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar-link${link.match(pathname) ? " active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;