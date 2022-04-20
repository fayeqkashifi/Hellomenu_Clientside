import React, { Fragment, useState, useEffect } from "react";
import Button from "@mui/material/Button";

import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "yup-phone";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { base_url, port } from "../../../Consts";
import { localization as t } from "../Localization";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Tooltip from "@mui/material/Tooltip";
import ReactPlayer from "react-player/lazy";
// import ipapi from "ipapi.co";
import SubmitButtons from "../Common/SubmitButtons";
import Swal from "sweetalert2";
import Languages from "./Languages";

const EditBranch = (props) => {
  const id = props.history.location.state.id;

  const validationSchema = () => {
    return Yup.object().shape({
      BrancheName: Yup.string().required("Branch Name is required"),
      currencyID: Yup.string().required("Currency is required"),
      phoneNumber: Yup.string().required("Phone Number is required"),
    });
  };
  // insert start
  const history = useHistory();
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

  const [editBranchstate, setEditBranchstate] = useState([]);
  const [orderMethodsEdit, setOrderMethodsEdit] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLang, setSelectedLang] = useState([
    {
      value: 40,
      label: "English",
      default: 1,
      status: 1,
      translated_branch_name: "",
    },
  ]);
  const updateBranch = (data) => {
    if (selectedLang.length !== 0) {
      setIsSubmitting(true);
      const ArrayValue = [];
      for (const [key, value] of Object.entries(orderMethodsEdit)) {
        ArrayValue.push(value);
      }
      if (ArrayValue.includes(1)) {
        const formData = new FormData();
        formData.append("orderMethods", JSON.stringify(orderMethodsEdit));
        formData.append("BrancheName", data.BrancheName);
        formData.append("currencyID", data.currencyID);
        formData.append("branchImages", editBranchstate.branchImages);
        formData.append("branchVideos", editBranchstate.branchVideos);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("otherAddressFields", JSON.stringify(form));
        formData.append("fullAddress", fullAddress);
        formData.append("languages", JSON.stringify(selectedLang));
        formData.append("id", data.id);
        axios
          .post("/api/updateBranches", formData)
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
                  history.push(`/branches`);
                  setIsSubmitting(false);
                }
              });
              setIsSubmitting(false);
            } else if (res.data.status === 304) {
              setAlerts(true, "warning", res.data.message);
            } else {
              setAlerts(true, "error", res.data.message);
              throw Error("Due to an error, the data cannot be retrieved.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setAlerts(
          true,
          "warning",
          "Please choose at least one way of ordering."
        );
        setIsSubmitting(false);
      }
    } else {
      setAlerts(
        true,
        "warning",
        "Please select at least one default Language."
      );
    }
  };
  const [fullAddress, setFullAddress] = useState(1);
  const FullAddressHandle = (e) => {
    setFullAddress(e.target.checked ? 1 : 0);
  };
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const editOrderHandle = (e) => {
    setOrderMethodsEdit({
      ...orderMethodsEdit,
      [e.target.name]: e.target.checked ? 1 : 0,
    });
  };
  const arrayAddress = [];
  const dataLoad = async () => {
    try {
      const res = await axios.get("/api/getCurrencies");
      if (res.data.status === 200) {
        setCurrency(res.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const langs = await axios.get(`/api/branchLangs/${id}`);
      if (langs.data.status === 200) {
        setSelectedLang(langs.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const response = await axios.get(`/api/editBranches/${id}`);
      if (response.data.status === 200) {
        setFullAddress(response.data.branch.fullAddress);
        JSON.parse(response.data.branch.otherAddressFields).map((item) =>
          arrayAddress.push({
            name: item,
            errors: {
              name: null,
            },
          })
        );
        setEditBranchstate(response.data.branch);
        setOrderMethodsEdit(JSON.parse(response.data.branch.orderMethods));

        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    // var callback = function (loc) {
    //   setIpApi(loc);
    // };
    // ipapi.location(callback);
    dataLoad();
    return () => {
      setCurrency([]);
      setFullAddress(1);
      setEditBranchstate([]);
      setOrderMethodsEdit([]);
      setLoading(true);
    };
  }, [id]);

  const [form, setForm] = useState(arrayAddress);

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.name === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];
        if (form[index].name === "") {
          allPrev[index].errors.name = "Name for input is required";
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
  const removeImage = (e, image) => {
    e.preventDefault();
    axios
      .post(`/api/removeBranchImage/${image}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditBranchstate({
            ...editBranchstate,
            branchImages: JSON.stringify(
              JSON.parse(editBranchstate.branchImages).filter(
                (item) => item !== image
              )
            ),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImage = (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file[]", e.target.files[i]);
    }

    const images = [];
    axios
      .post("/api/uploadBranchImage", formData)
      .then((res) => {
        if (res.data.status === 200) {
          JSON.parse(editBranchstate?.branchImages)?.map((item) =>
            images.push(item)
          );
          res.data.filenames.map((item) => images.push(item));
          setEditBranchstate({
            ...editBranchstate,
            branchImages: JSON.stringify(images),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const removeVideo = (e, video) => {
    e.preventDefault();
    axios
      .post(`/api/removeBranchVideo/${video}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditBranchstate({
            ...editBranchstate,
            branchVideos: JSON.stringify(
              JSON.parse(editBranchstate.branchVideos).filter(
                (item) => item !== video
              )
            ),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleVideo = (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file[]", e.target.files[i]);
    }
    const images = [];
    axios
      .post("/api/uploadBranchVideo", formData)
      .then((res) => {
        if (res.data.status === 200) {
          res.data.filenames.map((item) => images.push(item));

          setEditBranchstate({
            ...editBranchstate,
            branchVideos: JSON.stringify(images),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var viewBranches_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewBranches_HTMLTABLE = (
      <Formik
        initialValues={editBranchstate}
        validationSchema={validationSchema}
        onSubmit={updateBranch}
      >
        {({ errors, status, touched, values, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("branch_info")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label> {t("branch_name")}</label>
                      <Field
                        name="BrancheName"
                        type="text"
                        className={
                          "form-control" +
                          (errors.BrancheName && touched.BrancheName
                            ? " is-invalid"
                            : "")
                        }
                        placeholder="A unique name..."
                      />
                      <ErrorMessage
                        name="BrancheName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label> {t("currency")}</label>
                      <Field
                        as="select"
                        name="currencyID"
                        className={
                          "form-control" +
                          (errors.currencyID && touched.currencyID
                            ? " is-invalid"
                            : "")
                        }
                      >
                        <option value="">{t("select_currency")}</option> )
                        {currency.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.currency_name + " / " + item.currency_code}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="currencyID"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("ordering_methods")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                orderMethodsEdit.tbl_qrcode ? true : false
                              }
                              name="tbl_qrcode"
                              onChange={(e) => editOrderHandle(e)}
                              color="primary"
                            />
                          }
                          label="Table Reservation"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={orderMethodsEdit.delivery ? true : false}
                              name="delivery"
                              onChange={(e) => editOrderHandle(e)}
                              color="primary"
                            />
                          }
                          label="Home Delivery"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={orderMethodsEdit.whatsApp ? true : false}
                              name="whatsApp"
                              onChange={(e) => editOrderHandle(e)}
                              color="primary"
                            />
                          }
                          label="WhatsApp"
                        />
                      </FormGroup>
                    </div>
                    <div className="form-group">
                      <label> {t("ordering_phone_number")}</label>
                      <PhoneInput
                        // country={ipApi?.country_code?.toLowerCase()}
                        className={
                          errors.phoneNumber && touched.phoneNumber
                            ? " is-invalid"
                            : ""
                        }
                        value={editBranchstate.phoneNumber}
                        name="phoneNumber"
                        onChange={(getOptionValue) => {
                          setFieldValue("phoneNumber", getOptionValue);
                        }}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <Languages
                  selectedLang={selectedLang}
                  setSelectedLang={setSelectedLang}
                  setAlerts={setAlerts}
                  BranchName={values.BrancheName}
                />
              </div>

              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("addressing_method")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={fullAddress ? true : false}
                              name="full_address"
                              onChange={(e) => FullAddressHandle(e)}
                              color="primary"
                            />
                          }
                          label="Full Address"
                        />
                      </FormGroup>
                      {form.map((item, index) => (
                        <div className="row m-1" key={`item-${index}`}>
                          <div className="col-10">
                            <input
                              type="text"
                              className={
                                item.errors.name
                                  ? "form-control  is-invalid"
                                  : "form-control"
                              }
                              name="name"
                              placeholder="Input Name..."
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
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={handleAddLink}
                      >
                        {t("add_more")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("images_and_videos")}</h3>
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
                          name="branchImages"
                          onChange={handleImage}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                      </div>
                      <div className="row form-group my-2">
                        {JSON.parse(editBranchstate?.branchImages)?.map(
                          (photo) => {
                            return (
                              <div
                                className="col-xl-2 col-lg-2 col-sm-2"
                                key={photo}
                              >
                                <div className="card ">
                                  <div className="text-center">
                                    <img
                                      className="w-100"
                                      src={`http://${base_url}:${port}/images/branches/${photo}`}
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
                            );
                          }
                        )}
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
                          name="branchVideos"
                          onChange={handleVideo}
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                      </div>
                      <div className="row form-group my-2">
                        {JSON.parse(editBranchstate?.branchVideos)?.map(
                          (video) => {
                            return (
                              <div
                                className="col-xl-2 col-lg-2 col-sm-2"
                                key={video}
                              >
                                <div className="card ">
                                  <div className="text-center">
                                    <ReactPlayer
                                      width="150px"
                                      height="200px"
                                      url={`http://${base_url}:${port}/videos/branches/${video}`}
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
                          }
                        )}
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
            </div>
          </Form>
        )}
      </Formik>
    );
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
        <CBreadcrumbItem active>
          <Link to={`/branches`}>{t("branches")}</Link>
        </CBreadcrumbItem>
      </CBreadcrumb>

      {viewBranches_HTMLTABLE}
    </Fragment>
  );
};

export default EditBranch;
