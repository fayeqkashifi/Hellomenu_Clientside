import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
// import axios from "axios";
// axios.get("/api/getLocale").then((res) => {
//   localStorage.setItem("locale", JSON.stringify(res.data));
// });

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    supportedLngs: ["en", "tr"],
    fallbackLng: "en",
    detection: {
      // order and from where user language should be detected
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
    // resources: axios.get("/api/getLocale").then((res) => {
    //   return res.data;
    // }),
  });
const loadingMarkup = (
  <div className="py-4 text-center">
    <div
      className="spinner-border text-primary "
      role="status"
      style={{ position: "fixed", top: "50%", left: "50%" }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
