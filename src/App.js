import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componets/Navbar";

import Home from "./pages/Home";
import Patterns from "./pages/Patterns";
import YarnStash from "./pages/YarnStash";
import ProgressTracker from "./pages/ProgressTracker";
import AIInsights from "./pages/AIInsights";
import UploadPattern from "./pages/UploadPattern";

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
        <Route path="/upload" element={<UploadPattern />} />
      </Routes>
    </Router>
  );
}

export default App;
