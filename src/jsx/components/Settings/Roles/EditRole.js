import React, { useState, useEffect } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import axios from "axios";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomAlert from "../../CustomAlert";
import { useHistory } from "react-router-dom";

const EditRole = (props) => {
  const { t } = useTranslation();
  const id = props.history.location.state.id;
  const nodes = props.history.location.state.nodes;
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [expand, setExpand] = useState([]);
  // const [nodes, setNodes] = useState(inputNodes);
  useEffect(() => {
    axios.get(`/api/getRole/${id}`).then((result) => {
      if (result.data.status === 200) {
        setData(result.data.data);
        setState(JSON.parse(result.data.data.permissions));
        setLoading(false);
      }
    });
  }, []);

  const initialValues = {
    id: data.id,
    roleName: data.roleName,
    roleDiscription: data?.roleDiscription ? data.roleDiscription : "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      roleName: Yup.string().required("Role Name is required"),
    });
  };
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
  const [error, setError] = useState("");

  const handleSubmit = (data) => {
    if (state.length !== 0) {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("roleName", data.roleName);
      formData.append("roleDiscription", data.roleDiscription);
      formData.append("permissions", JSON.stringify(state));
      axios.post(`/api/updateRole`, formData).then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
        }
      });
    } else {
      setError("Please Add Permission.");
    }
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
      <div style={{ borderBottom: "1px solid #ccc" }}>
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="row my-3">Edit ROLE</div>
              {error.length !== 0 && (
                <div
                  className="alert alert-warning "
                  style={{ color: "#000000" }}
                >
                  {error}
                </div>
              )}
              <div className="form-group">
                <Field
                  name="roleName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.roleName && touched.roleName ? " is-invalid" : "")
                  }
                  placeholder="Admin, Manager, SuperVisor, Visitor..."
                />
                <ErrorMessage
                  name="roleName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Field
                  name="roleDiscription"
                  as="textarea"
                  className={"form-control"}
                  placeholder="Role Discription..."
                />
              </div>

              <CheckboxTree
                nodes={nodes}
                checked={state}
                expanded={expand}
                onCheck={(checked) => setState(checked)}
                onExpand={(expanded) => setExpand(expanded)}
              />
              <div className="form-group text-right">
                <button
                  className="btn btn-info mx-1"
                  onClick={() => history.goBack()}
                >
                  {t("back")}
                </button>
                <button type="submit" className="btn btn-success">
                  {t("update")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
};
export default EditRole;
