import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Switch from "@mui/material/Switch";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";

const AddProduct = (props) => {
  const history = useHistory();
  // for localization
  const branchId = props.history.location.state.id;
  // validation start
  const initialValues = {
    ProductName: "",
    category: "",
    sub_category: "",
    price: "",
    stock: "",
    preparationTime: "",
    UnitName: "",
    Description: "",
    videos: [],
  };

  const validationSchema = () => {
    return Yup.object().shape({
      ProductName: Yup.string().required("Product Name is required"),
      category: Yup.string().required("Category is required"),
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
  const saveProduct = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    const formData = new FormData();
    for (let i = 0; i < data.photo.length; i++) {
      formData.append("image[]", data.photo[i]);
    }
    productbranches.map((item) => {
      formData.append("branches[]", item.value);
    });
    for (let i = 0; i < data.videos.length; i++) {
      formData.append("videos[]", data.videos[i]);
    }
    formData.append("Description", data.Description);
    formData.append("ProductName", data.ProductName);
    formData.append("sub_category", data.sub_category);

    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("preparationTime", data.preparationTime);
    formData.append("ingredients", JSON.stringify(productIngredient));
    formData.append("extras", JSON.stringify(productExtra));
    formData.append("recommendations", JSON.stringify(productRecom));
    formData.append("UnitName", data.UnitName);
    formData.append("branchId", branchId);
    axios.post(`/api/InsertProducts`, formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success").then((check) => {
          if (check) {
            history.push({
              pathname: `/branches/show/products`,
              state: { id: branchId },
            });
          }
        });
      }
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
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [intgredients, setIntgredients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [check, setCheck] = useState(true);
  const [share, setShare] = useState(false);
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
      const res = await axios.get(`/api/GetBranches`);
      if (res.data.status === 200) {
        setBranches(
          res.data.branches.filter((item) => {
            return item.id != branchId;
          })
        );
      }
      setLoading(false);
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
      setBranches([]);
      setLoading(true);
    };
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
  const [productbranches, setProductBranches] = useState([]);
  const handleSelectBranches = (e) => {
    setProductBranches(e);
    // console.log(e);
    let arrayID = [];
    e?.map((item) => {
      arrayID.push(item.value);
    });
    axios
      .get(`/api/getSharedCategories`, {
        params: {
          id: arrayID,
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setCategories(res.data);
        }
      });
  };
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
  };
  const filterCategories = (e) => {
    e.preventDefault();
    if (!e.target.checked) {
      setProductBranches([]);
      axios.get(`/api/GetCategories/${branchId}`).then((res) => {
        if (res.data.status === 200) {
          setCategories(res.data.fetchData);
        }
      });
    }
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveProduct}
      >
        {({ errors, status, touched, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("product_information")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            {" "}
                            {t("share_product_with_other_branches")}
                          </label>
                          <Switch
                            checked={share}
                            color="secondary"
                            onChange={(e) => [
                              setShare(!share),
                              filterCategories(e),
                            ]}
                          />
                        </div>
                      </div>
                      {share ? (
                        <>
                          <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
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
                                onChange={handleSelectBranches}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        " "
                      )}

                      <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                        <div className="form-group">
                          <label> {t("categories")}</label>
                          <Field
                            as="select"
                            name="category"
                            className={
                              "form-control" +
                              (errors.category && touched.category
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
                            name="category"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>
                      {subCategories.length !== 0 ? (
                        <div
                          className={`col-xl-6 col-xxl-6 col-lg-6 col-sm-12 `}
                        >
                          <div className="form-group">
                            <label> {t("sub_categories")}</label>
                            <Field
                              as="select"
                              name="sub_category"
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
                          <label> {t("unit")}</label>
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
                          <label> {t("product_name")}</label>
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
                          <label> {t("description")}</label>
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
                          <label> {t("price")}</label>
                          <Field
                            name="price"
                            type="number"
                            className={
                              "form-control" +
                              (errors.price && touched.price
                                ? " is-invalid"
                                : "")
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
                          <label> {t("stock")}</label>
                          <Field
                            name="stock"
                            type="number"
                            className={
                              "form-control" +
                              (errors.stock && touched.stock
                                ? " is-invalid"
                                : "")
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
                          <label>{t("preparation_Time")}(Minutes)</label>
                          <Field
                            name="preparationTime"
                            type="number"
                            className={"form-control"}
                            placeholder="preparation Time..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      {t("product_image_and_video")}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("images")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="photo"
                          required
                          onChange={(event) => {
                            setFieldValue("photo", event.target.files);
                          }}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("video")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <input
                          type="file"
                          accept="video/*"
                          className="form-control"
                          name="videos"
                          onChange={(event) => {
                            setFieldValue("videos", event.target.files);
                          }}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">{t("product_details")}</h4>
                  </div>
                  <div className="card-body">
                    <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                      <div className="form-group">
                        <div className="d-flex justify-content-between">
                          <label className="mb-1 ">
                            <strong>{t("ingredients")}</strong>
                          </label>
                          {checkPermission("ingredients-create") && (
                            <small
                              onClick={() => setModalCentered(true)}
                              style={{ cursor: "pointer" }}
                            >
                              {t("add_ingredient")}
                            </small>
                          )}
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
                            (Please first choose the fields and then set the
                            input values.)
                          </small>
                        </label>

                        <Select
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
                  {t("save")}{" "}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
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
        <div className="d-flex justify-content-between m-1">
          <h4>{t("add_product")}</h4>
          <h6 onClick={() => history.goBack()} style={{ cursor: "pointer" }}>
            List of Products
          </h6>
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

export default AddProduct;
