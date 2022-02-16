import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";

const Attributes = (props) => {
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

  // for localization
  const { t } = useTranslation();

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
    axios.post("/api/InsertAttribute", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setAlerts(true, "success", res.data.message);

        setModalCentered(false);
      } else if (res.data.status === 304) {
        setAlerts(true, "warning", res.data.message);
      }
    });
  };
  // insert Attribute end

  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editAttribute, setEditAttribute] = useState([]);

  // fetch the exact Attribute
  const fetchAttribute = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditAttribute/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditAttribute(res.data.item);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      }
    });
  };
  // update the Attribute
  const updateAttribute = (data) => {
    axios.post("/api/UpdateAttribute", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setEditModalCentered(false);
        setAlerts(true, "success", res.data.message);
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      } else if (res.data.status === 304) {
        setAlerts(true, "warning", res.data.message);
      }
    });
  };
  // edit Attribute end

  // delete Attribute Start
  const deleteAttribute = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteAttribute/${id}`).then((res) => {
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
  // delete Attribute End

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/GetAttributes`);
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
            {/* <Link to={`add-option/${item.id}`} className="btn btn-outline-danger btn-sm">{t('options')}</Link>&nbsp;&nbsp;&nbsp; */}
            <button
              type="button"
              onClick={(e) => fetchAttribute(e, item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              {t("edit")}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              onClick={(e) => deleteAttribute(e, item.id)}
              className="btn btn-outline-warning btn-sm"
            >
              {t("delete")}
            </button>
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
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add_attribute")}
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("attribute_name")}</th>
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

export default Attributes;
