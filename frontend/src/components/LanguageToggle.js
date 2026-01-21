import { useState, useEffect } from "react";

function LanguageToggle() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "kn" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    window.location.reload(); // simple refresh
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "#f1f8e9"
      }}
    >
      {lang === "en" ? "ಕನ್ನಡ" : "EN"}
    </button>
  );
}

export default LanguageToggle;
