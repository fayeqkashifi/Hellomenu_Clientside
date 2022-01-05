import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import { base_url, port } from "../../Consts";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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

  const checkAuth = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    if (data.remember_me) {
      cookies.set("myUserName", btoa(data.email), {
        path: `http://${base_url}:${port}/page-login`,
        expires: nextYear,
      });
      cookies.set("myPassword", btoa(data.password), {
        path: `http://${base_url}:${port}/page-login`,
        expires: nextYear,
      });
    }
    axios.get("sanctum/csrf-cookie").then((response) => {
      axios.post("/api/login", data).then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_name", res.data.user);
          localStorage.setItem("auth_id", res.data.id);
          history.push("/dashboard");
        } else {
          swal("Warning", res.data.message, "warning");
        }
      });
    });
  };

  // check the auth end
  return (
    <div className="row justify-content-center h-100 align-items-center h-80">
      <div className="col-md-4 ">
        <div className="authincation-content">
          <div className="row no-gutters">
            <div className="col-xl-12">
              <div className="auth-form">
                <h4 className="text-center mb-4 ">
                  {t("sign_in_your_account")}{" "}
                </h4>
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
                            (errors.email && touched.email ? " is-invalid" : "")
                          }
                          placeholder="Email/Phone"
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
                      <div className="form-row d-flex justify-content-between mt-4 mb-2">
                        <div className="form-group">
                          <div className="custom-control custom-checkbox ml-1 ">
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
                          <Link className="" to="/forgot-password">
                            {" "}
                            {t("forgot_password")}{" "}
                          </Link>
                        </div>
                      </div>
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          {" "}
                          {t("sign_in")}{" "}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="new-account mt-3">
                  <p className="">
                    {" "}
                    {t("have_not_account")}{" "}
                    <Link className="text-primary" to="/user-register">
                      {" "}
                      {t("sign_up")}{" "}
                    </Link>{" "}
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

export default Login;
