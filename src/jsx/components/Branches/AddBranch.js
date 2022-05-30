import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { localization as t } from "../Localization";
import ipapi from "ipapi.co";
import SubmitButtons from "../Common/SubmitButtons";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import Languages from "./Languages";
import { PublicLocale } from "./Public Localization/Default";
import PhoneInput, {
  isValidPhoneNumber,
  // isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

const AddBranch = () => {
  const initialValues = {
    BrancheName: "",
    currencyID: "",
    phoneNumber: "",
    branchVideos: [],
    branchImages: null,
    locale: JSON.stringify(PublicLocale),
  };
  const [value, setValue] = useState();
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const FILE_SIZE = 160 * 1024;
  const validationSchema = () => {
    return Yup.object().shape({
      BrancheName: Yup.string().required("Branch Name is required"),
      currencyID: Yup.string().required("Currency is required"),
      branchImages: Yup.mixed()
        .nullable()
        .required("A file is required")
        .test(
          "FILE_SIZE",
          "File Size is too large",
          (value) => !value || (value && value.size <= 1024 * 1024)
        )
        .test(
          "FILE_FORMAT",
          "Unsupported File Format",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
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

  const saveBranch = (data) => {
    if (isValidPhoneNumber(value)) {
      if (selectedLang.length !== 0) {
        setIsSubmitting(true);
        const ArrayValue = [];
        for (const [key, value] of Object.entries(orderMethods)) {
          ArrayValue.push(value);
        }
        if (ArrayValue.includes(1)) {
          const formData = new FormData();
          formData.append("orderMethods", JSON.stringify(orderMethods));
          formData.append("BrancheName", data.BrancheName);
          formData.append("currencyID", data.currencyID);
          for (let i = 0; i < data.branchImages.length; i++) {
            formData.append("branchImages[]", data.branchImages[i]);
          }
          for (let i = 0; i < data.branchVideos.length; i++) {
            formData.append("branchVideos[]", data.branchVideos[i]);
          }
          formData.append("phoneNumber", value);
          formData.append("otherAddressFields", JSON.stringify(form));
          formData.append("fullAddress", fullAddress);
          formData.append("languages", JSON.stringify(selectedLang));
          formData.append("locale", data.locale);
          axios
            .post("/api/insertBranches", formData)
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
              } else if (res.data.status === 304) {
                setAlerts(true, "warning", res.data.message);
                setIsSubmitting(false);
              } else {
                setAlerts(true, "error", res.data.error);
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
    }
  };
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderMethods, setOrderMethods] = useState(1);
  const orderHandle = (e) => {
    setOrderMethods({
      ...orderMethods,
      [e.target.name]: e.target.checked ? 1 : 0,
    });
  };
  const [fullAddress, setFullAddress] = useState(1);
  const FullAddressHandle = (e) => {
    setFullAddress(e.target.checked ? 1 : 0);
  };

  const [ipApi, setIpApi] = useState([]);
  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
    const dataLoad = () => {
      try {
        axios.get("/api/getCurrencies").then((response) => {
          if (response.data.status === 200) {
            setCurrency(response.data.fetchData);
            setLoading(false);
          } else {
            throw Error("Due to an error, the data cannot be retrieved.");
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    dataLoad();
    return () => {
      setCurrency([]);
      setLoading(true);
    };
  }, []);

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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveBranch}
      >
        {({ errors, status, touched, setFieldValue, values }) => (
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
                              name="tbl_qrcode"
                              onChange={(e) => orderHandle(e)}
                              color="primary"
                            />
                          }
                          label="Table Reservation"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="delivery"
                              onChange={(e) => orderHandle(e)}
                              color="primary"
                            />
                          }
                          label="Home Delivery"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="whatsApp"
                              onChange={(e) => orderHandle(e)}
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
                        placeholder="Enter phone number"
                        defaultCountry={ipApi?.country_code}
                        name="phoneNumber"
                        value={value}
                        onChange={setValue}
                        style={{
                          padding: "7px",
                          border: value
                            ? isValidPhoneNumber(value)
                              ? "1px solid #ccc"
                              : "1px solid #FF5252"
                            : "1px solid #FF5252",
                          borderRadius: "10px",
                        }}
                      />
                      <div className="text-danger">
                        <small>
                          {" "}
                          {value
                            ? isValidPhoneNumber(value)
                              ? undefined
                              : "Invalid phone number"
                            : "Phone number required"}
                        </small>
                      </div>
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
                          // accept="image/*"
                          className={
                            "form-control" +
                            (errors.branchImages && touched.branchImages
                              ? " is-invalid"
                              : "")
                          }
                          // name="branchImages"
                          onChange={(event) => {
                            setFieldValue("branchImages", event.target.files);
                          }}
                          multiple
                          // data-overwrite-initial="false"
                          // data-min-file-count="1"
                        />
                        <ErrorMessage
                          name="branchImages"
                          component="div"
                          className="invalid-feedback"
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
                          name="branchVideos"
                          onChange={(event) => {
                            setFieldValue("branchVideos", event.target.files);
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
              <div className="card-footer text-right">
                <SubmitButtons
                  isSubmitting={isSubmitting}
                  left={t("back")}
                  right={t("save")}
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

export default AddBranch;
