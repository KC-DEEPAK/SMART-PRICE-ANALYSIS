import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import PriceListPage from "./pages/PriceListPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Backend error:", err));
  }, []);

  return (
    <>
      {/* NAV BAR */}
      <div className="navbar">
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("list")}>Price List</button>
        <button onClick={() => setPage("compare")}>Comparison</button>
      </div>

      {/* PAGES */}
      {page === "dashboard" && <Dashboard data={data} />}
      {page === "list" && <PriceListPage data={data} />}
      {page === "compare" && <ComparisonPage data={data} />}
    </>
  );
}

export default App;
