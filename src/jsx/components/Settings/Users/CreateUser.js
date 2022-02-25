import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import Chip from "@mui/material/Chip";
import { checkPermission } from "../../Permissions";
import { base_url, port } from "../../../../Consts";
import DefaultPic from "../../../../images/hellomenu/logo.svg";
const CreateUser = () => {
  const { t } = useTranslation();
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
  useEffect(() => {
    dataLoad();

    return () => {
      setUser([]);
      setLoading(true);
    };
  }, [check]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm_new_password: "",
    role_id: "",
  });

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password length should be at least 8 characters"),
      confirm_new_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must and should match"),
      role_id: Yup.string().required("Role is required"),
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
  const handleSubmit = (data, { resetForm }) => {
    const formData = new FormData();
    // console.log(data);
    data.id && formData.append("id", data?.id);
    formData.append("profilePic", imageState.profilePic);
    formData.append("confirm_new_password", data.confirm_new_password);
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("phone_number", data.phone_number);
    formData.append("role_id", data.role_id);

    axios.post(`/api/register`, formData).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
        setCheck(!check);
        resetForm();
        setImageState([]);
        setInitialValues({
          name: "",
          email: "",
          password: "",
          confirm_new_password: "",
        });
      }
    });
  };
  const fetchUser = (id) => {
    var array = [];
    axios.get(`/api/getUser/${id}`).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        array.push({
          confirm_new_password: "",
          password: "",
          ...res.data.data,
        });
        setInitialValues(array[0]);
      }
    });
  };
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
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/deleteUser/${id}`).then((res) => {
          if (res.data.status === 200) {
            // swal("Success", res.data.message, "success");
            setCheck(!check);
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  const changeAccountStatus = (id) => {
    axios.get(`/api/changeAccountStatus/${id}`).then((res) => {
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
                            country={"af"}
                            value={initialValues?.phone_number}
                            onChange={(getOptionValue) => {
                              setFieldValue("phone_number", getOptionValue);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label> {t("profile_pic")}</label>
                          <input
                            type="file"
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
                        <div className="col">
                          <Tooltip title="Edit">
                            <IconButton onClick={(e) => fetchUser(item.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
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
        </div>
      </div>
    );
  }
};

export default CreateUser;
