import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import CustomAlert from "../CustomAlert";
import { useHistory } from "react-router-dom";
import { checkPermission } from "../Permissions";

const Area = (props) => {
  const history = useHistory();

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
  const { t } = useTranslation();
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
    if (atob(localStorage.getItem("auth_company_id")) !== "null") {
      const formData = new FormData();
      formData.append("city_id", data.city);
      formData.append("areaName", data.areaName);
      axios.post("/api/InsertAreas", formData).then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setModalCentered(false);
          setAlerts(true, "success", res.data.message);
        } else if (res.data.status === 304) {
          setAlerts(true, "warning", res.data.message);
        }
      });
    } else {
      swal(
        "warning",
        "Please add the company first, then the branches.",
        "warning"
      ).then((value) => {
        if (value) {
          history.push("/company");
        }
      });
    }
  };
  // insert end
  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);

  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditAreas/${id}`).then((res) => {
      if (res.data.status === 200) {
        const data = res.data.item;
        setEdit(data);
        setSelectedValue({ id: data.city_id, cityName: data.cityName });
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      }
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
    axios.post("/api/UpdateAreas", formData).then((res) => {
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
    });
  };
  // edit end

  // delete Start
  const deleteIngredient = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteAreas/${id}`).then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);

            setCheck(!check);
          } else if (res.data.status === 404) {
            setAlerts(true, "error", res.data.message);
          }
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
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getAreasCompany`);
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();

    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, [check]);

  const [selectedValue, setSelectedValue] = useState(null);

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const loadOptions = (inputValue) => {
    return axios
      .get(`/api/GetCities`, {
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id: inputValue,
        },
      })
      .then((res) => res.data)
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
          <td>{i + 1}</td>

          <td> {item.cityName}</td>
          <td> {item.areaName}</td>
          <td>
            {/* <Link to={`add-option/${item.id}`} className="btn btn-outline-danger btn-sm">{t('options')}</Link>&nbsp;&nbsp;&nbsp; */}
            {checkPermission("areas-edit") && (
              <button
                type="button"
                onClick={(e) => fetch(e, item.id)}
                className="btn btn-outline-danger btn-sm"
              >
                {t("edit")}
              </button>
            )}
            &nbsp;&nbsp;&nbsp;
            {checkPermission("areas-delete") && (
              <button
                type="button"
                onClick={(e) => deleteIngredient(e, item.id)}
                className="btn btn-outline-warning btn-sm"
              >
                {t("delete")}
              </button>
            )}
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
          {({ errors, status, setFieldValue, setFieldTouched, touched }) => (
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
                      (errors.areaName && touched.areaName ? " is-invalid" : "")
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
      {/* Edit Modal */}
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
          {({ errors, status, touched }) => (
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
                      (errors.areaName && touched.areaName ? " is-invalid" : "")
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
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("areas")}</h4>
              </div>
              <div className="dropdown">
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
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("cityName")}</th>
                      <th>{t("areaName")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>{viewProducts_HTMLTABLE}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Area;
