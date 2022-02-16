import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import HeaderWizard from "./HeaderWizard";
import { Link, useRouteMatch } from "react-router-dom";

const Menu = () => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();

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
                  <h3 className="text-center">
                    How would you like to setup your menu?
                  </h3>
                  <p className="text-center">
                    {" "}
                    Let’s set up your menu, remember you can manage it anytime.
                  </p>

                  <div className="form-group text-right">
                    <Link
                      to={`/dashboard`}
                      className="text-primary"
                      style={{
                        padding: "5px 20px 5px 20px",
                        borderRadius: "10px",
                      }}
                    >
                      Skip i'll do later
                    </Link>
                    <Link
                      to={`/dashboard`}
                      className="btn-primary"
                      style={{
                        padding: "5px 20px 5px 20px",
                        borderRadius: "10px",
                      }}
                    >
                      Continue
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
