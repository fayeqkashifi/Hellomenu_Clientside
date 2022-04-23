import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import HeaderWizard from "./HeaderWizard";

import { useLocation, useHistory } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ipapi from "ipapi.co";

const OnBoarding = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const history = useHistory();

  const userId = location.state.userId;
  const [value, setValue] = useState();
  const initialValues = {
    name: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
    });
  };
  const handleSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone_number", value);
    axios
      .post(`/api/updateRegister/${userId}`, formData)
      .then((res) => {
        localStorage.setItem("auth_name", btoa(data.name));
        history.push({
          pathname: `/onboarding/venue`,
          state: {
            userId: userId,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
    return () => {
      setIpApi([]);
    };
  }, []);
  return (
    <>
      <HeaderWizard first="editable active" second="" thrid="" fourth="" />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">{t("welcome_to_hello_menu")}</h3>
                  <p className="text-center">{t("tell_us_about_yourself")}</p>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, status, touched }) => (
                      <Form>
                        <div className="form-group">
                          <label htmlFor="email">
                            <span className="text-danger"> * </span>
                            {t("what_is_your_name")}
                          </label>

                          <Field
                            name="name"
                            type="text"
                            className={
                              "form-control" +
                              (errors.name && touched.name ? " is-invalid" : "")
                            }
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">
                            {t("what_is_your_phone_number")}
                          </label>
                          <PhoneInput
                            country={ipApi?.country_code?.toLowerCase()}
                            value={value}
                            onChange={(phone) => setValue(phone)}
                          />
                        </div>

                        <div className="form-group text-right">
                          <button
                            type="submit"
                            className="btn-primary"
                            style={{
                              padding: "5px 20px 5px 20px",
                              borderRadius: "10px",
                              border: "none",
                            }}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnBoarding;
