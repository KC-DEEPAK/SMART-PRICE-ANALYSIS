import { useState } from "react";
import "./AccountPage.css";
import PriceAlertSettings from "../components/PriceAlertSettings";
import { useLanguage } from "../context/LanguageContext";

function AccountPage() {
  const { t } = useLanguage();

  // 👤 USER DATA
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user] = useState(storedUser);

  // 📸 PROFILE PHOTO
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto")
  );

  const handlePhotoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profilePhoto", reader.result);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 🌾 SAFELY GET CROPS FOR ALERT SETTINGS
  const crops = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("allCrops"));
      return Array.isArray(saved)
        ? [...new Set(saved)].filter(Boolean)
        : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="agri-card mb-4 agri-card-left-border">
        <h2 style={{marginTop: 0}}>👤 {t.account}</h2>

        <div className="flex flex-wrap items-center gap-4 mb-4" style={{ padding: "20px 0", borderBottom: "1px solid #eee" }}>
          <img
            src={photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--mint)" }}
          />
          <div>
            <label className="btn-secondary" style={{ cursor: "pointer", fontSize: "14px", padding: "8px 16px" }}>
              {t.changePhoto}
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        <div className="dashboard-grid mb-4">
          <div className="agri-card" style={{ boxShadow: "var(--shadow-sm)", padding: "20px" }}>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.name}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.name || "-"}</span></p>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.phone}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.phone || "-"}</span></p>
          </div>
          <div className="agri-card" style={{ boxShadow: "var(--shadow-sm)", padding: "20px" }}>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.email}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.email || "-"}</span></p>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.place}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.place || "-"}</span></p>
          </div>
        </div>

        {/* 🔔 PRICE ALERT SETTINGS */}
        <div className="mb-4">
          <PriceAlertSettings crops={crops} />
        </div>

        <button className="btn-primary" style={{ background: "linear-gradient(135deg, #ef5350, #c62828)", marginTop: "20px" }} onClick={handleLogout}>
          🚪 {t.logout}
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
