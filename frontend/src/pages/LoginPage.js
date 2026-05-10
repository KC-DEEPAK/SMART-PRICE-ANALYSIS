import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    place: ""
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // ✅ SAVE USER DATA
    localStorage.setItem("user", JSON.stringify(form));

    navigate("/account");
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <form className="agri-card" style={{ width: "100%", maxWidth: "450px", padding: "40px" }} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "10px", marginTop: 0 }}>{t.farmerLogin}</h2>
        <p style={{ textAlign: "center", color: "var(--text-gray)", marginBottom: "30px", fontSize: "14px" }}>
          {t.loginSubtitle}
        </p>

        <div className="flex-col gap-3 mb-4">
          <input className="modern-input" type="text" name="name" placeholder={t.fullName} value={form.name} onChange={handleChange} required />
          <input className="modern-input" type="tel" name="phone" placeholder={t.phoneNumber} value={form.phone} onChange={handleChange} required />
          <input className="modern-input" type="email" name="email" placeholder={t.emailAddress} value={form.email} onChange={handleChange} required />
          <input className="modern-input" type="password" name="password" placeholder={t.password} value={form.password} onChange={handleChange} required />
          <input className="modern-input" type="text" name="place" placeholder={t.village} value={form.place} onChange={handleChange} required />
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px" }} type="submit">🔐 {t.login}</button>
      </form>
    </div>
  );
}

export default LoginPage;
