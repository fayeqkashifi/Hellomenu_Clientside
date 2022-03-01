import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import { base_url, port } from "../../../Consts";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";

const Company = () => {
  // validation start
  const initialValues = {
    company: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      company: Yup.string().required("Company Name is required"),
    });
  };
  // validation end

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
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, companyLogo: e.target.files[0] });
  };
  const saveCompany = (data) => {
    const formData = new FormData();
    formData.append("companyLogo", imageState.companyLogo);
    formData.append("id", data.id);
    formData.append("company", data.company);

    axios.post("/api/InsertCompanies", formData).then((res) => {
      if (res.data.status === 200) {
        setImageState([]);
        localStorage.setItem("auth_company_id", btoa(res.data.company_id));
        setCheck(!check);
        setAlerts(true, "success", res.data.message);
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
  };
  // insert end
  // edit Start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editCompanystate, setEditCompanystate] = useState([]);

  const editCompany = (e, id) => {
    e.preventDefault();

    axios.get(`/api/EditCompanies/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditCompanystate(res.data.company);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      }
    });
  };
  const updateCompany = (data) => {
    const formData = new FormData();
    formData.append("companyLogo", imageState.companyLogo);
    formData.append("id", data.id);
    formData.append("company", data.company);

    axios.post("/api/UpdateCompanies", formData).then((res) => {
      if (res.data.status === 200) {
        setImageState([]);
        setEditCompanystate([]);
        setCheck(!check);
        setAlerts(true, "success", res.data.message);
        setEditModalCentered(false);
      }
    });
  };
  // edit End
  // delete section
  const deleteCompany = (e, id) => {
    // e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteCompanies/${id}`).then((res) => {
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
  // delete end

  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/GetCompanies");
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData);
      }
      setLoading(false);
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

  var viewCompanies_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span
          className="sr-only"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        >
          {t("loading")}
        </span>
      </div>
    );
  } else {
    viewCompanies_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <tr key={item.id}>
          <td>{i + 1}</td>
          <td>{item.company}</td>
          <td>
            {checkPermission("company-edit") && (
              <button
                type="button"
                onClick={(e) => editCompany(e, item.id)}
                className="btn btn-outline-danger btn-sm"
              >
                {t("edit")}
              </button>
            )}
            &nbsp;&nbsp;&nbsp;
            {checkPermission("company-delete") && (
              <button
                type="button"
                onClick={(e) => deleteCompany(e, item.id)}
                className="btn btn-outline-warning btn-sm d-none"
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
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <CBreadcrumbItem active>{t("companies")}</CBreadcrumbItem>
      </CBreadcrumb>
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_company")}</Modal.Title>
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
          onSubmit={saveCompany}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("company_name")}</strong>{" "}
                  </label>
                  <Field
                    name="company"
                    type="text"
                    className={
                      "form-control" +
                      (errors.company && touched.company ? " is-invalid" : "")
                    }
                    placeholder="Name...."
                  />
                  <ErrorMessage
                    name="company"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label>
                    {" "}
                    <strong>{t("logo")}</strong>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    name="companyLogo"
                    onChange={handleImage}
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
          <Modal.Title>{t("edit_company")}</Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editCompanystate}
          validationSchema={validationSchema}
          onSubmit={updateCompany}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("company_name")}</strong>{" "}
                  </label>
                  <Field
                    name="company"
                    type="text"
                    className={
                      "form-control" +
                      (errors.company && touched.company ? " is-invalid" : "")
                    }
                    placeholder="Name...."
                  />
                  <ErrorMessage
                    name="company"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label>
                    {" "}
                    <strong>{t("logo")}</strong>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    placeholder={t("category_icon")}
                    name="CategoryIcon"
                    onChange={handleImage}
                  />
                  {editCompanystate.companyLogo ? (
                    <img
                      src={`http://${base_url}:${port}/images/company/${editCompanystate.companyLogo}`}
                      width="70"
                      alt=" "
                    />
                  ) : null}
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
                <h4 className="card-title mb-2">{t("companies")} </h4>
              </div>
              <div
                className={`dropdown ${fetchData.length === 1 ? "d-none" : ""}`}
              >
                {checkPermission("company-create") && (
                  <Button
                    variant="primary"
                    type="button"
                    className="mb-2 mr-2"
                    onClick={() => setModalCentered(true)}
                  >
                    {t("add_company")}
                  </Button>
                )}
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table ">
                  <thead>
                    <tr>
                      <th>{t("number")} </th>
                      <th>{t("company_name")} </th>
                      <th>{t("actions")} </th>
                    </tr>
                  </thead>
                  <tbody>{viewCompanies_HTMLTABLE}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Company;
