import React, { useState, useEffect } from "react";

import { Formik, Field, Form } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import CustomAlert from "../CustomAlert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { checkPermission } from "../Permissions";
import { base_url, port } from "../../../Consts";
import DefaultPic from "../../../images/hellomenu/logo.svg";
import { localization as t } from "../Localization";
import ipapi from "ipapi.co";

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
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, companyLogo: e.target.files[0] });
  };
  const save = (data) => {
    const formData = new FormData();
    formData.append("companyLogo", imageState.companyLogo);
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
    axios.post("/api/UpdateCompanies", formData).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
        setCheck(!check);
      }
    });
  };
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState([]);
  const [check, setCheck] = useState(true);

  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/GetCompanies");
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData[0]);
      }
      axios.get("/api/GetBusinessType").then((res) => {
        setBusiness(res.data.fetchData);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const [ipApi, setIpApi] = useState([]);

  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
    dataLoad();

    return () => {
      setFetchData([]);
      setLoading(true);
    };
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

        <Formik onSubmit={save} initialValues={initialValues}>
          {({ setFieldValue }) => (
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
                <label> {t("logo")}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="companyLogo"
                  onChange={handleImage}
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
                      country={ipApi?.country_code?.toLowerCase()}
                      value={fetchData?.whatsapp}
                      //   name="whatsapp"
                      onChange={(getOptionValue) => {
                        setFieldValue("whatsapp", getOptionValue);
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
