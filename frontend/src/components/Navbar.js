import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ✅ SAFE CHECK LOGIN STATUS
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
          Dashboard
        </Link>

        <Link to="/price-list" className="nav-link">
          Price List
        </Link>

        <Link to="/comparison" className="nav-link">
          Comparison
        </Link>

        {/* 🌱 Fertilizer / Disease */}
        <Link to="/fertilizer" className="nav-link">
          🌱 Fertilizer
        </Link>

        {/* LOGIN / ACCOUNT */}
        {!user ? (
          <Link to="/login" className="nav-link login-btn">
            🔐 Login
          </Link>
        ) : (
          <>
            <Link to="/account" className="nav-link">
              👤 My Account
            </Link>

            <button
              onClick={handleLogout}
              className="nav-link logout-btn"
              style={{ background: "none", border: "none" }}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
