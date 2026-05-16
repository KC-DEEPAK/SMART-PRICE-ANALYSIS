import { useState } from "react";
import "./AccountPage.css";
import PriceAlertSettings from "../components/PriceAlertSettings";
import { useLanguage } from "../context/LanguageContext";
import { useUser, SignOutButton } from "@clerk/clerk-react";

function AccountPage() {
  const { t } = useLanguage();
  const { user, isLoaded } = useUser();

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

  if (!isLoaded || !user) {
    return (
      <div className="page-container" style={{ maxWidth: "800px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="agri-card mb-4 agri-card-left-border">
        <h2 style={{marginTop: 0}}>👤 {t.account}</h2>

        <div className="flex flex-wrap items-center gap-4 mb-4" style={{ padding: "20px 0", borderBottom: "1px solid #eee" }}>
          <img
            src={user.imageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--mint)" }}
          />
        </div>

        <div className="dashboard-grid mb-4">
          <div className="agri-card" style={{ boxShadow: "var(--shadow-sm)", padding: "20px" }}>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.name}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.fullName || "-"}</span></p>
            {user.primaryPhoneNumber && (
               <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.phone}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.primaryPhoneNumber.phoneNumber}</span></p>
            )}
          </div>
          <div className="agri-card" style={{ boxShadow: "var(--shadow-sm)", padding: "20px" }}>
            <p style={{ margin: "5px 0" }}><b style={{color: "var(--text-gray)"}}>{t.email}</b> <span style={{fontSize: "16px", color: "var(--text-dark)", fontWeight: 500, marginLeft: "8px"}}>{user.primaryEmailAddress?.emailAddress || "-"}</span></p>
          </div>
        </div>

        {/* 🔔 PRICE ALERT SETTINGS */}
        <div className="mb-4">
          <PriceAlertSettings crops={crops} />
        </div>

        <SignOutButton>
          <button className="btn-primary" style={{ background: "linear-gradient(135deg, #ef5350, #c62828)", marginTop: "20px" }}>
            🚪 {t.logout}
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}

export default AccountPage;
