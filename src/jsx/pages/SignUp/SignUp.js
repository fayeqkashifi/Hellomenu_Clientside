import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../Header";
import { useTranslation } from "react-i18next";
import "./style.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import logo from "../../../images/hellomenu/logo.svg";
import { Locale } from "../../components/DefaultLanguage";
import Select from "react-select";

const SignUp = () => {
  const history = useHistory();

  const { t } = useTranslation();
  const initialValues = {
    email: "",
    password: "",
    confirmpassword: "",
    locale: JSON.stringify(Locale),
    company: "",
    business_type_id: "",
  };
  const [business, setBusiness] = useState([]);
  useEffect(() => {
    axios
      .get("/api/getBusinessType")
      .then((res) => {
        setBusiness(res.data.fetchData);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      setBusiness([]);
    };
  }, []);
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(40, "Password must not exceed 40 characters")
        .matches(
          /^(?=.*[a-z])/,
          "Must contain at least one lowercase character"
        )
        .matches(
          /^(?=.*[A-Z])/,
          "Must contain at least one uppercase character"
        )
        .matches(/^(?=.*[0-9])/, "Must contain at least one number")
        .matches(
          /^(?=.*[!@#%&])/,
          "Must contain at least one special character"
        ),
      confirmpassword: Yup.string()
        .required("Confirm Password Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      company: Yup.string().required("Name of the business is required"),
      business_type_id: Yup.string().required("Type of business is required"),
    });
  };
  const [alert, setAlert] = useState("");
  const handleSubmit = (data) => {
    axios
      .get("sanctum/csrf-cookie")
      .then((response) => {
        axios
          .post("/api/register", data)
          .then((res) => {
            if (res.data.status === 200) {
              axios
                .post("/api/login", data)
                .then((res) => {
                  if (res.data.status === 200) {
                    localStorage.setItem("auth_token", res.data.token);
                    localStorage.setItem("auth_id", btoa(res.data.id));
                    localStorage.setItem(
                      "role",
                      btoa(JSON.stringify(res.data.role))
                    );
                    localStorage.setItem("locale", res.data.locale?.locale);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              history.push({
                pathname: `/onboarding/user`,
                state: {
                  userId: res.data.id,
                },
              });
            } else {
              setAlert(res.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Header route="/login" linkName={t("sign_in")} />
      <div className="row ">
        <div className="col-md-5 m-2 f d-flex align-items-center justify-content-center">
          {/* <p style={{ fontSize: "66px" }} className="text-center text-primary">
            HELLO MENU
          </p> */}
          <img src={logo} width="80%" alt="Logo" />

          {/* <label>Same Text</label> */}
        </div>
        <div className="col-md-6 m-2">
          <div className="authincation-content">
            {/* <div className="row no-gutters"> */}
            {/* <div className="col-xl-12"> */}
            <div className="auth-form">
              <h4 className="text-center mb-4">
                {t("setup_your_menu_in_minutes")}
              </h4>
              <label>{t("setup_note")}</label>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  errors,
                  status,
                  touched,
                  values,
                  isValid,
                  setFieldValue,
                }) => (
                  <Form>
                    <div className="row">
                      <div className="col-12">
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
                            placeholder={t("email")}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>
                      <div className="col-6">
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
                            placeholder="Password"
                          />

                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <Field
                            name="confirmpassword"
                            type="password"
                            className={
                              "form-control" +
                              (errors.confirmpassword && touched.confirmpassword
                                ? " is-invalid"
                                : "")
                            }
                            placeholder="Re-Type Password"
                          />
                          <ErrorMessage
                            name="confirmpassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <Field
                          name="company"
                          type="text"
                          placeholder={t("what_is_the_name_of_the_business")}
                          className={
                            "form-control" +
                            (errors.company && touched.company
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="company"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="form-group">
                        <Select
                          placeholder={t("what_is_the_type_of_business")}
                          options={business?.map((bus, i) => {
                            return {
                              value: bus.id,
                              label: bus.BusinessName,
                            };
                          })}
                          onChange={(getOptionValue) => {
                            setFieldValue(
                              "business_type_id",
                              getOptionValue.value
                            );
                          }}
                        />
                        {errors.business_type_id ? (
                          <small
                            className="invalid"
                            style={{ color: "#ff4b4c", marginTop: ".5rem" }}
                          >
                            {errors.business_type_id}
                          </small>
                        ) : (
                          ""
                        )}
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
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
