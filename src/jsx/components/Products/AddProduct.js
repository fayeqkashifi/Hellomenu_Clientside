import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { useHistory } from "react-router-dom";

const AddProduct = (props) => {
  const history = useHistory();

  // for localization
  const { t } = useTranslation();
  const branchId = props.history.location.state.id;
  // validation start
  const schema = yup
    .object()
    .shape({
      ProductName: yup.string().required("This field is a required field"),
      // UnitName: yup.string().required("This field is a required field"),
      category: yup.string().required("This field is a required field"),
      price: yup.number().required("This field is a required field"),
      stock: yup.number().required("This field is a required field"),
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

  // validation End
  const [modalCentered, setModalCentered] = useState(false);

  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, photo: e.target.files[0] });
  };
  const [productInsert, setProductInsert] = useState([]);
  const handleInput = (e) => {
    e.persist();
    setProductInsert({ ...productInsert, [e.target.name]: e.target.value });
  };
  const saveProduct = (e) => {
    const formData = new FormData();
    formData.append("image", imageState.photo);
    formData.append("Description", productInsert.Description);
    formData.append("ProductName", productInsert.ProductName);
    formData.append("sub_category", productInsert.sub_category);
    formData.append("category", productInsert.category);
    formData.append("price", productInsert.price);
    formData.append("stock", productInsert.stock);
    formData.append("preparationTime", productInsert.preparationTime);
    formData.append("ingredients", JSON.stringify(productIngredient));
    formData.append("extras", JSON.stringify(productExtra));
    formData.append("recommendations", JSON.stringify(productRecom));
    formData.append("UnitName", productInsert.UnitName);
    axios.post(`/api/InsertProducts`, formData).then((res) => {
      if (res.data.status === 200) {
        reset();
        swal("Success", res.data.message, "success");
        history.goBack();

        //  this.props.history.push("/")
      }
    });
  };
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
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [intgredients, setIntgredients] = useState([]);
  const [check, setCheck] = useState(true);

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
      setLoading(false);
    });
  }, [check]);
  const [productIngredient, setProductIngredient] = useState([]);
  const handleSelectEvent = (e) => {
    setProductIngredient(e);
  };
  const [productExtra, setProductExtra] = useState([]);
  const handleSelectEventExtra = (e) => {
    setProductExtra(e);
  };
  // const [extraPrices, setextraPrices] = useState({});

  const extraHandle = (e, id) => {
    let updatedList = productExtra.map((item) => {
      if (item.id == id) {
        return { ...item, price: e.target.value }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });
    setProductExtra(updatedList);
  };
  const [productRecom, setProductRecom] = useState([]);
  const handleSelectEventRecom = (e) => {
    setProductRecom(e);
  };
  const getSubCategories = (e) => {
    e.preventDefault();
    axios.get(`/api/GetSubCategories/${e.target.value}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
      }
    });
    setProductInsert({ ...productInsert, [e.target.name]: e.target.value });
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
            <h4 className="card-title">{t("add_product")}</h4>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit(saveProduct)} method="POST">
            <div className="row">
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    <strong>{t("categories")}</strong>
                  </label>
                  <select
                    type="text"
                    {...register("category")}
                    className={
                      errors.category?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("category")}
                    name="category"
                    // onChange={handleInput}
                    value={productInsert.category}
                    onChange={(e) => [getSubCategories(e)]}
                  >
                    <option value="null">{t("select_a_option")}</option>
                    {categories.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.CategoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category?.message && (
                    <div className="invalid-feedback">
                      {errors.category?.message}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12 disable"
                disabled=""
              >
                <div className="form-group">
                  <label className="mb-1 ">
                    <strong>{t("sub_categories")}</strong>
                  </label>
                  <select
                    disabled={subCategories.length === 0 ? "disabled" : ""}
                    type="text"
                    {...register("sub_category")}
                    className={
                      errors.sub_category?.message
                        ? "form-control  is-invalid"
                        : "form-control"
                    }
                    placeholder={t("sub_category")}
                    name="sub_category"
                    onChange={handleInput}
                    value={productInsert.sub_category}
                  >
                    <option value="">{t("select_a_option")}</option>
                    {subCategories.map((item) => (
                      <option value={item.sub_id} key={item.sub_id}>
                        {item.SubCategoryName}
                      </option>
                    ))}
                  </select>
                  {errors.sub_category?.message && (
                    <div className="invalid-feedback">
                      {errors.sub_category?.message}
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
                    placeholder={t("Number, KGR...")}
                    name="UnitName"
                    onChange={handleInput}
                    value={productInsert.UnitName}
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
                    onChange={handleInput}
                    value={productInsert.ProductName}
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
                    onChange={handleInput}
                    value={productInsert.Description}
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
                    onChange={handleInput}
                    value={productInsert.price}
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
                    onChange={handleInput}
                    value={productInsert.stock}
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
                    placeholder="30"
                    onChange={handleInput}
                    value={productInsert.preparationTime}
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
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("image")}
                    name="photo"
                    required
                    onChange={handleImage}
                  />
                  {/* </div> */}
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
                        min="0"
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
                    <strong>{t("recommendation_products")}</strong>
                  </label>
                  <Select
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
                {t("save")}{" "}
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

export default AddProduct;
