import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { base_url, port } from "../../../Consts";
const SubCategory = (props) => {
  // validation start
  const schema = yup
    .object()
    .shape({
      SubCategoryName: yup.string().required("This field is a required field"),
    })
    .required();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // validation end
  // for localization
  const { t } = useTranslation();
  const id = props.match.params.id;

  // insert start
  const [modalCentered, setModalCentered] = useState(false);
  const [subCategoryInsert, setSubCategoryInsert] = useState({
    SubCategoryName: "",
    CategoryID: id,
  });
  const handleInput = (e) => {
    e.persist();
    setSubCategoryInsert({
      ...subCategoryInsert,
      [e.target.name]: e.target.value,
    });
  };
  const [imageState, setImageState] = useState([]);

  const handleImage = (e) => {
    setImageState({ ...imageState, SubCategoryIcon: e.target.files[0] });
  };
  const saveSubMenu = (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("SubCategoryName", subCategoryInsert.SubCategoryName);
    formData.append("CategoryID", subCategoryInsert.CategoryID);
    formData.append("SubCategoryIcon", imageState.SubCategoryIcon);
    axios.post("/api/InsertSubCategories", formData).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.status);
        setSubCategoryInsert({
          SubCategoryName: "",
          CategoryID: id,
        });
        reset();
        swal("Success", res.data.message, "success");
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
  };
  // insert End

  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editSubMenu, setEditSubMenu] = useState([]);
  const editHandleInput = (e) => {
    e.persist();
    setEditSubMenu({ ...editSubMenu, [e.target.name]: e.target.value });
  };
  const fetchSubMenus = (e, id) => {
    e.preventDefault();

    axios.get(`/api/EditSubCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditSubMenu(res.data.menu);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  const updateSubMenu = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("SubCategoryIcon", imageState.SubCategoryIcon);
    formData.append("SubCategoryName", editSubMenu.SubCategoryName);
    formData.append("CategoryID", editSubMenu.CategoryID);
    formData.append("id", editSubMenu.id);
    axios.post("/api/UpdateSubCategory", formData).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.status);
        setEditSubMenu("");
        swal("Success", res.data.message, "success");
        setEditModalCentered(false);
        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
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
            setSubCategoryInsert([]);
            swal("Success", res.data.message, "success");
            // thisClicked.closest("tr").remove();
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
  useEffect(() => {
    axios.get(`/api/GetSubCategories/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [subCategoryInsert, editSubMenu, id]);
  var branchID = 0;

  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = fetchData.map((item, i) => {
      branchID = item.branchID;
      return (
        <div className="col-xl-4 col-lg-6 col-sm-6" key={i}>
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="text-center">
                <Link
                  to={{
                    pathname: `/products/${item.sub_id}`,
                    id: item.id,
                    ProductName: item.ProductName,
                  }}
                >
                  <span>
                    <img
                      style={{ height: "100px", objectFit: "contain" }}
                      src={`http://${base_url}:${port}/images/sub_catagories/${item.SubCategoryIcon}`}
                      className="w-40"
                      alt=""
                    />
                  </span>

                  <h4 className="mt-4 mb-1">{item.SubCategoryName}</h4>
                </Link>
              </div>
            </div>

            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                <div className="col-4 pt-3 pb-3 border-right">
                  <Link to="" onClick={(e) => fetchSubMenus(e, item.sub_id)}>
                    <span>{t("edit")}</span>
                  </Link>
                </div>
                <div className="col-4 pt-3 pb-3 border-right">
                  <Link to="" onClick={(e) => deleteSubMenu(e, item.sub_id)}>
                    <span>{t("delete")}</span>
                  </Link>
                </div>
                <div className="col-4 pt-3 pb-3">
                  <Link
                    to={{
                      pathname: `/products/${item.sub_id}`,
                    }}
                  >
                    <span>{t("products")}</span>
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
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <CBreadcrumbItem className="font-weight-bold" href="/branches">
          {t("Branches")}
        </CBreadcrumbItem>
        <CBreadcrumbItem
          className="font-weight-bold"
          href={`/category/${branchID}`}
        >
          {t("categories")}
        </CBreadcrumbItem>
        <CBreadcrumbItem active>{t("sub_category")}</CBreadcrumbItem>
      </CBreadcrumb>
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade" show={modalCentered}>
        <Form
          onSubmit={handleSubmit(saveSubMenu)}
          method="POST"
          encType="multipart/form-data"
        >
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>
                  {t("category_name")}: {props.location.CategoryName}
                </strong>{" "}
              </label>
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("sub_category_icon")}</strong>{" "}
              </label>
              <div className="input-group">
                <div className="custom-file">
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("sub_category_icon")}
                    name="SubCategoryIcon"
                    required
                    onChange={handleImage}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("sub_category_name")}</strong>{" "}
              </label>
              <input
                type="text"
                {...register("SubCategoryName")}
                className="form-control"
                placeholder={t("sub_category_name")}
                name="SubCategoryName"
                onChange={handleInput}
                value={subCategoryInsert.SubCategoryName}
              />
              <div className="text-danger">
                {errors.SubCategoryName?.message}
              </div>
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
              {t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Form onSubmit={updateSubMenu} method="POST">
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("sub_category_icon")}</strong>{" "}
              </label>
              <div className="input-group">
                <div className="custom-file">
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("sub_category_icon")}
                    name="SubCategoryIcon"
                    onChange={handleImage}
                  />
                  <img
                    src={`http://${base_url}:${port}/images/sub_catagories/${editSubMenu.SubCategoryIcon}`}
                    width="70"
                    alt=" "
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("sub_category_name")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("sub_category_name")}
                name="SubCategoryName"
                required
                onChange={editHandleInput}
                value={editSubMenu.SubCategoryName}
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
      </Modal>
      <div className="row">
        {viewProducts_HTMLTABLE}
        <div className="col-xl-4 col-lg-4 col-sm-4 ">
          <div className="card overflow-hidden ">
            <div
              className="card-body d-flex justify-content-center text-center"
              style={{ border: "2px dashed red" }}
            >
              <div className="align-self-center text-center">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setModalCentered(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  {t("add_sub_Category")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SubCategory;
