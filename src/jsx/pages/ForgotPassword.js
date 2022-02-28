import React, { useState, useRef } from "react";
import Header from "./Header";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import Footer from "./Footer";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const form = useRef();
  const initialValues = {
    email: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
    });
  };
  const [error, setError] = useState("");
  const submitHandler = (data) => {
    axios.post("/api/checkEmail", data).then((res) => {
      if (res.data.status === 200) {
        // emailjs
        //   .sendForm(
        //     "service_y9bde3z",
        //     "template_09zmx2d",
        //     form.current,
        //     "user_ndblIeMx4DSPZ7jt9NuUl"
        //   )
        //   .then(
        //     (result) => {
        //       console.log(result.text);
        //     },
        //     (error) => {
        //       console.log(error.text);
        //     }
        //   );
        history.push(`/reset-password/${btoa(btoa(btoa(res.data.data.id)))}`);
      } else {
        setError(res.data.message);
      }
    });
  };

  return (
    <>
      <Header route="/login" linkName={t("sign_in")} />

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h4 className="text-center mb-4">{t("forgot_password")}</h4>
                  {error.length !== 0 && (
                    <div
                      className="alert alert-warning m-2"
                      style={{ color: "#000000" }}
                    >
                      {error}
                    </div>
                  )}

                  <Formik
                    onSubmit={submitHandler}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                  >
                    {({ errors, status, touched }) => (
                      <Form ref={form}>
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
                            placeholder={t("email_phone")}
                          />
                          <ErrorMessage
                            name="email"
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
                            {t("submit")}{" "}
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
      <Footer />
    </>
  );
};

export default ForgotPassword;
