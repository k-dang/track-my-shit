import "./App.css";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import AddStock from "./components/AddStock";
import Header from "./components/Header";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Portfolio />} />
          <Route path="add" element={<AddStock />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
