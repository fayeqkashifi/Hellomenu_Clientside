import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
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

const EditBranch = (props) => {
  const id = props.history.location.state.id;

  const validationSchema = () => {
    return Yup.object().shape({
      BrancheName: Yup.string().required("Branch Name is required"),
      currencyID: Yup.string().required("Currency is required"),
      phoneNumber: Yup.string().phone().required("Phone Number is required"),
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

  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, branchImage: e.target.files[0] });
  };

  const updateBranch = (data) => {
    const ArrayValue = [];
    for (const [key, value] of Object.entries(orderMethodsEdit)) {
      ArrayValue.push(value);
    }
    if (ArrayValue.includes(1)) {
      const formData = new FormData();
      formData.append("orderMethods", JSON.stringify(orderMethodsEdit));
      formData.append("BrancheName", data.BrancheName);
      formData.append("currencyID", data.currencyID);
      formData.append("branchImage", imageState.branchImage);

      formData.append("phoneNumber", data.phoneNumber);
      formData.append("otherAddressFields", JSON.stringify(form));
      formData.append("fullAddress", fullAddress);
      formData.append("id", data.id);
      axios.post("/api/UpdateBranches", formData).then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success").then((check) => {
            if (check) {
              history.push(`/branches`);
            }
          });
        } else if (res.data.status === 304) {
          setAlerts(true, "warning", res.data.message);
        }
      });
    } else {
      setAlerts(true, "warning", "Please choose at least one way of ordering.");
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
      const response = await axios.get(`/api/EditBranches/${id}`);
      if (response.data.status === 200) {
        setFullAddress(response.data.branch.fullAddress);
        JSON.parse(response.data.branch.otherAddressFields).map((item) => {
          arrayAddress.push({
            name: item,
            errors: {
              name: null,
            },
          });
        });
        setEditBranchstate(response.data.branch);
        setOrderMethodsEdit(JSON.parse(response.data.branch.orderMethods));
      } else if (response.data.status === 404) {
        setAlerts(true, "error", response.data.message);
      }
      const res = await axios.get("/api/GetCurrencies");
      if (res.data.status === 200) {
        setCurrency(res.data.fetchData);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setCurrency([]);
      setFullAddress(1);
      setEditBranchstate([]);
      setOrderMethodsEdit([]);
      setLoading(true);
    };
  }, []);

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
  var viewBranches_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewBranches_HTMLTABLE = (
      <div className="card">
        <div className="card-header">
          <div>
            <h4 className="card-title">{t("edit_branch")}</h4>
          </div>
        </div>
        <Formik
          initialValues={editBranchstate}
          validationSchema={validationSchema}
          onSubmit={updateBranch}
        >
          {({ errors, status, touched }) => (
            <Form>
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
                <div className="form-group">
                  <label> {t("image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder={t("category_icon")}
                    name="branchImage"
                    onChange={handleImage}
                  />
                </div>
                {editBranchstate.branchImage ? (
                  <img
                    src={`http://${base_url}:${port}/images/branches/${editBranchstate.branchImage}`}
                    width="70"
                    alt=" "
                  />
                ) : null}
                <div className="form-group">
                  <label> {t("ordering_phone_number")}</label>
                  <Field
                    name="phoneNumber"
                    type="text"
                    className={
                      "form-control" +
                      (errors.phoneNumber && touched.phoneNumber
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="+93--- ---- ---"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("ordering_methods")}</label>

                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={orderMethodsEdit.tbl_qrcode ? true : false}
                          name="tbl_qrcode"
                          onChange={(e) => editOrderHandle(e)}
                          color="secondary"
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
                          color="secondary"
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
                          color="secondary"
                        />
                      }
                      label="WhatsApp"
                    />
                  </FormGroup>
                </div>
                <div className="form-group">
                  <label> {t("addressing_method")}</label>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={fullAddress ? true : false}
                          name="full_address"
                          onChange={(e) => FullAddressHandle(e)}
                          color="secondary"
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
                          <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                        </IconButton>
                      </div>
                    </div>
                  ))}

                  <button className="btn btn-primary " onClick={handleAddLink}>
                    {t("add_more")}
                  </button>
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
            </Form>
          )}
        </Formik>
      </div>
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
          <Link to={`/branches`}>{t("Branches")}</Link>
        </CBreadcrumbItem>
      </CBreadcrumb>

      {viewBranches_HTMLTABLE}
    </Fragment>
  );
};

export default EditBranch;
