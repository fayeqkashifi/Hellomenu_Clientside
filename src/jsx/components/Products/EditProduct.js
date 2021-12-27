import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { base_url, port } from "../../../Consts";
import { useRouteMatch } from "react-router-dom";
import Select from "react-select";
import { useHistory } from "react-router-dom";

const EditProduct = (props) => {
  const history = useHistory();

  const { path, url } = useRouteMatch();
  // validation start
  const schema = yup
    .object()
    .shape({
      // Description: yup.string().required("This field is a required field"),
      ProductName: yup.string().required("This field is a required field"),
      // UnitID: yup.string().required("This field is a required field"),
      category_id: yup.string().required("This field is a required field"),
      price: yup.number().required("This field is a required field"),
      stock: yup.number().required("This field is a required field"),
      // preparationTime: yup.number().required("This field is a required field"),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // validation End
  // for localization
  const { t } = useTranslation();
  const branchId = props.history.location.state.id;
  const productId = props.history.location.state.productId;

  const [modalCentered, setModalCentered] = useState(false);
  const [insert, setInsert] = useState({
    name: "",
  });
  const handleInputIngredients = (e) => {
    e.persist();
    setInsert({ ...insert, [e.target.name]: e.target.value });
  };
  const save = (e) => {
    e.preventDefault();
    axios.post("/api/InsertIngredient", insert).then((res) => {
      if (res.data.status === 200) {
        setInsert({
          name: "",
        });
        setCheck(!check);
        setModalCentered(false);
        swal("Success", res.data.message, "success");
      }
    });
  };
  // insert modal
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, photo: e.target.files[0] });
  };
  // edit Start
  const [editProduct, setEditProduct] = useState([]);
  const editHandleInput = (e) => {
    e.persist();
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };
  const updateProduct = (e) => {
    const formData = new FormData();
    formData.append("image", imageState.photo);
    formData.append("Description", editProduct.Description);
    formData.append("ProductName", editProduct.ProductName);
    formData.append("UnitName", editProduct.UnitName);
    formData.append("price", editProduct.price);
    formData.append("stock", editProduct.stock);
    formData.append("preparationTime", editProduct.preparationTime);
    formData.append("ingredients", JSON.stringify(productIngredient));
    formData.append("extras", JSON.stringify(productExtra));
    formData.append("recommendations", JSON.stringify(productRecom));
    formData.append("sub_category", editProduct.sub_category_id);
    formData.append("category", editProduct.category_id);
    formData.append("id", editProduct.id);
    axios.post("/api/UpdateProduct", formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        setCheck(!check);
        history.goBack();
      }
    });
  };
  // edit ENd
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [intgredients, setIntgredients] = useState([]);
  const [productIngredient, setProductIngredient] = useState([]);
  const [check, setCheck] = useState(true);

  const handleSelectEvent = (e) => {
    setProductIngredient(e);
  };
  const [productExtra, setProductExtra] = useState([]);
  const handleSelectEventExtra = (e) => {
    setProductExtra(e);
  };
  const extraHandle = (e, id) => {
    let updatedList = productExtra.map((item) => {
      if (item.id == id) {
        return { ...item, price: e.target.value }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });
    setProductExtra(updatedList);
    console.log(productExtra);
  };
  const [productRecom, setProductRecom] = useState([]);
  const handleSelectEventRecom = (e) => {
    setProductRecom(e);
  };
  useEffect(() => {
    axios.post(`/api/GetIngredient`).then((res) => {
      if (res.data.status === 200) {
        setIntgredients(res.data.fetchData);
      }
    });
    axios.get(`/api/GetCategories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCategories(res.data.fetchData);
      }
    });

    axios.get(`/api/GetProducts/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
    });
    axios.get(`/api/EditProducts/${productId}`).then((res) => {
      if (res.data.status === 200) {
        setEditProduct(res.data.product);
        setProductIngredient(JSON.parse(res.data.product.ingredients));
        setProductExtra(JSON.parse(res.data.product.extras));
        setProductRecom(JSON.parse(res.data.product.recommendations));
        console.log(res.data.product);
        axios
          .get(`/api/GetSubCategories/${res.data.product.category_id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setSubCategories(res.data.fetchData);
              // console.log(res.data.fetchData);
            }
          });
        setLoading(false);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  }, [check]);
  const getSubCategories = (e) => {
    e.preventDefault();
    axios
      .get(
        `/api/GetSubCategories/${e.target.value == "" ? null : e.target.value}`
      )
      .then((res) => {
        if (res.data.status === 200) {
          setSubCategories(res.data.fetchData);
        }
      });
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };
  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = (
      <div className="card">
        <div className="card-header">
          <div>
            <h4 className="card-title">{t("edit_product")}</h4>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit(updateProduct)} method="POST">
            <div className="row">
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("categories")}</strong>{" "}
                  </label>
                  <select
                    type="text"
                    {...register("category_id")}
                    className={
                      errors.category_id?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("category_id")}
                    name="category_id"
                    onChange={(e) => [getSubCategories(e)]}
                    value={editProduct.category_id}
                  >
                    <option value="">{t("select_a_option")}</option> )
                    {categories.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.CategoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category_id?.message && (
                    <div className="invalid-feedback">
                      {errors.category_id?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("sub_categories")}</strong>{" "}
                  </label>
                  <select
                    type="text"
                    disabled={subCategories.length === 0 ? "disabled" : ""}
                    {...register("sub_category_id")}
                    className={
                      errors.sub_category_id?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("sub_category")}
                    name="sub_category_id"
                    onChange={editHandleInput}
                    value={editProduct.sub_category_id}
                  >
                    <option value="">{t("select_a_option")}</option> )
                    {subCategories.map((item) => (
                      <option value={item.sub_id} key={item.sub_id}>
                        {item.SubCategoryName}
                      </option>
                    ))}
                  </select>
                  {errors.sub_category_id?.message && (
                    <div className="invalid-feedback">
                      {errors.sub_category_id?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("unit")}</strong>{" "}
                  </label>
                  <input
                    type="text"
                    {...register("UnitName")}
                    className={
                      errors.UnitName?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("UnitName")}
                    name="UnitName"
                    onChange={editHandleInput}
                    value={editProduct.UnitName}
                  />
                  {errors.UnitName?.message && (
                    <div className="invalid-feedback">
                      {errors.UnitName?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("product_name")}</strong>{" "}
                  </label>
                  <input
                    type="text"
                    {...register("ProductName")}
                    className={
                      errors.ProductName?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("product_name")}
                    name="ProductName"
                    required
                    onChange={editHandleInput}
                    value={editProduct.ProductName}
                  />
                  {errors.ProductName?.message && (
                    <div className="invalid-feedback">
                      {errors.ProductName?.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("description")}</strong>{" "}
                  </label>
                  <textarea
                    type="text"
                    {...register("Description")}
                    className={
                      errors.Description?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("description")}
                    name="Description"
                    onChange={editHandleInput}
                    value={editProduct.Description}
                  />
                  {errors.Description?.message && (
                    <div className="invalid-feedback">
                      {errors.Description?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("price")}</strong>{" "}
                  </label>
                  <input
                    type="text"
                    {...register("price")}
                    className={
                      errors.price?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("price")}
                    name="price"
                    required
                    onChange={editHandleInput}
                    value={editProduct.price}
                  />
                  {errors.price?.message && (
                    <div className="invalid-feedback">
                      {errors.price?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("stock")}</strong>{" "}
                  </label>
                  <input
                    type="text"
                    {...register("stock")}
                    className={
                      errors.stock?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("stock")}
                    name="stock"
                    required
                    onChange={editHandleInput}
                    value={editProduct.stock}
                  />
                  {errors.stock?.message && (
                    <div className="invalid-feedback">
                      {errors.stock?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    <strong>{t("preparation_Time")}(Minutes)</strong>
                  </label>
                  <input
                    type="number"
                    {...register("preparationTime")}
                    className={
                      errors.preparationTime?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    name="preparationTime"
                    placeholder="30 Minutes"
                    onChange={editHandleInput}
                    value={editProduct.preparationTime}
                  />
                  {errors.preparationTime?.message && (
                    <div className="invalid-feedback">
                      {errors.preparationTime?.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("image")}</strong>{" "}
                  </label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="form-control"
                        placeholder={t("image")}
                        name="photo"
                        onChange={handleImage}
                      />
                      <img
                        src={`http://${base_url}:${port}/images/products/${editProduct.image}`}
                        width="70"
                        alt=" "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="form-group">
                  <div className="d-flex justify-content-between">
                    <label className="mb-1 ">
                      <strong>{t("ingredients")}</strong>
                    </label>
                    <small
                      onClick={() => setModalCentered(true)}
                      style={{ cursor: "pointer" }}
                    >
                      {t("add_ingredient")}
                    </small>
                  </div>
                  <Select
                    defaultValue={productIngredient}
                    isMulti
                    options={intgredients?.map((o, i) => {
                      return { id: i, value: o.id, label: o.name };
                    })}
                    onChange={handleSelectEvent}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    <strong>{t("extras")}</strong>
                    <small>
                      (Please first choose the fields and then set the input
                      values.)
                    </small>
                  </label>
                  <Select
                    defaultValue={productExtra}
                    isMulti
                    options={intgredients?.map((o, i) => {
                      return { id: i, value: o.id, label: o.name, price: 0 };
                    })}
                    onChange={handleSelectEventExtra}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              {productExtra?.map((item, i) => {
                return (
                  <div className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3" key={i}>
                    <div className="form-group">
                      <label className="mb-1 ">
                        <strong>{item.label}</strong>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => extraHandle(e, item.id)}
                        value={productExtra[i].price}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    <strong>{t("recommendation_roducts")}</strong>
                  </label>
                  <Select
                    defaultValue={productRecom}
                    isMulti
                    options={fetchData?.map((o, i) => {
                      return {
                        price: o.price,
                        value: o.id,
                        label: o.ProductName,
                        qty: 1,
                      };
                    })}
                    onChange={handleSelectEventRecom}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>

            <div className="card-footer">
              <Button
                variant="danger light"
                className="m-1"
                onClick={() => history.goBack()}
              >
                {t("back")}
              </Button>
              <Button variant="primary" type="submit">
                {t("update")}{" "}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <>
      <Fragment>
        <div className="m-1">
          <Button
            variant="danger light"
            className="m-1"
            onClick={() => history.goBack()}
          >
            List of Products
          </Button>
        </div>
        {viewProducts_HTMLTABLE}
        <Modal className="fade" show={modalCentered}>
          <Form onSubmit={save} method="POST" encType="multipart/form-data">
            <Modal.Header>
              <Modal.Title>{t("add_ingredient")}</Modal.Title>
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
                  <strong>{t("name")} </strong>{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("name")}
                  name="name"
                  onChange={handleInputIngredients}
                  value={insert.name}
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
                {t("save")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Fragment>
    </>
  );
};

export default EditProduct;
