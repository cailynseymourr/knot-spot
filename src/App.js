import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Patterns from "./pages/Patterns";
import YarnInventory from "./pages/YarnInventory";
import ProgressTracker from "./pages/ProgressTracker";
import AIInsights from "./pages/AIInsights";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/yarn" element={<YarnInventory />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/ai" element={<AIInsights />} />
      </Routes>
    </Router>
  );
}

export default App;
