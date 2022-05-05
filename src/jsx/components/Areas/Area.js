import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";

const Area = () => {
  // validation start
  const initialValues = {
    areaName: "",
    city: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      areaName: Yup.string().required("Area Name is required"),
      city: Yup.string().required("Please select a Category"),
    });
  };
  // validation end

  // for localization
  // insert start
  const [modalCentered, setModalCentered] = useState(false);
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
  const save = (data) => {
    const formData = new FormData();
    formData.append("city_id", data.city);
    formData.append("areaName", data.areaName);
    axios.post("/api/insertAreas", formData).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setModalCentered(false);
        setAlerts(true, "success", res.data.message);
      } else if (res.data.status === 304) {
        setAlerts(true, "warning", res.data.message);
      }
    });
  };
  // insert end
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);

  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editAreas/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          const data = res.data.item;
          setEdit(data);
          setSelectedValue({ id: data.city_id, cityName: data.cityName });
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // update
  const initialValuesEdit = {
    areaName: edit.areaName,
    city: edit.city_id,
    id: edit.id,
  };
  const update = (data) => {
    const formData = new FormData();
    formData.append("city_id", selectedValue.id);
    formData.append("areaName", data.areaName);
    formData.append("id", data.id);
    axios
      .post("/api/updateAreas", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setSelectedValue(null);
          setEditModalCentered(false);
          setAlerts(true, "success", res.data.message);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        } else if (res.data.status === 304) {
          setAlerts(true, "warning", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // edit end

  // delete Start
  const deleteAreas = (e, id) => {
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
          .delete(`/api/deleteAreas/${id}`)
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
  // delete End

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = () => {
    try {
      axios.get(`/api/getAreasCompany`).then((result) => {
        if (result.data.status === 200) {
          setFetchData(result.data.fetchData.data);
          setLoading(false);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // dataLoad();
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [check]);
  const [selectedValue, setSelectedValue] = useState(null);

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  let cancelToken;

  const loadOptions = (inputValue) => {
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }
    cancelToken = axios.CancelToken.source();
    return axios
      .get(`/api/getCities`, {
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id: inputValue,
        },
        cancelToken: cancelToken.token,
      })
      .then((res) => {
        if (res !== undefined) {
          return res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <tr key={item.id}>
          <td> {item.cityName}</td>
          <td> {item.areaName}</td>
          <td>
            <div
              className="input-group"
              style={{
                display: "table" /* Instead of display:block */,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {checkPermission("areas-edit") && (
                <button
                  type="button"
                  onClick={(e) => fetch(e, item.id)}
                  className="btn btn-outline-info btn-sm"
                >
                  {t("edit")}
                </button>
              )}
              &nbsp;
              {checkPermission("areas-delete") && (
                <button
                  type="button"
                  onClick={(e) => deleteAreas(e, item.id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  {t("delete")}
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  }
  return (
    <Fragment>
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
      {/* insert */}
      {modalCentered && (
        <Modal className="fade" show={modalCentered}>
          <Modal.Header>
            <Modal.Title>{t("add")}</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={save}
          >
            {({ errors, setFieldValue, touched }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label>
                      <strong>{t("city")}</strong>
                    </label>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      // value={selectedValue}
                      getOptionLabel={(e) => e.cityName}
                      getOptionValue={(e) => e.id}
                      loadOptions={loadOptions}
                      onChange={(getOptionValue) => {
                        setFieldValue("city", getOptionValue.id);
                      }}
                    />
                    {errors.city ? (
                      <small
                        className="invalid"
                        style={{ color: "red", marginTop: ".5rem" }}
                      >
                        {errors.city}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-group">
                    <label>
                      <strong>{t("name_area")}</strong>
                    </label>

                    <Field
                      name="areaName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.areaName && touched.areaName
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Name...."
                    />
                    <ErrorMessage
                      name="areaName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => setModalCentered(false)}
                    variant="danger light"
                  >
                    {t("close")}
                  </Button>
                  <Button variant="primary" type="submit">
                    {t("save")}{" "}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}{" "}
      {editmodalCentered && (
        <Modal className="fade" show={editmodalCentered}>
          <Modal.Header>
            <Modal.Title>{t("edit")} </Modal.Title>
            <Button
              onClick={() => setEditModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={initialValuesEdit}
            validationSchema={validationSchema}
            onSubmit={update}
          >
            {({ errors, touched }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label>
                      <strong>{t("city")}</strong>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      value={selectedValue}
                      getOptionLabel={(e) => e.cityName}
                      getOptionValue={(e) => e.id}
                      loadOptions={loadOptions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <strong>{t("name_area")}</strong>
                    </label>
                    <Field
                      name="areaName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.areaName && touched.areaName
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Name...."
                    />
                    <ErrorMessage
                      name="areaName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => setEditModalCentered(false)}
                    variant="danger light"
                  >
                    {t("close")}
                  </Button>
                  <Button variant="primary" type="submit">
                    {t("update")}{" "}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("areas")}</h4>
              </div>
              <div>
                <div className="input-group">
                  <Search
                    setFetchData={setFetchData}
                    url={"/api/searchArea"}
                    defaultUrl={"/api/getAreasCompany"}
                  />
                  {checkPermission("areas-create") && (
                    <Button
                      variant="primary"
                      type="button"
                      className="mb-2 mr-2"
                      onClick={() => setModalCentered(true)}
                    >
                      {t("add")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead className="table-light">
                    <tr>
                      <th>{t("cityName")}</th>
                      <th>{t("areaName")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchData.length !== 0 ? (
                      viewProducts_HTMLTABLE
                    ) : (
                      <tr>
                        <td colSpan={3}> {t("noItemFound")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer border-0">
              <Paginate
                fetchData={fetchData}
                setFetchData={setFetchData}
                url={"/api/getAreasCompany"}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Area;
