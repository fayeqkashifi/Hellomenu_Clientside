import React, { useMemo, useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import HeaderWizard from "./HeaderWizard";
// import { Link, useRouteMatch } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

const Venue = () => {
  const location = useLocation();
  const userId = location.state.userId;
  const history = useHistory();

  const options = useMemo(() => countryList().getData(), []);

  
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    axios.get("/api/GetLanguages").then((res) => {
      setLanguages(res.data);
    });
  }, []);
  const initialValues = {
    company: "",
    language: "",
    country: "",
    typeOfCompany: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      company: Yup.string().required("Name of the business is required"),
      language: Yup.string().required("Language is required"),
      country: Yup.string().required("Country is required"),
      typeOfCompany: Yup.string().required("Type of business is required"),
    });
  };
  
  const handleSubmit = (data) => {
    axios.post(`/api/UpdateRegister/${userId}`, data).then((res) => {
      if (res.data.status === 200) {
        localStorage.setItem("auth_company_id", btoa(res.data.data.company_id));
        history.push({
          pathname: `/onboarding/solutions`,
          state: {
            userId: userId,
          },
        });
        }
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
                  <h3 className="text-center">Welcome to Hello Menu!</h3>
                  <p className="text-center">
                    {" "}
                    Let’s start talking about your business
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
                            What is the name of the business?
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
                          <label>What is the type of the business?</label>
                          <Field
                            name="typeOfCompany"
                            type="text"
                            className={
                              "form-control" +
                              (errors.typeOfCompany && touched.typeOfCompany
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="typeOfCompany"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <span className="text-danger"> * </span>
                            What is your language?
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
                            What is your country?
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
                            Continue
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
