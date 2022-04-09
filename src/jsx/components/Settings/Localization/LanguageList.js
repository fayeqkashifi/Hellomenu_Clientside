import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { Link, useRouteMatch } from "react-router-dom";
import { checkPermission } from "../../Permissions";
import "flag-icon-css/css/flag-icons.min.css";
import { Button } from "react-bootstrap";

import Select from "react-select";
import countryList from "react-select-country-list";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import Switch from "@mui/material/Switch";
import { localization as t } from "../../Localization";

const LanguageList = () => {
  const { url } = useRouteMatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);

  const dataLoad = async () => {
    try {
      axios
        .get("/api/getlocales")
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
      axios
        .get("/api/getLanguages")
        .then((res) => {
          setLanguages(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const [languages, setLanguages] = useState([]);
  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    // dataLoad();
    return () => {
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, []);
  const columns = [
    {
      key: "country_code",
    },
    {
      key: "Language_name",
    },
    {
      key: "status",
    },
    {
      key: "actions",
    },
  ];
  // delete section
  const deleteLocale = (id) => {
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
          .delete(`/api/deleteLocale/${id}`)
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
  const initialValues = {
    language: "",
    country_code: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      language: Yup.string().required("Language is required"),
      country_code: Yup.string().required("Country is required"),
    });
  };

  const handleSubmit = (data) => {
    axios
      .post(`/api/insertLocale`, data)
      .then((res) => {
        if (res.status === 200) {
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const changeLocaleStatus = (id) => {
    axios
      .get(`/api/changeLocaleStatus/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          localStorage.setItem("locale", res.data.data.locale);
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, status, setFieldValue, touched }) => (
              <Form>
                <div className="form-group">
                  <label>
                    <span className="text-danger"> * </span>
                    language?
                  </label>

                  <Select
                    options={languages?.map((lang, i) => {
                      return {
                        value: lang.id,
                        label: lang.Language_name,
                      };
                    })}
                    onChange={(getOptionValue) => {
                      setFieldValue("language", getOptionValue.value);
                    }}
                  />
                  {errors.language ? (
                    <small
                      className="invalid"
                      style={{ color: "#ff4b4c", marginTop: ".5rem" }}
                    >
                      {errors.language}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label>
                    <span className="text-danger"> * </span>
                    country?
                  </label>
                  <Select
                    className="is-invalid"
                    options={options}
                    onChange={(getOptionValue) => {
                      setFieldValue("country_code", getOptionValue.value);
                    }}
                  />
                  {errors.country_code ? (
                    <small
                      className="invalid"
                      style={{
                        color: "#ff4b4c",
                        marginTop: ".5rem",
                      }}
                    >
                      {errors.country_code}
                    </small>
                  ) : (
                    ""
                  )}
                </div>

                <div className="form-group text-right">
                  <Button variant="success" type="submit">
                    {t("save")}{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <CSmartTable
          activePage={1}
          cleaner
          columns={columns}
          columnSorter
          items={data}
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
                    onChange={() => changeLocaleStatus(item.id)}
                  />
                </td>
              );
            },
            country_code: (item) => {
              return (
                <td>
                  {" "}
                  <span
                    className={`flag-icon flag-icon-${item.country_code?.toLowerCase()}`}
                  ></span>
                </td>
              );
            },
            actions: (item) => {
              return (
                <td>
                  {checkPermission("localization-edit") && (
                    <Link
                      to={{
                        pathname: `${url}/edit-locale`,
                        state: {
                          id: item.id,
                        },
                      }}
                    >
                      <Tooltip title="Edit-Locale">
                        <IconButton>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  )}
                  {checkPermission("localization-delete") ? (
                    item.default_language || item.status ? null : (
                      <Tooltip title="Delete">
                        <IconButton onClick={() => deleteLocale(item.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  ) : null}
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
    );
  }
};

export default LanguageList;
