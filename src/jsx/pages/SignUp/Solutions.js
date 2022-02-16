import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import HeaderWizard from "./HeaderWizard";
import { Link, useRouteMatch } from "react-router-dom";

const Solutions = () => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();

  return (
    <>
      <HeaderWizard
        first="done active"
        second="done active"
        thrid="editable active"
        fourth=""
      />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">Choose the solutions you need</h3>
                  <p className="text-center">
                    {" "}
                    Depending on "faiq Company’s" business type, we recommend
                    the solutions below. You can add or remove solutions later.
                  </p>

                  <div className="form-group text-right">
                    <Link
                      to={`/onboarding/menu`}
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

export default Solutions;
