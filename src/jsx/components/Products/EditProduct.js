import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { base_url, port } from "../../../Consts";
import { useRouteMatch } from "react-router-dom";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";

const EditProduct = (props) => {
  const history = useHistory();

  // validation start

  const validationSchema = () => {
    return Yup.object().shape({
      ProductName: Yup.string().required("Product Name is required"),
      category_id: Yup.string().required("Category is required"),
      price: Yup.number()
        .typeError("Amount must be a number")
        .required("Please provide plan cost.")
        .min(1, "Too little"),
      stock: Yup.number()
        .typeError("Amount must be a number")
        .required("Please provide plan cost.")
        .min(1, "Too little"),
    });
  };
  const initialValuesIngredient = {
    name: "",
  };
  const validationSchemaIngredient = () => {
    return Yup.object().shape({
      name: Yup.string().required("Ingredient Name is required"),
    });
  };
  // validation End
  // for localization
  const { t } = useTranslation();
  const branchId = props.history.location.state.id;
  const productId = props.history.location.state.productId;

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
    axios.post("/api/InsertSingleIngredient", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setModalCentered(false);
        setAlerts(true, "success", res.data.message);
      }
    });
  };
  // insert modal

  // edit Start
  const [editProduct, setEditProduct] = useState([]);

  const updateProduct = (data) => {
    // console.log(JSON.stringify(data, null, 2));

    const formData = new FormData();
    formData.append("image", editProduct.image);
    formData.append("Description", data.Description);
    formData.append("ProductName", data.ProductName);
    formData.append("UnitName", data.UnitName);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("preparationTime", data.preparationTime);
    formData.append("ingredients", JSON.stringify(productIngredient));
    formData.append("extras", JSON.stringify(productExtra));
    formData.append("recommendations", JSON.stringify(productRecom));
    formData.append("sub_category", data.sub_category_id);
    formData.append("category", data.category_id);
    formData.append("id", productId);
    axios.post("/api/UpdateProduct", formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success").then((check) => {
          if (check) {
            history.push({
              pathname: `/branches/show/products`,
              state: { id: branchId },
            });
          }
        });
        setCheck(!check);
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
  };
  const [productRecom, setProductRecom] = useState([]);
  const handleSelectEventRecom = (e) => {
    setProductRecom(e);
  };
  const dataLoad = async () => {
    try {
      const result = await axios.post(`/api/GetIngredient`);
      if (result.data.status === 200) {
        setIntgredients(result.data.fetchData);
      }
      const cat = await axios.get(`/api/GetCategories/${branchId}`);
      if (cat.data.status === 200) {
        setCategories(cat.data.fetchData);
      }

      const response = await axios.get(`/api/GetProducts/${branchId}`);
      if (response.data.status === 200) {
        setFetchData(response.data.fetchData);
      }
      const res = await axios.get(`/api/EditProducts/${productId}`);
      if (res.data.status === 200) {
        setEditProduct(res.data.product);
        setProductIngredient(JSON.parse(res.data.product.ingredients));
        setProductExtra(JSON.parse(res.data.product.extras));
        setProductRecom(JSON.parse(res.data.product.recommendations));
        axios
          .get(`/api/GetSubCategories/${res.data.product.category_id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setSubCategories(res.data.fetchData);
            }
          });
        setLoading(false);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setIntgredients([]);
      setCategories([]);
      setFetchData([]);
      setEditProduct([]);
      setProductIngredient([]);
      setProductExtra([]);
      setProductRecom([]);
      setLoading(true);
    };
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
  const handleImage = (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file[]", e.target.files[i]);
    }
    const images = [];

    axios.post("/api/uploadProductImage", formData).then((res) => {
      if (res.data.status === 200) {
        JSON.parse(editProduct.image).map((item) => {
          images.push(item);
        });
        res.data.filenames.map((item) => {
          images.push(item);
        });

        setEditProduct({
          ...editProduct,
          image: JSON.stringify(images),
        });
      }
    });
  };
  const removeImage = (e, image) => {
    e.preventDefault();
    axios.post(`/api/removeProductImage/${image}`).then((res) => {
      if (res.data.status === 200) {
        setEditProduct({
          ...editProduct,
          image: JSON.stringify(
            JSON.parse(editProduct.image).filter((item) => item !== image)
          ),
        });
      }
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
    viewProducts_HTMLTABLE = (
      <div className="card">
        <div className="card-header">
          <div>
            <h4 className="card-title">{t("edit_product")}</h4>
          </div>
        </div>
        <div className="card-body">
          <Formik
            initialValues={editProduct}
            validationSchema={validationSchema}
            onSubmit={updateProduct}
          >
            {({ errors, status, touched }) => (
              <Form>
                <div className="row">
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label> {t("categories")}</label>
                      <Field
                        as="select"
                        name="category_id"
                        className={
                          "form-control" +
                          (errors.category_id && touched.category_id
                            ? " is-invalid"
                            : "")
                        }
                        onClick={(e) => getSubCategories(e)}
                      >
                        <option key="empty" value="">
                          {t("select_a_option")}
                        </option>
                        {categories.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.CategoryName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category_id"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  {subCategories.length !== 0 ? (
                    <div className={`col-xl-6 col-xxl-6 col-lg-6 col-sm-12`}>
                      <div className="form-group">
                        <label className="mb-1 ">
                          {" "}
                          <strong>{t("sub_categories")}</strong>{" "}
                        </label>
                        <Field
                          as="select"
                          name="sub_category_id"
                          className={"form-control"}
                        >
                          <option key="empty" value="">
                            {t("select_a_option")}
                          </option>
                          {subCategories.map((item) => (
                            <option value={item.sub_id} key={item.sub_id}>
                              {item.SubCategoryName}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                  ) : null}
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        {" "}
                        <strong>{t("unit")}</strong>{" "}
                      </label>
                      <Field
                        name="UnitName"
                        type="text"
                        className={"form-control"}
                        placeholder="KGR, Cm, Number..."
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        {" "}
                        <strong>{t("product_name")}</strong>{" "}
                      </label>
                      <Field
                        name="ProductName"
                        type="text"
                        className={
                          "form-control" +
                          (errors.ProductName && touched.ProductName
                            ? " is-invalid"
                            : "")
                        }
                        placeholder="Name..."
                      />
                      <ErrorMessage
                        name="ProductName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        {" "}
                        <strong>{t("description")}</strong>{" "}
                      </label>
                      <Field
                        as="textarea"
                        name="Description"
                        className={
                          "form-control" +
                          (errors.Description && touched.Description
                            ? " is-invalid"
                            : "")
                        }
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        {" "}
                        <strong>{t("price")}</strong>{" "}
                      </label>
                      <Field
                        name="price"
                        type="number"
                        className={
                          "form-control" +
                          (errors.price && touched.price ? " is-invalid" : "")
                        }
                        placeholder="price..."
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        {" "}
                        <strong>{t("stock")}</strong>{" "}
                      </label>
                      <Field
                        name="stock"
                        type="number"
                        className={
                          "form-control" +
                          (errors.stock && touched.stock ? " is-invalid" : "")
                        }
                        placeholder="stock..."
                      />
                      <ErrorMessage
                        name="stock"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label className="mb-1 ">
                        <strong>{t("preparation_Time")}(Minutes)</strong>
                      </label>
                      <Field
                        name="preparationTime"
                        type="number"
                        className={"form-control"}
                        placeholder="preparation Time..."
                      />
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
                            multiple
                            data-overwrite-initial="false"
                            data-min-file-count="1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {JSON.parse(editProduct.image)?.map((photo) => {
                    return (
                      <div className="col-xl-2 col-lg-2 col-sm-2" key={photo}>
                        <div className="card ">
                          <div className="text-center">
                            <img
                              className="w-100"
                              src={`http://${base_url}:${port}/images/products/${photo}`}
                              alt=""
                              key={photo}
                              style={{
                                // width: "100px",
                                height: "100px",
                                objectFit: "contain",
                              }}
                            />
                          </div>

                          <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={(e) => removeImage(e, photo)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                    <div className="form-group">

                      <div className="d-flex justify-content-between">
                        <label className="mb-1 ">
                          <strong>{t("ingredients")}</strong>
                        </label>
                    {checkPermission('ingredients-create')&&(

                        <small
                          onClick={() => setModalCentered(true)}
                          style={{ cursor: "pointer" }}
                        >
                          {t("add_ingredient")}
                        </small>
                    )}

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
                          return {
                            id: i,
                            value: o.id,
                            label: o.name,
                            price: 0,
                          };
                        })}
                        onChange={handleSelectEventExtra}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                  {productExtra?.map((item, i) => {
                    return (
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3"
                        key={i}
                      >
                        <div className="form-group">
                          <label className="mb-1 ">
                            <strong>{item.label}</strong>
                            <small>(Charge)</small>
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
                        <strong>{t("recommendation_products")}</strong>
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

                <div className="card-footer text-right">
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
            )}
          </Formik>
        </div>
      </div>
    );
  }

  return (
    <>
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
          <Formik
            initialValues={initialValuesIngredient}
            validationSchema={validationSchemaIngredient}
            onSubmit={save}
          >
            {({ errors, status, touched }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label> {t("name")}</label>
                    <Field
                      name="name"
                      type="text"
                      className={
                        "form-control" +
                        (errors.name && touched.name ? " is-invalid" : "")
                      }
                      placeholder="Name...."
                    />
                    <ErrorMessage
                      name="name"
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
      </Fragment>
    </>
  );
};

export default EditProduct;
