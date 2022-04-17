import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { Formik, Form } from "formik";
import CustomAlert from "../../CustomAlert";
import "yup-phone";
import { localization as t } from "../../Localization";
import "react-phone-input-2/lib/style.css";
import { checkPermission } from "../../Permissions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  Option,
  MultiValue,
  animatedComponents,
} from "../../Common/SelectOption";
import MySelect from "../../Common/MySelect";
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

  const save = (data, { resetForm }) => {
    const formData = new FormData();
    for (let i = 0; i < data.storyVideos.length; i++) {
      formData.append("storyVideos[]", data.storyVideos[i]);
    }
    formData.append("storyTagProducts", JSON.stringify(tagProducts));
    formData.append("branch_id", id);
    formData.append("form", JSON.stringify(form));
    axios
      .post("/api/insertStories", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          resetForm();
          setForm([
            {
              name: "",
              errors: {
                name: null,
              },
            },
          ]);
          setTagProducts([]);
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
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
        const result = await axios.get(`/api/getProductsAll/${id}`);
        if (result.data.status === 200) {
          setProducts(result.data.fetchData);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [check, setCheck] = useState(false);
  useEffect(() => {
    // dataLoad();
    return () => {
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/deleteStory/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setAlerts(true, "success", res.data.message);
            } else if (res.data.status === 404) {
              setAlerts(true, "error", res.data.message);
            }
            setCheck(!check);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setAlerts(true, "info", "Your Data is safe now!");
      }
    });
  };
  // delete end

  const [form, setForm] = useState([
    {
      name: "",
      errors: {
        name: null,
      },
    },
  ]);

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.name === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];
        // console.log();
        if (form[index].name === "") {
          allPrev[index].errors.name = "URL is required";
        }
        //  if (allPrev.some((val) => val.name == form[index].name)) {
        //   allPrev[index].errors.name = "Duplicate Entry";
        // }
        return setForm(allPrev);
      });
    }

    return !someEmpty;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const inputState = {
      name: "",
      errors: {
        name: null,
      },
    };

    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();

    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        return {
          ...item,
          [event.target.name]: event.target.value,

          errors: {
            ...item.errors,
            [event.target.name]:
              event.target.value.length > 0
                ? null
                : [event.target.name] + " Is required",
          },
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();

    setForm((prev) => prev.filter((item) => item !== prev[index]));
  };
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
                    <h3 className="card-title">{t("add_story")}</h3>
                  </div>
                  <div className="card-body">
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("tag_product")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <MySelect
                          options={products?.map((pro, i) => {
                            return {
                              value: pro.id,
                              label: pro.ProductName,
                            };
                          })}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option,
                            MultiValue,
                            animatedComponents,
                          }}
                          onChange={handleSelect}
                          allowSelectAll={true}
                          value={tagProducts}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div
                        className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#f5f5f5" }}
                      >
                        {t("video")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        <input
                          key={check}
                          type="file"
                          accept="video/*"
                          className="form-control"
                          name="storyVideos"
                          onChange={(event) => {
                            setFieldValue("storyVideos", event.target.files);
                          }}
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
                        {t("video_url")}
                      </div>
                      <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                        {form.map((item, index) => (
                          <div className="row mt-3" key={`item-${index}`}>
                            <div className="col-10">
                              <input
                                type="text"
                                className={
                                  item.errors.name
                                    ? "form-control  is-invalid"
                                    : "form-control"
                                }
                                name="name"
                                placeholder="URL..."
                                value={item.name}
                                onChange={(e) => onChange(index, e)}
                              />

                              {item.errors.name && (
                                <div className="invalid-feedback">
                                  {item.errors.name}
                                </div>
                              )}
                            </div>

                            <div className="col-2">
                              <IconButton
                                onClick={(e) => handleRemoveField(e, index)}
                              >
                                <DeleteIcon
                                  fontSize="small"
                                  sx={{ color: "red" }}
                                />
                              </IconButton>
                            </div>
                          </div>
                        ))}

                        <button
                          className="btn btn-primary mt-2"
                          onClick={handleAddLink}
                        >
                          {t("add")}
                        </button>
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
                      <th>{t("tag_product")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((item, i) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="row">
                              {JSON.parse(item.storyTagProducts).map((item) => {
                                return (
                                  <div className="col" key={item.value}>
                                    <Stack
                                      direction="row"
                                      className="m-1"
                                      spacing={1}
                                    >
                                      <Chip
                                        label={item.label}
                                        // color="primary"
                                        variant="outlined"
                                      />
                                    </Stack>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td width="30%">
                            {checkPermission("branches-edit") && (
                              <Link
                                to={{
                                  pathname: `/branches/edit-stories`,
                                  state: { id: item.id },
                                }}
                                className="btn btn-outline-info btn-sm"
                              >
                                {t("edit")}
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
