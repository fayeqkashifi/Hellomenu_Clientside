import React, { useState, useEffect } from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import PhoneInput, {
  isValidPhoneNumber,
  // isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import Select from "react-select";
import { base_url, port } from "../../../../Consts";
import DefaultPic from "../../../../images/hellomenu/logo.svg";
import { localization as t } from "../../Localization";
import { useHistory } from "react-router-dom";

const EditNewUser = (props) => {
  const id = props.history.location.state.id;
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [value, setValue] = useState();

  const dataLoad = async () => {
    try {
      axios.get("/api/getRoles").then((res) => {
        setRoles(res.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dataLoad();
    fetchUser(id);

    return () => {
      setLoading(true);
      setRoles([]);
    };
  }, []);

  const [initialValues, setInitialValues] = useState([]);
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/svg",
    "image/gif",
    "image/png",
  ];
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
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
      confirm_new_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must and should match"),
      role_id: Yup.string().required("Role is required"),
      profilePicCheck: Yup.mixed()
        .nullable()
        // .required("A file is required")
        .test(
          "FILE_SIZE",
          "File Size is too large",
          (value) => !value || (value && value.size <= 5000000)
        )
        .test(
          "FILE_FORMAT",
          "Unsupported File Format",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
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
    if (isValidPhoneNumber(value)) {
      const formData = new FormData();
      data.id && formData.append("id", data?.id);
      formData.append("profilePic", data.profilePicCheck);
      formData.append("confirm_new_password", data.confirm_new_password);
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("password", data.password);
      formData.append("phone_number", value);
      formData.append("role_id", data.role_id);
      axios
        .post(`/api/register`, formData)
        .then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const fetchUser = (id) => {
    var array = [];
    axios
      .get(`/api/getUser/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          array.push({
            confirm_new_password: "",
            password: "",
            ...res.data.data,
          });
          setInitialValues(array[0]);
          setValue(array[0].phone_number);

          setLoading(false);
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
      <div>
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
        <div className="row my-3">Edit USER</div>

        <div className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, status, setFieldValue, touched }) => (
              <Form>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label> {t("name")}</label>
                      <Field
                        name="name"
                        type="text"
                        className={
                          "form-control" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        }
                        placeholder={t("name")}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  <div className="col-6">
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
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label> {t("password")}</label>
                      <Field
                        name="password"
                        type="password"
                        className={
                          "form-control" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
                        placeholder={t("password")}
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
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>
                        <span className="text-danger"> * </span>
                        What is your Role?
                      </label>

                      <Select
                        options={roles?.map((lang, i) => {
                          return {
                            value: lang.id,
                            label: lang.roleName,
                          };
                        })}
                        onChange={(getOptionValue) => {
                          setFieldValue("role_id", getOptionValue.value);
                        }}
                      />
                      {errors.role_id ? (
                        <small
                          className="invalid"
                          style={{ color: "#ff4b4c", marginTop: ".5rem" }}
                        >
                          {errors.role_id}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label> {t("phone_number")}</label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        style={{
                          padding: "7px",
                          border: value
                            ? isValidPhoneNumber(value)
                              ? "1px solid #ccc"
                              : "1px solid #FF5252"
                            : "1px solid #FF5252",
                          borderRadius: "10px",
                        }}
                      />
                      <div className="text-danger">
                        <small>
                          {" "}
                          {value
                            ? isValidPhoneNumber(value)
                              ? undefined
                              : "Invalid phone number"
                            : "Phone number required"}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>
                        {" "}
                        {t("profile_pic")}
                        <small style={{ fontSize: "10px" }}>
                          {"(Max Size 5MB)"}
                        </small>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className={
                          "form-control" +
                          (errors.profilePicCheck && touched.profilePicCheck
                            ? " is-invalid"
                            : "")
                        }
                        onChange={(event) => {
                          setFieldValue(
                            "profilePicCheck",
                            event.target.files[0]
                          );
                        }}
                      />
                      <ErrorMessage
                        name="profilePicCheck"
                        component="div"
                        className="invalid-feedback"
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
                        initialValues?.profilePic
                          ? `http://${base_url}:${port}/images/profiles/${initialValues?.profilePic}`
                          : DefaultPic
                      }
                      alt="Profile Logo"
                    />
                  </div>
                </div>

                <div className="form-group text-right">
                  <button
                    className="btn btn-info mx-1"
                    onClick={() => history.goBack()}
                  >
                    {t("back")}
                  </button>
                  <button type="submit" className="btn btn-success">
                    {t("update")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
};

export default EditNewUser;
