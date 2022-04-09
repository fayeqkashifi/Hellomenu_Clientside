import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";

const Attributes = () => {
  // validation start
  const initialValues = {
    attributeName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      attributeName: Yup.string().required("Attribute Name is required"),
    });
  };
  // validation end

  // insert Attribute start
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
  const saveAttribute = (data) => {
    axios
      .post("/api/insertAttribute", data)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
          setModalCentered(false);
        } else {
          setAlerts(true, "error", res.data.message);
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // insert Attribute end

  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editAttribute, setEditAttribute] = useState([]);

  // fetch the exact Attribute
  const fetchAttribute = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editAttribute/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditAttribute(res.data.item);
          setEditModalCentered(true);
        } else {
          setAlerts(true, "error", res.data.message);
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // update the Attribute
  const updateAttribute = (data) => {
    axios
      .post("/api/updateAttribute", data)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
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
  // edit Attribute end

  // delete Attribute Start
  const deleteAttribute = (e, id) => {
    e.preventDefault();
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
          .delete(`/api/deleteAttribute/${id}`)
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
  // delete Attribute End
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getAttributes`);
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData.data);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
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

          <td> {item.attributeName}</td>
          <td>
            <div
              className="input-group"
              style={{
                display: "table" /* Instead of display:block */,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {checkPermission("attributes-edit") && (
                <button
                  type="button"
                  onClick={(e) => fetchAttribute(e, item.id)}
                  className="btn btn-outline-info btn-sm"
                >
                  {t("edit")}
                </button>
              )}
              &nbsp;&nbsp;&nbsp;
              {checkPermission("attributes-delete") && (
                <button
                  type="button"
                  onClick={(e) => deleteAttribute(e, item.id)}
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
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_attribute")}</Modal.Title>
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
          onSubmit={saveAttribute}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("attribute_name")}</label>
                  <Field
                    name="attributeName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.attributeName && touched.attributeName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="Name...."
                  />
                  <ErrorMessage
                    name="attributeName"
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
          <Modal.Title>{t("edit_Attribute")} </Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editAttribute}
          validationSchema={validationSchema}
          onSubmit={updateAttribute}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("attribute_name")}</label>
                  <Field
                    name="attributeName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.attributeName && touched.attributeName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="Name...."
                  />
                  <ErrorMessage
                    name="attributeName"
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
                <h4 className="card-title mb-2">{t("attributes")}</h4>
              </div>
              <div>
                <div className="input-group">
                  <Search
                    setFetchData={setFetchData}
                    url={"/api/searchAttribute"}
                    defaultUrl={"/api/getAttributes"}
                  />
                  {checkPermission("attributes-create") && (
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
                      <th>{t("number")}</th>
                      <th>{t("attribute_name")}</th>
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
                url={"/api/getAttributes"}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Attributes;
