import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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

        <Link to="/login" className="nav-link login-btn">
          🔐 Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
