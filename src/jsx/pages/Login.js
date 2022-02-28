import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import { base_url, port } from "../../Consts";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../components/CustomAlert";
import Header from "./Header";
import Footer from "./Footer";

const Login = () => {
  const cookies = new Cookies();
  // for localization
  const { t } = useTranslation();

  const history = useHistory();
  // check the auth Start
  const initialValues = {
    email: cookies.get("myUserName") ? atob(cookies.get("myUserName")) : "",
    password: cookies.get("myPassword") ? atob(cookies.get("myPassword")) : "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string().required("Email Or Phone Number is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    });
  };
  const current = new Date();
  const nextYear = new Date();

  nextYear.setFullYear(current.getFullYear() + 2);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const checkAuth = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    if (data.remember_me) {
      cookies.set("myUserName", btoa(data.email), {
        path: `http://${base_url}:${port}/login`,
        expires: nextYear,
      });
      cookies.set("myPassword", btoa(data.password), {
        path: `http://${base_url}:${port}/login`,
        expires: nextYear,
      });
    }
    axios.get("sanctum/csrf-cookie").then((response) => {
      axios.post("/api/login", data).then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_name", btoa(res.data.user));
          localStorage.setItem("auth_company_id", btoa(res.data.company_id));
          localStorage.setItem("auth_id", btoa(res.data.id));
          res.data.role === null
            ? localStorage.setItem("role", btoa(JSON.stringify(res.data.role)))
            : localStorage.setItem("role", btoa(res.data.role.permissions));
          localStorage.setItem("locale", res.data.locale?.locale);
          history.push("/dashboard");
        } else {
          setAlerts(true, "warning", res.data.message);
        }
      });
    });
  };

  // check the auth end
  return (
    <>
      <Header route="/signup" linkName={t("sign_up")} />
      <div className="row justify-content-center ">
        {alert.open ? (
          <CustomAlert
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            setAlert={setAlert}
          />
        ) : (
          ""
        )}
        <div className="col-md-4">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h4 className="text-center">{t("sign_in_your_account")} </h4>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={checkAuth}
                  >
                    {({ errors, status, touched }) => (
                      <Form>
                        <div className="form-group">
                          <label htmlFor="email"> {t("email")} </label>
                          <Field
                            name="email"
                            type="text"
                            className={
                              "form-control" +
                              (errors.email && touched.email
                                ? " is-invalid"
                                : "")
                            }
                            placeholder={t("email_phone")}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password"> {t("password")} </label>
                          <Field
                            name="password"
                            type="password"
                            className={
                              "form-control" +
                              (errors.password && touched.password
                                ? " is-invalid"
                                : "")
                            }
                            placeholder="*******"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox ">
                            <Field
                              type="checkbox"
                              name="remember_me"
                              className="custom-control-input"
                              id="basic_checkbox_1"
                            />
                            <label
                              htmlFor="basic_checkbox_1"
                              className="custom-control-label"
                            >
                              {t("remember_me")}{" "}
                            </label>

                            <Field
                              name="remember_me"
                              type="checkbox"
                              className="custom-control-input"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <button
                            type="submit"
                            className="btn-primary btn-block"
                            style={{
                              padding: "10px 20px 10px 20px",
                              borderRadius: "10px",
                              fontSize: "16px",
                              border: "none",
                            }}
                          >
                            {" "}
                            {t("sign_in")}{" "}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  <div className="d-flex justify-content-center">
                    <Link className="mr-2" to="/forgot-password">
                      {" "}
                      {t("forgot_password")}{" "}
                    </Link>
                    <span>&#x2022;</span>
                    <Link className="ml-2" to="/signup">
                      {t("have_not_account")}{" "}
                    </Link>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
