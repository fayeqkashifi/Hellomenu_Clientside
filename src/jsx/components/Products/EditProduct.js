import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import ReactPlayer from "react-player/lazy";
import Swal from "sweetalert2";
import { Option, MultiValue, animatedComponents } from "../Common/SelectOption";
import MySelect from "../Common/MySelect";
import SubmitButtons from "../Common/SubmitButtons";
import MButton from "@mui/material/Button";
import Local from "./Local";
import AddIngredient from "./Ingredients/Add";
import UploadImage from "../Common/UploadImage";

const EditProduct = (props) => {
  const history = useHistory();
  const validationSchema = () => {
    return Yup.object().shape({
      ProductName: Yup.string().required("Product Name is required"),
      category_id: Yup.string().required("Category is required"),
      price: Yup.number()
        .typeError("Amount must be a number")
        .required("Please provide plan cost.")
        .min(1, "Too little"),
    });
  };

  const branchId = props.history.location.state.id;
  const productId = props.history.location.state.productId;
  const [lang, setLang] = useState([]);

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

  // edit Start
  const [editProduct, setEditProduct] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = React.useState([]);
  const [imageValidation, setImageValidation] = useState();

  const updateProduct = (data) => {
    if (images.length != 0) {
      setIsSubmitting(true);
      const formData = new FormData();
      if (editProduct.video !== null) {
        formData.append("video", editProduct.video);
      } else {
        formData.append("video", null);
      }
      if (images.length !== 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("image[]", images[i].file);
        }
      } else {
        formData.append("image", "");
      }
      // formData.append("image", editProduct.image);
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
      formData.append("form", JSON.stringify(form));
      formData.append("translation", JSON.stringify(lang));
      axios
        .post("/api/updateProduct", formData)
        .then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              title: "Good job!",
              html: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#93de8b",
            }).then((check) => {
              if (check) {
                setIsSubmitting(false);
                history.push({
                  pathname: `/branches/show/products`,
                  state: { id: branchId },
                });
                setCheck(!check);
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setImageValidation("This Field is Required.");
    }
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
      if (item.value == id) {
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
      const cat = await axios.get(`/api/getCategoriesAll/${branchId}`);
      if (cat.data.status === 200) {
        setCategories(cat.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const response = await axios.get(`/api/getProductsAll/${branchId}`);
      if (response.data.status === 200) {
        setFetchData(response.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const res = await axios.get(`/api/editProducts/${productId}`);
      if (res.data.status === 200) {
        const data = res.data;
        setEditProduct(data.product);
        // console.log(data.ingredients);
        setProductIngredient(data.ingredients);
        setProductExtra(data.extras);
        setProductRecom(data.recommend);
        const value = [];
        JSON.parse(data.product.videosUrl).map((item) => {
          value.push({
            name: item,
            errors: {
              name: null,
            },
          });
        });
        setForm(value);
        axios
          .get(`/api/getSubCategoriesAll/${res.data.product.category_id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setSubCategories(res.data.fetchData);
            }
          });
        setLoading(false);
      } else if (res.data.status === 404) {
        throw Error(res.data.message);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
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
  }, []);
  const loadIngredients = async () => {
    try {
      const result = await axios.get(`/api/getIngredientAll`);
      if (result.data.status === 200) {
        setIntgredients(result.data.fetchData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadIngredients();
    return () => {
      setIntgredients([]);
    };
  }, [check]);
  const getSubCategories = (e) => {
    e.preventDefault();
    axios
      .get(
        `/api/getSubCategoriesAll/${
          e.target.value == "" ? null : e.target.value
        }`
      )
      .then((res) => {
        if (res.data.status === 200) {
          setSubCategories(res.data.fetchData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const removeVideo = (e, video) => {
    e.preventDefault();
    axios
      .post(`/api/removeProductVideo/${video}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditProduct({
            ...editProduct,
            video: JSON.stringify(
              JSON.parse(editProduct.video).filter((item) => item !== video)
            ),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [videoValidation, setVideoValidation] = useState();

  const handleVideo = (e) => {
    setVideoValidation();
    const data = e.target.files;
    let valid = "";
    for (let i = 0; i < data.length; i++) {
      if (!data[i].name.match(/\.(mp4|wmv|mov|flv|avi|mkv)$/)) {
        valid = "Unsupported File Format.";
      } else if (data[i].size >= 10000000) {
        valid = "File Size is too large(Max Size 10MB).";
      }
    }
    if (valid == "") {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file[]", e.target.files[i]);
      }
      const videos =
        editProduct.video == null ? [] : JSON.parse(editProduct.video);
      axios
        .post("/api/uploadProductVideo", formData)
        .then((res) => {
          if (res.data.status === 200) {
            // JSON.parse(editProduct.video)?.map((item) => {
            //   videos.push(item);
            // });
            res.data.filenames.map((item) => {
              videos.push(item);
            });

            setEditProduct({
              ...editProduct,
              video: JSON.stringify(videos),
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setVideoValidation(valid);
    }
  };

  const [form, setForm] = useState([]);

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.name === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];
        if (form[index].name === "") {
          allPrev[index].errors.name = "URL is required";
        }
        return setForm(allPrev);
      });
    }

    return !someEmpty;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const inputState = {
      name: "",
      errors: {
        name: null,
      },
    };

    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();
    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        return {
          ...item,
          [event.target.name]: event.target.value,

          errors: {
            ...item.errors,
            [event.target.name]:
              event.target.value.length > 0
                ? null
                : [event.target.name] + " Is required",
          },
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();

    setForm((prev) => prev.filter((item) => item !== prev[index]));
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
        initialValues={editProduct}
        validationSchema={validationSchema}
        onSubmit={updateProduct}
      >
        {({ errors, values, touched, setFieldValue }) => (
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
                        <div
                          className={`col-xl-6 col-xxl-6 col-lg-6 col-sm-12`}
                        >
                          <div className="form-group">
                            <label className="mb-1 ">
                              {" "}
                              <strong>{t("sub_categories")}</strong>{" "}
                            </label>
                            <Field
                              as="select"
                              name="sub_category_id"
                              className={"form-control"}
                              // value={
                              //   editProduct.sub_category_id
                              //     ? editProduct.sub_category_id
                              //     : ""
                              // }
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
                            <strong>{t("price")}</strong>{" "}
                          </label>
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
                          <label className="mb-1 ">
                            {" "}
                            <strong>{t("stock")}</strong>{" "}
                          </label>
                          <Field
                            name="stock"
                            type="number"
                            className={"form-control"}
                            placeholder="stock..."
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      {t("languages_localisation")}
                    </h3>
                  </div>
                  <div className="card-body">
                    <Local
                      changeBit={false}
                      url={`/api/productTranslation/${values.id}`}
                      inputData={values.ProductName}
                      UnitName={values.UnitName}
                      lang={lang}
                      setLang={setLang}
                    />
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
                        <UploadImage
                          images={images}
                          setImages={setImages}
                          values={JSON.parse(editProduct?.image)}
                          urlPath={`/images/products/`}
                          setImageValidation={setImageValidation}
                        />
                        <div className="text-danger">
                          <small> {imageValidation}</small>
                        </div>
                        {/* <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          placeholder={t("image")}
                          name="photo"
                          onChange={handleImage}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        /> */}
                      </div>
                    </div>

                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("video")}
                        <small style={{ fontSize: "10px" }}>
                          {"(Max Size 10MB)"}
                        </small>
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <input
                          type="file"
                          accept="video/*"
                          className={
                            "form-control" +
                            (videoValidation ? " is-invalid" : "")
                          }
                          name="video"
                          onChange={handleVideo}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                        <div className="text-danger">
                          <small> {videoValidation}</small>
                        </div>
                      </div>
                      <div className="row form-group my-2">
                        {JSON.parse(editProduct.video)?.map((video) => {
                          return (
                            <div
                              className="col-xl-2 col-lg-2 col-sm-2"
                              key={video}
                            >
                              <div className="card ">
                                <div className="text-center">
                                  <ReactPlayer
                                    width="inherit"
                                    height="150px"
                                    url={`http://${base_url}:${port}/videos/products/${video}`}
                                    controls={true}
                                    playing={false}
                                  />
                                </div>

                                <div className="card-footer pt-0 pb-0 text-center">
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={(e) => removeVideo(e, video)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("video_url")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        {form.map((item, index) => (
                          <div className="row my-1" key={`item-${index}`}>
                            <div className="col-10">
                              <input
                                type="text"
                                className={
                                  item.errors.name
                                    ? "form-control  is-invalid"
                                    : "form-control"
                                }
                                name="name"
                                placeholder="URL..."
                                value={item.name}
                                onChange={(e) => onChange(index, e)}
                              />

                              {item.errors.name && (
                                <div className="invalid-feedback">
                                  {item.errors.name}
                                </div>
                              )}
                            </div>

                            <div className="col-2">
                              <IconButton
                                onClick={(e) => handleRemoveField(e, index)}
                              >
                                <DeleteIcon
                                  fontSize="small"
                                  sx={{ color: "red" }}
                                />
                              </IconButton>
                            </div>
                          </div>
                        ))}

                        <MButton
                          variant="outlined"
                          size="medium"
                          onClick={handleAddLink}
                        >
                          {t("add_more")}
                        </MButton>
                      </div>
                      {/* <div className="row form-group my-2">
                        {form?.map((item, i) => {
                          return (
                            <div className="col-xl-2 col-lg-2 col-sm-2" key={i}>
                              <div className="card ">
                                <div className="text-center">
                                  <ReactPlayer
                                    width="150px"
                                    height="200px"
                                    url={item.name}
                                    controls={true}
                                    playing={false}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div> */}
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
                        <MySelect
                          options={intgredients?.map((o, i) => {
                            return { value: o.id, label: o.name };
                          })}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option,
                            MultiValue,
                            animatedComponents,
                          }}
                          onChange={handleSelectEvent}
                          allowSelectAll={true}
                          value={productIngredient}
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
                        <MySelect
                          options={intgredients?.map((o, i) => {
                            return {
                              value: o.id,
                              label: o.name,
                              price: 0,
                            };
                          })}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option,
                            MultiValue,
                            animatedComponents,
                          }}
                          onChange={handleSelectEventExtra}
                          allowSelectAll={true}
                          value={productExtra}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                      <div className="row">
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
                                  onChange={(e) => extraHandle(e, item.value)}
                                  value={productExtra[i].price}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label className="mb-1 ">
                          <strong>{t("recommendation_products")}</strong>
                        </label>
                        <MySelect
                          options={fetchData?.map((o, i) => {
                            return {
                              value: o.id,
                              label: o.ProductName,
                            };
                          })}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option,
                            MultiValue,
                            animatedComponents,
                          }}
                          onChange={handleSelectEventRecom}
                          allowSelectAll={true}
                          value={productRecom}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer text-right">
              <SubmitButtons
                isSubmitting={isSubmitting}
                left={t("back")}
                right={t("update")}
              />
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
        <div
          className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mb-2"
          style={{ backgroundColor: "#f5f5f5", padding: "5px", color: "#000" }}
        >
          <div className="d-flex justify-content-between">
            <div
              className="d-flex align-items-center justify-content-center "
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {t("edit_product")}
            </div>
            <div
              className="d-flex align-items-center justify-content-center "
              onClick={() => history.goBack()}
              style={{ cursor: "pointer" }}
            >
              List of Products
            </div>
          </div>
        </div>
        {viewProducts_HTMLTABLE}
        <AddIngredient
          setAlerts={setAlerts}
          setCheck={setCheck}
          check={check}
          modalCentered={modalCentered}
          setModalCentered={setModalCentered}
          setProductIngredient={setProductIngredient}
          productIngredient={productIngredient}
        />
      </Fragment>
    </>
  );
};

export default EditProduct;
