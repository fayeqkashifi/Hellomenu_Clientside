import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import HeaderWizard from "./HeaderWizard";

import { useLocation, useHistory } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
const OnBoarding = (props) => {
  const location = useLocation();
  const history = useHistory();

  const userId = location.state.userId;
  const [value, setValue] = useState();
  const initialValues = {
    name: "",
  };
  // atob
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
    });
  };
  const handleSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone_number", value);
    axios.post(`/api/UpdateRegister/${userId}`, formData).then((res) => {
      localStorage.setItem("auth_name", btoa(data.name));
      history.push({
        pathname: `/onboarding/venue`,
        state: {
          userId: userId,
        },
      });
    });
    
  };

  return (
    <>
      <HeaderWizard first="editable active" second="" thrid="" fourth="" />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">Welcome to Hello Menu!</h3>
                  <p className="text-center"> Tell us about yourself</p>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, status, touched }) => (
                      <Form>
                        <div className="form-group">
                          <label htmlFor="email">
                            <span className="text-danger"> * </span>
                            What is your name?
                          </label>

                          <Field
                            name="name"
                            type="text"
                            className={
                              "form-control" +
                              (errors.name && touched.name ? " is-invalid" : "")
                            }
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">
                            What is your phone number?
                          </label>
                          <PhoneInput
                            country={"af"}
                            value={value}
                            onChange={(phone) => setValue(phone)}
                          />
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

export default OnBoarding;
