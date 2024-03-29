import React, { useState, useEffect } from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import PhoneInput, {
  isValidPhoneNumber,
  // isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import Chip from "@mui/material/Chip";
import { checkPermission } from "../../Permissions";
import { base_url, port } from "../../../../Consts";
import DefaultPic from "../../../../images/hellomenu/logo.svg";
import { localization as t } from "../../Localization";
import ipapi from "ipapi.co";
import { Link, useRouteMatch } from "react-router-dom";
import { Locale } from "../../../components/DefaultLanguage";

const CreateUser = () => {
  const { url } = useRouteMatch();

  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);

  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getUsers");
      if (result.data.status === 200) {
        setUser(result.data.data);
        setLoading(false);
      }
      axios.get("/api/getRoles").then((res) => {
        setRoles(res.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    return () => {
      setUser([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
    dataLoad();
  }, [check]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm_new_password: "",
    role_id: "",
    profilePic: null,
  });
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
      profilePic: Yup.mixed()
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

  const handleSubmit = (data, { resetForm }) => {
    if (isValidPhoneNumber(value)) {
      const formData = new FormData();
      // console.log(data);
      data.id && formData.append("id", data?.id);
      formData.append("profilePic", data.profilePic);
      formData.append("confirm_new_password", data.confirm_new_password);
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("password", data.password);
      formData.append("phone_number", value);
      formData.append("role_id", data.role_id);
      formData.append("locale", JSON.stringify(Locale));

      axios
        .post(`/api/register`, formData)
        .then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);
            setCheck(!check);
            resetForm();
            setValue();
            setInitialValues({
              name: "",
              email: "",
              password: "",
              confirm_new_password: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const [value, setValue] = useState();

  const columns = [
    {
      key: "profilePic",
    },
    {
      key: "name",
    },
    {
      key: "email",
    },
    {
      key: "phone_number",
    },
    {
      key: "status",
    },
    {
      key: "roleName",
    },
    {
      key: "actions",
    },
  ];
  // delete section
  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/deleteUser/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setAlerts(true, "success", res.data.message);
            } else if (res.data.status === 404) {
              setAlerts(true, "error", res.data.message);
            }
            setCheck(!check);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setAlerts(true, "info", "Your Data is safe now!");
      }
    });
  };
  const changeAccountStatus = (id) => {
    axios
      .get(`/api/changeAccountStatus/${id}`)
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
        {checkPermission("users-create") && (
          <>
            <div className="row my-3">ADD USER</div>

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
                          <label>
                            {" "}
                            {t("name")}
                            <span className="text-danger"> * </span>
                          </label>
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
                          <label>
                            {" "}
                            {t("email")}
                            <span className="text-danger"> * </span>
                          </label>
                          <Field
                            name="email"
                            type="email"
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
                          <label>
                            {" "}
                            {t("password")}
                            <span className="text-danger"> * </span>
                          </label>
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
                          <label>
                            {" "}
                            {t("confirm_new_password")}
                            <span className="text-danger"> * </span>
                          </label>
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
                            What is your Role?
                            <span className="text-danger"> * </span>
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
                          <label>
                            {" "}
                            {t("phone_number")}
                            <span className="text-danger"> * </span>
                          </label>
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry={ipApi?.country_code}
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
                              (errors.profilePic && touched.profilePic
                                ? " is-invalid"
                                : "")
                            }
                            onChange={(event) => {
                              setFieldValue(
                                "profilePic",
                                event.target.files[0]
                              );
                            }}
                          />
                          <ErrorMessage
                            name="profilePic"
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

                    <div className="text-right">
                      <Button variant="success" type="submit">
                        {t("save")}{" "}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
        <div style={{ borderBottom: "1px solid #ccc" }}>
          <>
            <CSmartTable
              activePage={1}
              cleaner
              columns={columns}
              columnSorter
              items={user}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              tableFilter
              scopedColumns={{
                profilePic: (item) => {
                  return (
                    <td>
                      <img
                        src={
                          item?.profilePic
                            ? `http://${base_url}:${port}/images/profiles/${item?.profilePic}`
                            : DefaultPic
                        }
                        className="img-thumbnail"
                        alt=""
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </td>
                  );
                },
                roleName: (item) => {
                  return (
                    <td>
                      <Chip
                        label={item.roleName}
                        // color="primary"
                        variant="outlined"
                      />
                    </td>
                  );
                },
                status: (item) => {
                  return (
                    <td>
                      <Switch
                        defaultChecked={item.status === 1 ? true : false}
                        color="secondary"
                        onChange={() => changeAccountStatus(item.id)}
                      />
                    </td>
                  );
                },
                actions: (item) => {
                  return (
                    <td>
                      <div className="row ">
                        {checkPermission("users-edit") && (
                          <Link
                            to={{
                              pathname: `${url}/edit-user`,
                              state: {
                                id: item.id,
                              },
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Link>
                        )}
                        {checkPermission("users-delete") && (
                          <div
                            className="col"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteUser(item.id)}
                          >
                            <Tooltip title="Delete">
                              <IconButton>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                },
              }}
              tableProps={{
                striped: true,
                hover: true,
              }}
            />
          </>
        </div>
      </div>
    );
  }
};

export default CreateUser;
