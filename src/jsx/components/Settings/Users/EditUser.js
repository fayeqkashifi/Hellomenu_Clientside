import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
const EditUser = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const dataLoad = async () => {
    try {
      const result = await axios.get(
        `/api/getUser/${atob(localStorage.getItem("auth_id"))}`
      );
      if (result.data.status === 200) {
        setUser(result.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();

    return () => {
      setUser([]);
      setLoading(true);
    };
  }, []);
  const initialValues = {
    id: user?.id,
    name: user?.name ? user.name : "",
    email: user?.email ? user.email : "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
    });
  };
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
    axios.post(`/api/UpdateRegister/${data.id}`, data).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
      }
    });
  };
  const values = {
    id: user?.id,

    password: user?.password ? user.password : "",
    new_password: "",
    confirm_new_password: "",
  };
  const schema = () => {
    return Yup.object().shape({
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password length should be at least 8 characters"),
      new_password: Yup.string()
        .required("Password is required")
        .min(8, "Password length should be at least 8 characters"),
      confirm_new_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("new_password")], "Passwords must and should match"),
    });
  };
  const [error, setError] = useState("");
  const changePassword = (data) => {
    axios.post(`/api/checkCurrentPassword`, data).then((res) => {
      if (res.data.status === 200) {
        axios.post(`/api/resetPassword/${data.id}`, data).then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);
          }
        });
      } else {
        setError(res.data.message);
        // setAlerts(true, "warning", res.data.message);
      }
    });
  };
  const changeAccountStatus = () => {
    axios.get(`/api/changeAccountStatus/${user.id}`).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
      }
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="spinner-border "
          role="status"
          style={{ color: "#5373e3" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
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
        <div className="row my-3">USER INFORMATION</div>

        <div className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, status, setFieldValue, touched }) => (
              <Form>
                <div className="form-group">
                  <label> {t("name")}</label>
                  <Field
                    name="name"
                    type="text"
                    className={"form-control"}
                    placeholder={t("name")}
                  />
                </div>
                <div className="form-group">
                  <label> {t("email")}</label>
                  <Field
                    name="email"
                    type="email"
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
                    placeholder={t("email")}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("phone_number")}</label>
                  <PhoneInput
                    country={"af"}
                    value={user?.phone_number}
                    //   name="whatsapp"
                    onChange={(getOptionValue) => {
                      setFieldValue("phone_number", getOptionValue);
                    }}
                  />
                </div>
                <div className="text-right">
                  <Button variant="success" type="submit">
                    {t("save")}{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="row my-3">PASSWORD</div>
        <div className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
          <Formik
            initialValues={values}
            validationSchema={schema}
            onSubmit={changePassword}
          >
            {({ errors, status, touched }) => (
              <Form>
                {error.length !== 0 && (
                  <div
                    className="alert alert-warning "
                    style={{ color: "#000000" }}
                  >
                    {error}
                  </div>
                )}
                <div className="form-group">
                  <label> {t("current_password")}</label>
                  <Field
                    name="password"
                    type="password"
                    className={
                      "form-control" +
                      (errors.password && touched.password ? " is-invalid" : "")
                    }
                    placeholder={t("current_password")}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("new_password")}</label>
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
                  <label> {t("confirm_new_password")}</label>
                  <Field
                    name="confirm_new_password"
                    type="password"
                    className={
                      "form-control" +
                      (errors.confirm_new_password &&
                      touched.confirm_new_password
                        ? " is-invalid"
                        : "")
                    }
                    placeholder={t("confirm_new_password")}
                  />
                  <ErrorMessage
                    name="confirm_new_password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="text-right">
                  <Button variant="success" type="submit">
                    {t("change")}{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="py-4">
          <div className="text-center">
            <Button variant="danger" onClick={() => changeAccountStatus()}>
              {t("close_account")}{" "}
            </Button>
          </div>
        </div>
      </>
    );
  }
};

export default EditUser;
