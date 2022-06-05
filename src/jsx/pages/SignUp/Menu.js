import React from "react";
import HeaderWizard from "./HeaderWizard";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Menu = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeaderWizard
        first="done active"
        second="done active"
        thrid="editable active"
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
                    <Link
                      to="/dashboard"
                      className="btn btn-primary"
                      // style={{
                      //   padding: "5px 20px 5px 20px",
                      //   borderRadius: "10px",
                      // }}
                      // onClick={login}
                    >
                      {t("dashboard")}
                    </Link>
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
