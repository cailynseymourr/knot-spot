import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Patterns from "./pages/Patterns";
import CreatePattern from "./pages/CreatePattern";
import YarnStash from "./pages/YarnStash";
import ProgressTracker from "./pages/ProgressTracker";
import AIInsights from "./pages/AIInsights";
import UploadPattern from "./pages/UploadPattern";
import ViewPattern from "./pages/ViewPattern";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/yarn" element={<YarnStash />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/ai/:id" element={<AIInsights />} />
        <Route path="/ai" element={<AIInsights />} />
        <Route path="/create" element={<CreatePattern />} />
        <Route path="/upload" element={<UploadPattern />} />
        <Route path="/pattern/:id" element={<ViewPattern />} />
      </Routes>
    </Router>
  );
}

export default App;
