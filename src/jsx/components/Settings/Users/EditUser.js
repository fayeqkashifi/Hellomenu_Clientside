import React, { useState, useEffect } from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import { base_url, port } from "../../../../Consts";
import DefaultPic from "../../../../images/hellomenu/logo.svg";
import { localization as t } from "../../Localization";
// import ipapi from "ipapi.co";

const EditUser = (props) => {
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
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
  // const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    return () => {
      setUser([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    // var callback = function (loc) {
    //   setIpApi(loc);
    // };
    // ipapi.location(callback);
    dataLoad();
  }, [check]);
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
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, profilePic: e.target.files[0] });
  };
  const handleSubmit = (data) => {
    const formData = new FormData();
    formData.append("profilePic", imageState.profilePic);
    formData.append("id", data.id);
    formData.append("email", data.email);
    formData.append("name", data.name);
    axios
      .post(`/api/updateRegister/${data.id}`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setCheck(!check);
        }
      })
      .catch((error) => {
        console.log(error);
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
      new_password: Yup.string()
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
      confirm_new_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("new_password")], "Passwords must and should match"),
    });
  };
  const [error, setError] = useState("");
  const changePassword = (data) => {
    axios
      .post(`/api/checkCurrentPassword`, data)
      .then((res) => {
        if (res.data.status === 200) {
          axios
            .post(`/api/resetPassword/${data.id}`, data)
            .then((res) => {
              if (res.data.status === 200) {
                setAlerts(true, "success", res.data.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setError(res.data.message);
          // setAlerts(true, "warning", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const changeAccountStatus = () => {
    axios
      .get(`/api/changeAccountStatus/${user.id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
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
        <div className="alert alert-info">
          You must log out of the system after making changes to your Account.
        </div>
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
                    // country={ipApi?.country_code?.toLowerCase()}
                    value={user?.phone_number}
                    //   name="whatsapp"
                    onChange={(getOptionValue) => {
                      setFieldValue("phone_number", getOptionValue);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label> {t("profile_pic")}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    name="profilePic"
                    onChange={handleImage}
                  />
                </div>
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "20px",
                    objectFit: "contain",
                  }}
                  src={
                    user?.profilePic
                      ? `http://${base_url}:${port}/images/profiles/${user?.profilePic}`
                      : DefaultPic
                  }
                  alt="Profile Logo"
                />

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
