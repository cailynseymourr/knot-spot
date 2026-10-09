import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componets/Navbar";

import Home from "./pages/Home";
import Patterns from "./pages/Patterns";
import YarnStash from "./pages/YarnStash";
import ProgressTracker from "./pages/ProgressTracker";
import AIInsights from "./pages/AIInsights";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/yarn" element={<YarnStash />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/ai" element={<AIInsights />} />
      </Routes>
    </Router>
  );
}

export default App;
