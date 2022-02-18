import React from "react";
import Header from "./Header";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import axios from "axios";
import * as Yup from "yup";

const ResetPassword = (props) => {
  const { t } = useTranslation();
  const id = atob(atob(atob(props.match.params.id)));

  const initialValues = {
    new_password: "",
    confrim_password: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      new_password: Yup.string()
        .required("Password is required")
        .min(8, "Password length should be at least 8 characters"),
      confrim_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("new_password")], "Passwords must and should match"),
    });
  };
  const submitHandler = (data) => {
    axios.post(`/api/resetPassword/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        props.history.push("/login");
      }
    });
  };

  return (
    <div className="row justify-content-center">
      <Header route="/login" linkName="Log In" />
      <div className="col-md-6">
        <div className="authincation-content">
          <div className="row no-gutters">
            <div className="col-xl-12">
              <div className="auth-form">
                <h4 className="text-center mb-4">Reset Password</h4>
                <Formik
                  onSubmit={submitHandler}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                >
                  {({ errors, status, touched }) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          name="new_password"
                          type="password"
                          className={
                            "form-control" +
                            (errors.new_password && touched.new_password
                              ? " is-invalid"
                              : "")
                          }
                          placeholder={t("new_password")}
                        />
                        <ErrorMessage
                          name="new_password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          name="confrim_password"
                          type="password"
                          className={
                            "form-control" +
                            (errors.confrim_password && touched.confrim_password
                              ? " is-invalid"
                              : "")
                          }
                          placeholder={t("confirm_new_password")}
                        />
                        <ErrorMessage
                          name="confrim_password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="text-center">
                        <button
                          tppe="submit"
                          className="btn-primary btn-block"
                          style={{
                            padding: "10px 20px 10px 20px",
                            borderRadius: "10px",
                            fontSize: "16px",
                            border: "none",
                          }}
                        >
                          {t("change")}{" "}
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
  );
};

export default ResetPassword;
