import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import HeaderWizard from "./HeaderWizard";
// import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Select from "react-select";
import { Locale } from "../../components/DefaultLanguage";
import { useTranslation } from "react-i18next";

const Venue = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const userId = location.state.userId;
  const history = useHistory();
  const [business, setBusiness] = useState([]);
  useEffect(() => {
    axios
      .get("/api/getBusinessType")
      .then((res) => {
        setBusiness(res.data.fetchData);
      })
      .catch((error) => {
        console.log(error);
      });
      return ()=>{
        setBusiness([]);
      }
  }, []);
  const initialValues = {
    company: "",
    business_type_id: "",
    locale: JSON.stringify(Locale),
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      company: Yup.string().required("Name of the business is required"),
      business_type_id: Yup.string().required("Type of business is required"),
    });
  };

  const handleSubmit = (data) => {
    axios
      .post(`/api/updateRegister/${userId}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem(
            "auth_company_id",
            btoa(res.data.data.company_id)
          );
          localStorage.setItem("locale", JSON.stringify(Locale));
          history.push({
            pathname: `/onboarding/solutions`,
            state: {
              userId: userId,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <HeaderWizard
        first="done active"
        second="editable active"
        thrid=""
        fourth=""
      />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">{t("welcome_to_hello_menu")}</h3>
                  <p className="text-center">
                    {" "}
                    {t("let’s_start_talking_about_your_business")}
                  </p>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, status, setFieldValue, touched }) => (
                      <Form>
                        <div className="form-group">
                          <label>
                            <span className="text-danger"> * </span>
                            {t("what_is_the_name_of_the_business")}
                          </label>

                          <Field
                            name="company"
                            type="text"
                            className={
                              "form-control" +
                              (errors.company && touched.company
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="company"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label>{t("what_is_the_type_of_business")}</label>
                          <Select
                            options={business?.map((bus, i) => {
                              return {
                                value: bus.id,
                                label: bus.BusinessName,
                              };
                            })}
                            onChange={(getOptionValue) => {
                              setFieldValue(
                                "business_type_id",
                                getOptionValue.value
                              );
                            }}
                          />
                          {errors.business_type_id ? (
                            <small
                              className="invalid"
                              style={{ color: "#ff4b4c", marginTop: ".5rem" }}
                            >
                              {errors.business_type_id}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="form-group text-right">
                          <button
                            type="submit"
                            className="btn-primary"
                            style={{
                              padding: "5px 20px 5px 20px",
                              borderRadius: "10px",
                              border: "none",
                            }}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Venue;
