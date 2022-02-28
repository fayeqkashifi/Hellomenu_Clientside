import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = (props) => {
  const { t } = useTranslation();

  return (
    <div
      className="row mb-1"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <div className="d-flex justify-content-center">
        <Link className="mx-2" to="/terms-of-Service">
          {t("terms_of_service")}
        </Link>
        <span>&#x2022;</span>
        <Link className="mx-2" to="/privacy-policy">
          {t("privacy_policy")}
        </Link>{" "}
      </div>
    </div>
  );
};

export default Footer;
