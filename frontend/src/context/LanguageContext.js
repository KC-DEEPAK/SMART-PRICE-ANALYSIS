import React, { createContext, useState, useEffect, useContext } from "react";
import en from "../translations/en";
import kn from "../translations/kn";
import hi from "../translations/hi";
import ta from "../translations/ta";

const translations = { en, kn, hi, ta };

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Provide the entire translation object for the current language
  // as `t`. Fallback to English if something is missing.
  const t = new Proxy(translations[lang] || translations.en, {
    get: function(target, prop) {
      return target[prop] || translations.en[prop] || prop;
    }
  });

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
