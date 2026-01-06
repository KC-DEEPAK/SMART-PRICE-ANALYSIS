import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ✅ check login status
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        🌾 <span className="logo-text">Smart Crop Price</span>
      </div>

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

        {/* ✅ CONDITIONAL RENDER */}
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
