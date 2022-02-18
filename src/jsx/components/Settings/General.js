import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Formik, Field, Form } from "formik";
import { Button } from "react-bootstrap";
import axios from "axios";
import CustomAlert from "../CustomAlert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

const General = () => {
  const { t } = useTranslation();
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
    axios.post("/api/UpdateCompanies", data).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
      }
    });
  };
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState([]);

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
  useEffect(() => {
    dataLoad();

    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
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
                      value: fetchData.business_type_id,
                      label: business.filter(
                        (item) => item.id === fetchData.business_type_id
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
                      country={"af"}
                      value={fetchData?.whatsapp}
                      //   name="whatsapp"
                      onChange={(getOptionValue) => {
                        setFieldValue("whatsapp", getOptionValue);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button variant="success" type="submit">
                  {t("save")}{" "}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  }
};

export default General;
