import { useLanguage } from "../context/LanguageContext";

function LanguageToggle() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div style={{ position: "relative", display: "inline-block", margin: "0 10px" }}>
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="lang-toggle-btn"
        style={{
          appearance: "none",
          paddingRight: "30px",
          outline: "none"
        }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="kn">🇮🇳 ಕನ್ನಡ</option>
        <option value="hi">🇮🇳 हिंदी</option>
        <option value="ta">🇮🇳 தமிழ்</option>
      </select>
      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--primary-green)", fontSize: "12px" }}>
        ▼
      </span>
    </div>
  );
}

export default LanguageToggle;
