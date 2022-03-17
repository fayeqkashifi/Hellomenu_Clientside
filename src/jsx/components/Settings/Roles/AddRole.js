import React, { useState, useEffect } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import axios from "axios";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as Yup from "yup";
import CustomAlert from "../../CustomAlert";
import RoleList from "./RoleList";
import { checkPermission } from "../../Permissions";
import { localization as t } from "../../Localization";

const initialValues = {
  roleName: "",
  roleDiscription: "",
};
const validationSchema = () => {
  return Yup.object().shape({
    roleName: Yup.string().required("Role Name is required"),
  });
};

const AddRole = () => {
  const [loading, setLoading] = useState(true);

  const [check, setCheck] = useState(true);

  const [state, setState] = useState([]);
  const [expand, setExpand] = useState([]);
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    axios
      .get("/api/getRoleTreeView")
      .then((result) => {
        if (result.data.status === 200) {
          removeEmptyArray(result.data.data[0]);
          setNodes(result.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      setNodes([]);
      setLoading(true);
    };
  }, []);
  const removeEmptyArray = (array) => {
    array.children.map((item) => {
      if (item.children.length === 0) {
        item.children = null;
      } else {
        removeEmptyArray(item);
      }
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
  const handleSubmit = (data, { resetForm }) => {
    if (state.length !== 0) {
      const formData = new FormData();
      formData.append("roleName", data.roleName);
      formData.append("roleDiscription", data.roleDiscription);
      formData.append("permissions", JSON.stringify(state));
      axios
        .post(`/api/insertRole`, formData)
        .then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);
            resetForm();
            setExpand([]);
            setState([]);
            setCheck(!check);
            setError([]);
          }
        })
        .catch((error) => {
          console.log(error);
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
      <>
        {checkPermission("roles-create") && (
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
                  <div className="row my-3">ADD ROLE</div>
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
                        (errors.roleName && touched.roleName
                          ? " is-invalid"
                          : "")
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
                    <button type="submit" className="btn btn-success">
                      {t("save")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
        <RoleList check={check} setCheck={setCheck} nodes={nodes} />
      </>
    );
  }
};
export default AddRole;
