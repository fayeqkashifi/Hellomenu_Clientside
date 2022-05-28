import React from "react";
import HeaderWizard from "./HeaderWizard";
// import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Menu = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const login = () => {
    axios
      .post("/api/login", atob(atob(atob(localStorage.getItem("credentials")))))
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_id", btoa(res.data.id));
          localStorage.setItem("role", btoa(JSON.stringify(res.data.role)));
          localStorage.setItem("locale", res.data.locale?.locale);
          history.push("/dashboard");
          localStorage.removeItem("credentials");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <HeaderWizard
        first="done active"
        second="done active"
        thrid="done active"
        fourth="editable active"
      />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">{t("congratulations")}</h3>
                  <p className="text-center"> {t("menu_setup_note")}</p>

                  <div className="form-group text-right">
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: "5px 20px 5px 20px",
                        borderRadius: "10px",
                      }}
                      onClick={login}
                    >
                      {t("dashboard")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
