function Home() {
  return (
    <div
      style={{
        // MAIN CONTAINER — controls overall layout
        display: "flex",
        alignItems: "center",      // vertical centering
        justifyContent: "center",  // horizontal centering
        padding: "60px 20px",      // space around the hero section
        minHeight: "80vh"          // makes it tall like a landing page
      }}
    >
      {/* LEFT SIDE — TEXT SECTION */}
      <div
        style={{
          maxWidth: "500px",        // keeps text from stretching too wide
          marginRight: "40px"       // space between text and image
        }}
      >
        {/* MAIN TITLE */}
        <h1
          style={{
            fontSize: "3rem",       // change size here
            marginBottom: "20px"    // spacing under title
            // You can change color here: color: "#yourColor"
          }}
        >
          Knot Spot
        </h1>

        {/* SUB‑HEADLINE / DESCRIPTION */}
        <p
          style={{
            fontSize: "1.2rem",     // change text size
            color: "#555",          // change text color
            marginBottom: "30px"    // spacing under paragraph
          }}
        >
          Your creative crochet companion — organize patterns, track your yarn stash,
          plan projects, and get smart AI insights.
        </p>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "15px" }}>
          {/* PRIMARY BUTTON */}
          <a href="/patterns" style={buttonStyle}>
            Get Started
          </a>

          {/* SECONDARY BUTTON */}
          <a href="/ai" style={secondaryButtonStyle}>
            Learn More
          </a>
        </div>
      </div>

      {/* RIGHT SIDE — IMAGE / ILLUSTRATION PLACEHOLDER */}
      <div
        style={{
          width: "400px",           // change image box width
          height: "300px",          // change image box height
          background: "#f3f3f3",    // change background color
          borderRadius: "12px",     // roundness of corners
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",            // text color inside placeholder
          fontSize: "1rem"
        }}
      >
        Image / Illustration Here
      </div>
    </div>
  );
}

/* PRIMARY BUTTON STYLE */
const buttonStyle = {
  padding: "12px 20px",           // button size
  background: "#e8d5ff",          // button color
  borderRadius: "8px",            // rounded corners
  textDecoration: "none",         // removes underline
  color: "#333",                  // text color
  fontWeight: "bold"              // bold text
  // Add hover effects later in CSS if you want
};

/* SECONDARY BUTTON STYLE */
const secondaryButtonStyle = {
  padding: "12px 20px",
  background: "#fff",             // white background
  border: "2px solid #e8d5ff",    // outline color
  borderRadius: "8px",
  textDecoration: "none",
  color: "#333",
  fontWeight: "bold"
};

export default Home;
