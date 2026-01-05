import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ComparisonPage from "./pages/ComparisonPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/price-list" element={<PriceListPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
