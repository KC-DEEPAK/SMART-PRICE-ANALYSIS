import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ComparisonPage from "./pages/ComparisonPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import FertilizerPage from "./pages/FertilizerPage";
import DiseaseFertilizerPage from "./pages/DiseaseFertilizerPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/price-list" element={<PriceListPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route
            path="/disease-guide"
            element={<DiseaseFertilizerPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
