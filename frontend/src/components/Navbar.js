import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import translations from "../utils/translations";
import LanguageToggle from "./LanguageToggle";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // 🌐 LANGUAGE
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  const t = translations[lang];

  // 👤 SAFE LOGIN CHECK
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        🌾 <span className="logo-text">Smart Crop Price</span>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <Link to="/" className="nav-link">
          {t.dashboard}
        </Link>

        <Link to="/price-list" className="nav-link">
          {t.priceList}
        </Link>

        <Link to="/comparison" className="nav-link">
          {t.comparison}
        </Link>

        <Link to="/fertilizer" className="nav-link">
          🌱 {t.fertilizer}
        </Link>

        {/* 🌐 LANGUAGE TOGGLE */}
        <LanguageToggle />

        {/* LOGIN / ACCOUNT */}
        {!user ? (
          <Link to="/login" className="nav-link login-btn">
            🔐 {t.login}
          </Link>
        ) : (
          <>
            <Link to="/account" className="nav-link">
              👤 {t.account}
            </Link>

            <button
              onClick={handleLogout}
              className="nav-link logout-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              🚪 {t.logout}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
