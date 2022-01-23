import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { base_url, port } from "../../../Consts";
import DefaultPic from "../../../images/hellomenu/sub_category.svg";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";

const SubCategory = (props) => {
  const initialValues = {
    SubCategoryName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      SubCategoryName: Yup.string().required("Sub Category Name is required"),
    });
  };
  // for localization
  const { t } = useTranslation();
  const id = props.history.location.state.sub_id;
  const [check, setCheck] = useState(true);

  // insert start
  const [modalCentered, setModalCentered] = useState(false);

  const [imageState, setImageState] = useState([]);

  const handleImage = (e) => {
    setImageState({ ...imageState, SubCategoryIcon: e.target.files[0] });
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
  const saveSubMenu = (data) => {
    // e.preventDefault();
    const checkCate = fetchData.every((item) => {
      return item.SubCategoryName !== data.SubCategoryName;
    });
    if (checkCate) {
      const formData = new FormData();
      formData.append("SubCategoryName", data.SubCategoryName);
      formData.append("CategoryID", id);
      formData.append("SubCategoryIcon", imageState.SubCategoryIcon);
      axios.post("/api/InsertSubCategories", formData).then((res) => {
        if (res.data.status === 200) {
          setImageState([]);
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
          setModalCentered(false);
        }
      });
    } else {
      setAlerts(true, "warning", "Already exists, Please Try another name!");
    }
  };
  // insert End

  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editSubMenu, setEditSubMenu] = useState([]);

  const fetchSubMenus = (e, id) => {
    e.preventDefault();

    axios.get(`/api/EditSubCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditSubMenu(res.data.menu);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      }
    });
  };
  const updateSubMenu = (data) => {
    const formData = new FormData();
    formData.append("SubCategoryIcon", imageState.SubCategoryIcon);
    formData.append("SubCategoryName", data.SubCategoryName);
    formData.append("CategoryID", id);
    formData.append("id", editSubMenu.id);
    axios.post("/api/UpdateSubCategory", formData).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);

        setEditModalCentered(false);
        setCheck(!check);

        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        setAlerts(true, "error", res.data.message);
      } else if (res.data.status === 304) {
        setAlerts(true, "warning", res.data.message);
      }
    });
  };
  // edit end
  // delete start
  const deleteSubMenu = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteSubCategories/${id}`).then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);

            setCheck(!check);

            // thisClicked.closest("tr").remove();
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
  useEffect(() => {
    axios.get(`/api/GetSubCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [check, id]);
  const [layout, setLayout] = useState(
    JSON.parse(
      localStorage.getItem("layoutSubCategory")
        ? localStorage.getItem("layoutSubCategory")
        : true
    )
  );
  const changeLayout = () => {
    setLayout(!layout);
    localStorage.setItem("layoutSubCategory", !layout);
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
        <div className="col-xl-3 col-lg-3 col-sm-6 col-md-3" key={i}>
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="text-center">
                <img
                  style={{
                    height: "100px",
                    width: "100%",
                    borderRadius: "10%",
                    objectFit: "contain",
                  }}
                  src={
                    item.SubCategoryIcon
                      ? `http://${base_url}:${port}/images/sub_catagories/${item.SubCategoryIcon}`
                      : DefaultPic
                  }
                  alt="sub category"
                />

                <h4 className="mt-2">{item.SubCategoryName}</h4>
              </div>
            </div>

            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                <div className="col-6 pt-3 pb-3 border-right">
                  <Link to="" onClick={(e) => fetchSubMenus(e, item.sub_id)}>
                    <span>{t("edit")}</span>
                  </Link>
                </div>
                <div className="col-6 pt-3 pb-3">
                  <Link to="" onClick={(e) => deleteSubMenu(e, item.sub_id)}>
                    <span>{t("delete")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <CBreadcrumbItem
          className="font-weight-bold"
          // onClick={() => history.goBack()}
        >
          {t("categories")}
        </CBreadcrumbItem>
        <CBreadcrumbItem active>{t("sub_category")}</CBreadcrumbItem>
      </CBreadcrumb>
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_sub_Category")}</Modal.Title>
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
          onSubmit={saveSubMenu}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("sub_category_icon")}</label>
                  <Field
                    name="SubCategoryName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.SubCategoryName && touched.SubCategoryName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder={t("category_name")}
                  />
                  <ErrorMessage
                    name="SubCategoryName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("sub_category_icon")}
                    name="SubCategoryIcon"
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
          <Modal.Title>{t("edit_sub_category")}</Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editSubMenu}
          validationSchema={validationSchema}
          onSubmit={updateSubMenu}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("sub_category_icon")}</label>
                  <Field
                    name="SubCategoryName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.SubCategoryName && touched.SubCategoryName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder={t("category_name")}
                  />
                  <ErrorMessage
                    name="SubCategoryName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("sub_category_icon")}
                    name="SubCategoryIcon"
                    onChange={handleImage}
                  />
                </div>
                <img
                  src={
                    editSubMenu.SubCategoryIcon
                      ? `http://${base_url}:${port}/images/sub_catagories/${editSubMenu.SubCategoryIcon}`
                      : DefaultPic
                  }
                  width="70"
                  alt=" "
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setEditModalCentered(false)}
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
      <div className="row justify-content-end">
        <div className="col-1">
          <IconButton aria-label="Example" onClick={changeLayout}>
            {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
          </IconButton>
        </div>
      </div>
      {layout ? (
        <div className="row">
          {viewProducts_HTMLTABLE}
          <div className="col-xl-3 col-lg-3 col-sm-6 col-md-3">
            <div className="card overflow-hidden ">
              <div
                className="card-body d-flex justify-content-center text-center"
                style={{ border: "2px dashed #f50b65" }}
              >
                <div className="align-self-center text-center">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setModalCentered(true)}
                  >
                    <AddIcon />

                    {t("add_sub_Category")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">{t("categories")}</h4>
                </div>
                <div className="dropdown">
                  <Button
                    variant="primary"
                    type="button"
                    className="mb-2 mr-2"
                    onClick={() => setModalCentered(true)}
                  >
                    {t("add_category")}
                  </Button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead>
                      <tr className="card-title">
                        <th>{t("image")}</th>
                        <th>{t("sub_category_name")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchData.map((item, i) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <div>
                                <img
                                  style={{
                                    height: "50px",
                                    width: "100%",
                                    borderRadius: "10%",
                                    objectFit: "contain",
                                  }}
                                  src={
                                    item.SubCategoryIcon
                                      ? `http://${base_url}:${port}/images/sub_catagories/${item.SubCategoryIcon}`
                                      : DefaultPic
                                  }
                                  alt="category"
                                />
                              </div>
                            </td>
                            <td>{item.SubCategoryName}</td>

                            <td>
                              <button
                                type="button"
                                onClick={(e) => fetchSubMenus(e, item.sub_id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                {t("edit")}
                              </button>
                              &nbsp;&nbsp;&nbsp;
                              <button
                                type="button"
                                onClick={(e) => deleteSubMenu(e, item.sub_id)}
                                className="btn btn-outline-warning btn-sm"
                              >
                                {t("delete")}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SubCategory;
