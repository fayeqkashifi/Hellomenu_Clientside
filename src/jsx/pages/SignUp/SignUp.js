import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../Header";
import { useTranslation } from "react-i18next";
import "./style.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import logo from "../../../images/hellomenu/logo.svg";

const SignUp = () => {
  const history = useHistory();

  const { t } = useTranslation();
  const initialValues = {
    email: "",
    password: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    });
  };
  const [alert, setAlert] = useState("");
  const handleSubmit = (data) => {
    axios.get("sanctum/csrf-cookie").then((response) => {
      axios.post("/api/register", data).then((res) => {
        if (res.data.status === 200) {
          history.push({
            pathname: `/onboarding/user`,
            state: {
              userId: res.data.id,
            },
          });
        } else {
          setAlert(res.data.message);
        }
      });
      axios.post("/api/login", data).then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_id", btoa(res.data.id));
          localStorage.setItem("role", btoa(JSON.stringify(res.data.role)));
          localStorage.setItem("locale", res.data.locale?.locale);
        }
      });
    });
  };
  return (
    <>
      <Header route="/login" linkName="Log In" />
      <div className="row ">
        <div className="col-md-6 m-2 f d-flex align-items-center justify-content-center">
          {/* <p style={{ fontSize: "66px" }} className="text-center text-primary">
            HELLO MENU
          </p> */}
          <img src={logo} width="80%" alt="Logo" />

          {/* <label>Same Text</label> */}
        </div>
        <div className="col-md-5 m-2">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h4 className="text-center mb-4">
                    Setup Your Menu in Minutes
                  </h4>
                  <label>
                    No commitments. Try for free now and pay later. No credit
                    card required.
                  </label>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, status, touched }) => (
                      <Form>
                        <div className="form-group">
                          <Field
                            name="email"
                            type="text"
                            className={
                              "form-control" +
                              (errors.email && touched.email
                                ? " is-invalid"
                                : "")
                            }
                            placeholder="E-mail"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
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
                            {t("sign_up")}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  {alert.length !== 0 && (
                    <div
                      className="alert alert-warning "
                      style={{ color: "#000000" }}
                    >
                      {alert}
                    </div>
                  )}
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

export default SignUp;
