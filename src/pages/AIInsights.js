import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AIInsights() {
  // ------------------------------------------------------------
  // GET PATTERN ID FROM URL
  // Example: /ai/3 → id = 3
  // Later, AI will analyze the pattern using this ID.
  // ------------------------------------------------------------
  const { id } = useParams();

  // ------------------------------------------------------------
  // STATE: AI results (placeholder)
  // Later, this will come from your AI backend.
  // ------------------------------------------------------------
  const [insights, setInsights] = useState({
    recommendedYarn: "Loading...",
    difficulty: "Loading...",
    estimatedTime: "Loading...",
    hookSize: "Loading...",
    summary: "Loading..."
  });

  // ------------------------------------------------------------
  // LOAD AI INSIGHTS (placeholder)
  // Later: fetch AI results using Firebase + your AI model
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("Running AI analysis for pattern:", id);

    // Placeholder simulated AI results
    setTimeout(() => {
      setInsights({
        recommendedYarn: "Worsted weight acrylic",
        difficulty: "Intermediate",
        estimatedTime: "4–6 hours",
        hookSize: "5.0mm (H)",
        summary:
          "This pattern uses simple stitches but requires attention to row counts."
      });
    }, 800);
  }, [id]);

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
        AI Insights
      </h1>

      {/* --------------------------------------------------------
          PATTERN SUMMARY
      --------------------------------------------------------- */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Pattern #{id} Insights</h2>
        <p>{insights.summary}</p>
      </div>

      {/* --------------------------------------------------------
          RECOMMENDED YARN
      --------------------------------------------------------- */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Recommended Yarn</h2>
        <p>{insights.recommendedYarn}</p>
      </div>

      {/* --------------------------------------------------------
          DIFFICULTY LEVEL
      --------------------------------------------------------- */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Difficulty</h2>
        <p>{insights.difficulty}</p>
      </div>

      {/* --------------------------------------------------------
          ESTIMATED TIME
      --------------------------------------------------------- */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Estimated Time to Complete</h2>
        <p>{insights.estimatedTime}</p>
      </div>

      {/* --------------------------------------------------------
          HOOK SIZE
      --------------------------------------------------------- */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Suggested Hook Size</h2>
        <p>{insights.hookSize}</p>
      </div>
    </div>
  );
}

export default AIInsights;

