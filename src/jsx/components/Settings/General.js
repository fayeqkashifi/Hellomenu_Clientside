import React, { useState, useEffect } from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import CustomAlert from "../CustomAlert";
import PhoneInput, {
  isValidPhoneNumber,
  // isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { checkPermission } from "../Permissions";
import { base_url, port } from "../../../Consts";
import DefaultPic from "../../../images/hellomenu/logo.svg";
import { localization as t } from "../Localization";
import ipapi from "ipapi.co";
import * as Yup from "yup";

const General = () => {
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
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/svg",
    "image/gif",
    "image/png",
  ];
  const validationSchema = () => {
    return Yup.object().shape({
      companyLogo: Yup.mixed()
        .nullable()
        // .required("A file is required")
        .test(
          "FILE_SIZE",
          "File Size is too large",
          (value) => !value || (value && value.size <= 5000000)
        )
        .test(
          "FILE_FORMAT",
          "Unsupported File Format",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
    });
  };
  const save = (data) => {
    const formData = new FormData();
    formData.append("companyLogo", data.companyLogo);
    formData.append("id", data.id);
    formData.append("company", data.company);
    formData.append("companyDiscription", data.companyDiscription);
    formData.append("business_type_id", data.business_type_id);
    formData.append("facebook", data.facebook);
    formData.append("instagram", data.instagram);
    formData.append("youtube", data.youtube);
    formData.append("tiktok", data.tiktok);
    formData.append("contactEmail", data.contactEmail);
    formData.append("whatsapp", data.whatsapp);
    axios
      .post("/api/updateCompanies", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setCheck(!check);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState([]);
  const [check, setCheck] = useState(true);

  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getCompanies");
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData[0]);
      }
      axios
        .get("/api/getBusinessType")
        .then((res) => {
          setBusiness(res.data.fetchData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
    dataLoad();
  }, [check]);
  const initialValues = {
    id: fetchData?.id,
    company: fetchData?.company,
    companyDiscription: fetchData?.companyDiscription
      ? fetchData.companyDiscription
      : "",
    business_type_id: fetchData?.business_type_id,
    facebook: fetchData?.facebook ? fetchData.facebook : "",
    instagram: fetchData?.instagram ? fetchData.instagram : "",
    youtube: fetchData?.youtube ? fetchData.youtube : "",
    tiktok: fetchData?.tiktok ? fetchData.tiktok : "",
    contactEmail: fetchData?.contactEmail ? fetchData.contactEmail : "",
    whatsapp: fetchData?.whatsapp ? fetchData.whatsapp : "",
    companyLogo: null,
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="spinner-border "
          role="status"
          style={{ color: "#5373e3" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
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

        <Formik
          onSubmit={save}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="form-group">
                <label> {t("company_name")}</label>
                <Field
                  name="company"
                  type="text"
                  className={"form-control"}
                  placeholder="Hello Menu..."
                />
              </div>
              <div className="form-group">
                <label> {t("company_discription")}</label>
                <Field
                  name="companyDiscription"
                  type="text"
                  className={"form-control"}
                  placeholder="Best Digital Menu in world..."
                />
              </div>
              <div className="form-group">
                <label> {t("business_type")}</label>
                <Select
                  defaultValue={[
                    {
                      value: fetchData?.business_type_id,
                      label: business.filter(
                        (item) => item.id === fetchData?.business_type_id
                      )[0]?.BusinessName,
                    },
                  ]}
                  options={business?.map((bus, i) => {
                    return {
                      value: bus.id,
                      label: bus.BusinessName,
                    };
                  })}
                  onChange={(getOptionValue) => {
                    setFieldValue("business_type_id", getOptionValue.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label>
                  {t("logo")}
                  <small style={{ fontSize: "10px" }}>{"(Max Size 5MB)"}</small>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={
                    "form-control" +
                    (errors.companyLogo && touched.companyLogo
                      ? " is-invalid"
                      : "")
                  }
                  onChange={(event) => {
                    setFieldValue("companyLogo", event.target.files[0]);
                  }}
                />
                <ErrorMessage
                  name="companyLogo"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  borderRadius: "50px",
                  objectFit: "contain",
                }}
                src={
                  fetchData?.companyLogo
                    ? `http://${base_url}:${port}/images/company/${fetchData?.companyLogo}`
                    : DefaultPic
                }
                alt="Company Logo"
              />

              <div className="form-group">
                <label> {t("social_links")}</label>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("facebook")}</label>
                    <Field
                      name="facebook"
                      type="text"
                      className={"form-control"}
                      placeholder={t("facebook") + " link here..."}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("instagram")}</label>
                    <Field
                      name="instagram"
                      type="text"
                      className={"form-control"}
                      placeholder={t("instagram") + " link here..."}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("youtube")}</label>
                    <Field
                      name="youtube"
                      type="text"
                      className={"form-control"}
                      placeholder={t("youtube") + " link here..."}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("tiktok")}</label>
                    <Field
                      name="tiktok"
                      type="text"
                      className={"form-control"}
                      placeholder={t("tiktok") + " link here..."}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("contact_email")}</label>
                    <Field
                      name="contactEmail"
                      type="text"
                      className={"form-control"}
                      placeholder={t("email")}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label> {t("whatsapp")}</label>
                    <PhoneInput
                      placeholder="Enter phone number"
                      defaultCountry={ipApi?.country_code}
                      value={fetchData?.whatsapp}
                      //   name="whatsapp"
                      onChange={(getOptionValue) => {
                        setFieldValue("whatsapp", getOptionValue);
                      }}
                      style={{
                        padding: "7px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>
              {checkPermission("general-info-edit") && (
                <div className="text-right">
                  <Button variant="success" type="submit">
                    {t("save")}{" "}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </>
    );
  }
};

export default General;
