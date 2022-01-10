import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { base_url, port } from "../../../Consts";
/// Bootstrap
import { Row } from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import DefaultPic from "../../../images/hellomenu/category.svg";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import Chip from "@mui/material/Chip";
import Backdrop from "@mui/material/Backdrop";
import ButtonGroup from "@mui/material/ButtonGroup";
const Category = (props) => {
  const { path, url } = useRouteMatch();

  // for localization
  const { t } = useTranslation();
  // ID
  const id = props.history.location.state.id;
  const [check, setCheck] = useState(true);
  const [share, setShare] = useState(false);

  // insert Start
  const [modal, setModal] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, CategoryIcon: e.target.files[0] });
  };
  const initialValues = {
    CategoryName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      CategoryName: Yup.string().required("Category Name is required"),
    });
  };
  const [productbranches, setProductBranches] = useState([]);
  const handleSelectBranches = (e) => {
    setProductBranches(e);
  };
  const saveMenu = (data) => {
    // e.preventDefault();
    const formData = new FormData();
    productbranches.map((item) => {
      formData.append("branches[]", item.value);
    });
    formData.append("CategoryIcon", imageState.CategoryIcon);
    formData.append("CategoryName", data.CategoryName);
    formData.append("branchID", id);
    axios.post("/api/InsertCategories", formData).then((res) => {
      if (res.data.status === 200) {
        setImageState([]);
        setCheck(!check);
        setShare(false);
        setProductBranches([]);
        swal("Success", res.data.message, "success");
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
  };
  const initialValuesCate = {
    categories: "",
  };
  const validationSchemaCate = () => {
    return Yup.object().shape({
      // categories: Yup.string().required("Category Name is required"),
    });
  };
  const saveCate = () => {
    // e.preventDefault();
    const formData = new FormData();

    formData.append("CategoryName", cateHandel.label);
    formData.append("branchID", id);

    axios.post("/api/InsertSharedCate", formData).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setCateHandle([]);
        swal("Success", res.data.message, "success");
        setModal(false);
        //  this.props.history.push("/")
      }
    });
  };
  // insert End
  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editMenu, setEditMenu] = useState({
    CategoryName: "",
    CategoryIcon: "",
    branchID: id,
  });
  const fetchMenus = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditMenu(res.data.menu);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  const updateMenu = (data) => {
    const formData = new FormData();
    formData.append("CategoryIcon", imageState.CategoryIcon);
    formData.append("CategoryName", data.CategoryName);
    formData.append("branchID", id);
    formData.append("id", editMenu.id);
    axios.post("/api/UpdateCategories", formData).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.status);
        setEditMenu({
          id: "",
          CategoryName: "",
          CategoryIcon: "",
          branchID: id,
        });
        setCheck(!check);

        swal("Success", res.data.message, "success");
        setEditModalCentered(false);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // edit end
  // delete start
  const deleteMenu = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteCategories/${id}`).then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            // thisClicked.closest("tr").remove();
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
  // delete end
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [cats, setCates] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetBranches`).then((res) => {
      if (res.data.status === 200) {
        setBranches(
          res.data.branches.filter((item) => {
            return item.id != id;
          })
        );
      }
    });
    axios.get(`/api/sharedCates/${id}`).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setCates(res.data);
      }
    });
    axios.get(`/api/GetCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [check]);

  const [cateHandel, setCateHandle] = useState([]);
  const handleSelectCates = (e) => {
    setCateHandle(e);
  };

  const [layout, setLayout] = useState(
    JSON.parse(
      localStorage.getItem("layoutCategory")
        ? localStorage.getItem("layoutCategory")
        : true
    )
  );
  const changeLayout = () => {
    setLayout(!layout);
    localStorage.setItem("layoutCategory", !layout);
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
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
                <Link
                  to={{
                    pathname: `${url}/sub-category`,
                    state: {
                      id: id,
                      ca_id: item.id,
                    },
                  }}
                >
                  <span>
                    <img
                      style={{
                        height: "150px",
                        width: "100%",
                        borderRadius: "10%",
                        objectFit: "contain",
                      }}
                      src={
                        item.CategoryIcon
                          ? `http://${base_url}:${port}/images/catagories/${item.CategoryIcon}`
                          : DefaultPic
                      }
                      alt="category"
                    />
                  </span>
                  <h4 className="mt-2">{item.CategoryName}</h4>
                </Link>
                {item.isShared ? (
                  <Link
                    to={{
                      pathname: `${url}/cat-shared`,
                      state: {
                        id: id,
                        sub_id: item.id,
                      },
                    }}
                  >
                    Shared
                  </Link>
                ) : (
                  // <Chip
                  //   label="Shared"
                  //   size="small"
                  //   // href="/basic-chip"
                  //   component=""
                  //   clickable
                  // />
                  ""
                )}
              </div>
            </div>

            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                <div className="col-6 pt-3 pb-3 border-right">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={(e) => fetchMenus(e, item.id)}
                  >
                    <span>{t("edit")}</span>
                  </div>
                </div>
                <div className="col-6 pt-3 pb-3">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={(e) => deleteMenu(e, item.id)}
                  >
                    <span>{t("delete")}</span>
                  </div>
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
      <Modal className="fade" show={modal}>
        <Modal.Header>
          <Modal.Title>{t("add_category")} </Modal.Title>
          <Button onClick={() => setModal(false)} variant="" className="close">
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={initialValuesCate}
          validationSchema={validationSchemaCate}
          onSubmit={saveCate}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("categories")}</label>
                  <Select
                    // isMulti
                    options={cats?.map((o, i) => {
                      return {
                        value: o.id,
                        label: o.CategoryName,
                      };
                    })}
                    name="categories"
                    onChange={handleSelectCates}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setModal(false)} variant="danger light">
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
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_category")} </Modal.Title>
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
          onSubmit={saveMenu}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("share_product_with_other_branches")}</label>
                  <Switch
                    checked={share}
                    color="secondary"
                    onChange={(e) => setShare(!share)}
                  />
                </div>
                {share ? (
                  <>
                    <div className="form-group">
                      <label> {t("branches")}</label>
                      <Select
                        isMulti
                        options={branches?.map((o, i) => {
                          return {
                            value: o.id,
                            label: o.BrancheName,
                          };
                        })}
                        name="branches"
                        onChange={handleSelectBranches}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>
                  </>
                ) : (
                  " "
                )}
                <div className="form-group">
                  <label> {t("category_name")}</label>
                  <Field
                    name="CategoryName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.CategoryName && touched.CategoryName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder={t("category_name")}
                  />
                  <ErrorMessage
                    name="CategoryName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("category_icon")}
                    name="CategoryIcon"
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
          <Modal.Title>{t("edit_category")}</Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editMenu}
          validationSchema={validationSchema}
          onSubmit={updateMenu}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("category_name")}</label>
                  <Field
                    name="CategoryName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.CategoryName && touched.CategoryName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder={t("category_name")}
                  />
                  <ErrorMessage
                    name="CategoryName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("category_icon")}
                    name="CategoryIcon"
                    onChange={handleImage}
                  />
                  <img
                    src={
                      editMenu.CategoryIcon
                        ? `http://${base_url}:${port}/images/catagories/${editMenu.CategoryIcon}`
                        : DefaultPic
                    }
                    width="70"
                    alt=" "
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

      <div className="row justify-content-end">
        <div className="col-1">
          <IconButton aria-label="Example" onClick={changeLayout}>
            {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
          </IconButton>
        </div>
      </div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => setModalCentered(true)} className="m-2">
              {" "}
              {t("add_new_category")}
            </Button>
            <Button className="m-2" onClick={() => setModal(true)}>
              {" "}
              {t("add_share_category")}
            </Button>
          </ButtonGroup>
        </Backdrop>
      </div>
      {layout ? (
        <Row>
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
                    onClick={handleToggle}
                  >
                    <AddIcon />
                    {t("add_category")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Row>
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
                    onClick={handleToggle}
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
                        <th>{t("category_name")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchData.map((item, i) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <Link
                                to={{
                                  pathname: `${url}/sub-category`,
                                  state: {
                                    id: id,
                                    sub_id: item.id,
                                  },
                                }}
                              >
                                <div>
                                  <img
                                    style={{
                                      height: "50px",
                                      width: "100%",
                                      borderRadius: "10%",
                                      objectFit: "contain",
                                    }}
                                    src={
                                      item.CategoryIcon
                                        ? `http://${base_url}:${port}/images/catagories/${item.CategoryIcon}`
                                        : DefaultPic
                                    }
                                    alt="category"
                                  />
                                </div>
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={{
                                  pathname: `${url}/sub-category`,
                                  state: {
                                    id: id,
                                    sub_id: item.id,
                                  },
                                }}
                              >
                                {item.CategoryName}
                              </Link>
                              {item.isShared ? (
                                <Chip label="Shared" size="small" />
                              ) : (
                                ""
                              )}
                            </td>

                            <td>
                              <button
                                type="button"
                                onClick={(e) => fetchMenus(e, item.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                {t("edit")}
                              </button>
                              &nbsp;&nbsp;&nbsp;
                              <button
                                type="button"
                                onClick={(e) => deleteMenu(e, item.id)}
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

export default Category;
