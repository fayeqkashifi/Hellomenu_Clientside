import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
const Registration = () => {
  // validation start
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Fullname is required"),
      phone_number: Yup.string()
        .required("Password is required")
        .matches(phoneRegExp, "Phone number is not valid"),
      // .matches(phoneRegExp, "Phone number is not valid"),
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

  const handleSubmit = (data) => {
    console.log(JSON.stringify(data, null, 2));
    axios.get("sanctum/csrf-cookie").then((response) => {
      axios.post("/api/register", data).then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success").then((check) => {
            if (check) {
              history.push("/page-login");
            }
          });
        } else {
          console.log(res.data.data);

          swal("warning", res.data.message, "warning");
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
                    <Form>
                      <div className="form-group">
                        <label> {t("full_name")}</label>
                        <Field
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Smith..."
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
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
                          className="form-control"
                          placeholder="0093--- ---- ----"
                        />
                        <ErrorMessage
                          name="phone_number"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email"> {t("email")} </label>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="a@gmail.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password"> {t("password")} </label>
                        <Field
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="*******"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
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
