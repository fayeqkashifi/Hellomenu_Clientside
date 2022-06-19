import React, { useContext } from "react";
import "./TrackStyle.css";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TemplateContext } from "../../TemplateContext";

const OrderSearch = (props) => {
  let { style } = useContext(TemplateContext);
  const { setOrder, setShowDetails, setError } = props;
  const initialValues = {
    value: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      value: Yup.string().required("Order ID is required"),
    });
  };
  const search = (data) => {
    setShowDetails(false);
    axios.post(`/api/findOrder`, data).then((result) => {
      if (result.data.status === 200) {
        if (result.data.fetchData == null) {
          setError("Order Not Found");
        }
        setOrder(result.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    });
  };

  return (
    <div className="card" style={style?.cardStyle}>
      <div className="card-body">
        <div className="row">
          <div className="col align-self-center">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={search}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="form-group ">
                    <Field
                      name="value"
                      type="text"
                      className={
                        "form-control" +
                        (errors.value && touched.value ? " is-invalid" : "")
                      }
                      placeholder="Please Enter Tracking Id...."
                      style={style?.inputfield}
                    />
                    <ErrorMessage
                      name="value"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="text-left text-sm-right">
                    <button
                      className="btn"
                      type="submit"
                      style={style?.buttonStyle}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSearch;
