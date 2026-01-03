function Navbar({ setPage }) {
  return (
    <div className="navbar">
      <div>
        <h2>📊 Smart Price Analysis in Agriculture</h2>
        <p>Welcome, Deepak KC</p>
      </div>

      <div className="nav-buttons">
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("price")}>Price List</button>
        <button onClick={() => setPage("compare")}>Comparison</button>
      </div>
    </div>
  );
}

export default Navbar;
