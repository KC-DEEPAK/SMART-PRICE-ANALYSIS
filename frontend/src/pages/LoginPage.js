import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    place: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // ✅ SAVE USER DATA IN BROWSER
    localStorage.setItem("user", JSON.stringify(form));

    // ✅ GO TO ACCOUNT PAGE
    navigate("/account");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🔐 Farmer Login / Register</h2>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", marginTop: "20px" }}
      >
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="place"
          placeholder="Village / Market Place"
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
