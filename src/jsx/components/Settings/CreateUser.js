import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
const CreateUser = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const [user, setUser] = useState([]);
  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getUsers");
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
  }, [check]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm_new_password: "",
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
    axios.post(`/api/register`, data).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
        setCheck(!check);
        resetForm();
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
            setCheck(!check);
            swal("Success", res.data.message, "success");
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
                </div>
                <div className="row my-3">USER PERMISSION</div>

                <div className="text-right">
                  <Button variant="success" type="submit">
                    {t("save")}{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
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
                      <div className="col">
                        <Tooltip title="Edit">
                          <IconButton onClick={(e) => fetchUser(item.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
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
      </>
    );
  }
};

export default CreateUser;
