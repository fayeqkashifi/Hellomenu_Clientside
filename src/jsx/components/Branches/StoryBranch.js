import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { Formik, Form } from "formik";
import CustomAlert from "../CustomAlert";
import "yup-phone";
import { localization as t } from "../Localization";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { checkPermission } from "../Permissions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
const Storybranch = (props) => {
  const id = props.history.location.state.id;

  // insert start
  const history = useHistory();
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
    const formData = new FormData();
    for (let i = 0; i < data.storyVideos.length; i++) {
      formData.append("storyVideos[]", data.storyVideos[i]);
    }
    formData.append("storyTagProducts", JSON.stringify(tagProducts));
    formData.append("branch_id", id);
    axios.post("/api/InsertStories", formData).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
        setCheck(!check);
      }
    });
  };

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);
  const dataLoad = async () => {
    try {
      const response = await axios.get(`/api/getStories/${id}`);
      if (response.data.status === 200) {
        setStories(response.data.data);
        const result = await axios.get(`/api/GetProducts/${id}`);
        if (result.data.status === 200) {
          setProducts(result.data.fetchData);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const [check, setCheck] = useState(false);
  useEffect(() => {
    dataLoad();
    return () => {
      setLoading(true);
    };
  }, [check]);

  const [tagProducts, setTagProducts] = useState([]);
  const handleSelect = (e) => {
    setTagProducts(e);
  };
  const initialValues = {
    storyVideos: [],
  };
  // delete start
  const deleteItem = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteStory/${id}`).then((res) => {
          if (res.data.status === 200) {
            setAlerts(true, "success", res.data.message);
          } else if (res.data.status === 404) {
            setAlerts(true, "error", res.data.message);
          }
          setCheck(!check);
        });
      } else {
        setAlerts(true, "info", "Your Data is safe now!");
      }
    });
  };
  // delete end

  const [showModal, setShowModal] = useState(false);

  var viewBranches_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewBranches_HTMLTABLE = (
      <Formik initialValues={initialValues} onSubmit={save}>
        {({ errors, status, touched, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{t("video")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("video")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <input
                          type="file"
                          accept="video/*"
                          className="form-control"
                          name="storyVideos"
                          onChange={(event) => {
                            setFieldValue("storyVideos", event.target.files);
                          }}
                          required
                          multiple
                          data-overwrite-initial="false"
                          data-min-file-count="1"
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {/* {t("tag_product")} */}
                        Tag Product
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <Select
                          //   defaultValue={JSON.parse(stories?.storyTagProducts)}
                          isMulti
                          options={products?.map((pro, i) => {
                            return {
                              value: pro.id,
                              label: pro.ProductName,
                            };
                          })}
                          onChange={handleSelect}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-right">
                    <Button
                      variant="danger light"
                      className="m-1"
                      onClick={() => history.goBack()}
                    >
                      {t("back")}
                    </Button>
                    <Button variant="primary" type="submit">
                      {t("save")}{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Fragment>
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

      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <CBreadcrumbItem active>
          <Link to={`/branches`}>{t("branches")}</Link>
        </CBreadcrumbItem>
      </CBreadcrumb>

      {viewBranches_HTMLTABLE}

      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("stories")}</h4>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center ">
                  <thead>
                    <tr className="card-title">
                      <th>{t("tag_products")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((item, i) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            {JSON.parse(item.storyTagProducts).map((item) => {
                              return (
                                <Stack
                                  direction="row"
                                  className="m-1"
                                  spacing={1}
                                  key={item.value}
                                >
                                  <Chip
                                    label={item.label}
                                    // color="primary"
                                    variant="outlined"
                                  />
                                </Stack>
                              );
                            })}
                          </td>
                          <td>
                            {checkPermission("branches-edit") && (
                              <Link
                                to={{
                                  pathname: `/branches/show-stories`,
                                  state: { id: item.id },
                                }}
                                onClick={() => setShowModal(false)}
                                className="btn btn-outline-info btn-sm"
                              >
                                {t("show")}
                              </Link>
                            )}
                            &nbsp;&nbsp;&nbsp;
                            {checkPermission("branches-delete") && (
                              <button
                                type="button"
                                onClick={(e) => deleteItem(e, item.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                {t("delete")}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Storybranch;
