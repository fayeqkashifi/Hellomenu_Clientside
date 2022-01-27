import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../components/CustomAlert";
import "yup-phone";
const Registration = () => {
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Fullname is required"),
      phone_number: Yup.string()
        .phone()
        .required("Phone number is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    });
  };
  const history = useHistory();
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
  const handleSubmit = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    axios.get("sanctum/csrf-cookie").then((response) => {
      axios.post("/api/register", data).then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success").then((check) => {
            if (check) {
              axios.post("/api/login", data).then((res) => {
                if (res.data.status === 200) {
                  localStorage.setItem("auth_token", res.data.token);
                  localStorage.setItem("auth_name", btoa(res.data.user));
                  localStorage.setItem(
                    "auth_company_id",
                    btoa(res.data.company_id)
                  );
                  localStorage.setItem("auth_id", btoa(res.data.id));
                  history.push("/dashboard");
                  // window.location = "/dashboard";
                } else {
                  setAlerts(true, "warning", res.data.message);
                }
              });
            }
          });
        } else {
          setAlerts(true, "warning", res.data.message);
        }
      });
    });
  };
  // validation end
  const initialValues = {
    name: "",
    phone_number: "",
    email: "",
    password: "",
  };
  // for localization
  const { t } = useTranslation();

  return (
    <div className="row justify-content-center  h-200 align-items-center h-80">
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
                <div className="text-center mb-3">
                  <h4 className="text-center mb-4">
                    {t("sign_up_your_account")}
                  </h4>
                </div>
                <div className="register-form">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, status, touched }) => (
                      <Form>
                        <div className="form-group">
                          <label> {t("full_name")}</label>
                          <Field
                            name="name"
                            type="text"
                            className={
                              "form-control" +
                              (errors.name && touched.name ? " is-invalid" : "")
                            }
                            placeholder="Smith..."
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone_number">
                            {" "}
                            {t("phone_number")}{" "}
                          </label>
                          <Field
                            name="phone_number"
                            type="text"
                            className={
                              "form-control" +
                              (errors.phone_number && touched.phone_number
                                ? " is-invalid"
                                : "")
                            }
                            placeholder="+93--- ---- ----"
                          />
                          <ErrorMessage
                            name="phone_number"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email"> {t("email")} </label>
                          <Field
                            name="email"
                            type="email"
                            className={
                              "form-control" +
                              (errors.email && touched.email
                                ? " is-invalid"
                                : "")
                            }
                            placeholder="a@gmail.com"
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
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            {t("sign_me_up")}{" "}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>

                <div className="new-account mt-3">
                  <p className="">
                    {t("already_have_an_account")}{" "}
                    <Link className="text-primary" to="/page-login">
                      {t("sign_in")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
