import React, { useMemo, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import HeaderWizard from "./HeaderWizard";
import { useLocation, useHistory } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Solutions = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const userId = location.state.userId;
  const history = useHistory();

  const options = useMemo(() => countryList().getData(), []);

  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    axios
      .get("/api/GetLanguages")
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const initialValues = {
    language: "",
    country: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      language: Yup.string().required("Language is required"),
      country: Yup.string().required("Country is required"),
    });
  };

  const handleSubmit = (data) => {
    axios
      .post(`/api/UpdateRegister/${userId}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          history.push({
            pathname: `/onboarding/menu`,
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
        second="done active"
        thrid="editable active"
        fourth=""
      />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">
                    {t("select_your_language_and_country")}
                  </h3>
                  <p className="text-center"> </p>
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
                            {t("what_is_your_language")}
                          </label>

                          <Select
                            options={languages?.map((lang, i) => {
                              return {
                                value: lang.id,
                                label: lang.Language_name,
                              };
                            })}
                            onChange={(getOptionValue) => {
                              setFieldValue("language", getOptionValue.value);
                            }}
                          />
                          {errors.language ? (
                            <small
                              className="invalid"
                              style={{ color: "#ff4b4c", marginTop: ".5rem" }}
                            >
                              {errors.language}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="form-group">
                          <label>
                            <span className="text-danger"> * </span>
                            {t("what_is_your_country")}
                          </label>
                          <Select
                            className="is-invalid"
                            options={options}
                            onChange={(getOptionValue) => {
                              setFieldValue("country", getOptionValue.label);
                            }}
                          />
                          {errors.country ? (
                            <small
                              className="invalid"
                              style={{
                                color: "#ff4b4c",
                                marginTop: ".5rem",
                              }}
                            >
                              {errors.country}
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

export default Solutions;
