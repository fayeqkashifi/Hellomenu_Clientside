import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CustomAlert from "../CustomAlert";
import { useHistory } from "react-router-dom";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";

const Ingredients = (props) => {
  // validation start
  const history = useHistory();

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
    });
  };
  // validation end

  // for localization
  // insert start
  const [modalCentered, setModalCentered] = useState(false);
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
  const save = (e) => {
    e.preventDefault();
    if (form.length !== 0) {
      if (prevIsValid()) {
        const formData = new FormData();
        formData.append("form", JSON.stringify(form));
        axios
          .post("/api/insertIngredient", formData)
          .then((res) => {
            if (res.data.status === 200) {
              setCheck(!check);
              setForm([
                {
                  name: "",

                  errors: {
                    name: null,
                  },
                },
              ]);
              setModalCentered(false);
              // console.log(res.data.duplicate_array.length);
              res.data.duplicate_array.length === 0
                ? setAlerts(true, "success", res.data.message)
                : setAlerts(
                    true,
                    "warning",
                    "Duplicate Entry:" + res.data.duplicate_array
                  );
            }
          })
          .catch((error) => {
            console.log(error);
            // return Promise.reject(error);
          });
      }
    } else {
      setAlerts(true, "error", "Please add a name.");
    }
  };
  // insert end
  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);

  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editIngredient/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEdit(res.data.item);
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        // return Promise.reject(error);
      });
  };
  // update
  const update = (data) => {
    axios
      .post("/api/updateIngredient", data)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setEditModalCentered(false);
          setAlerts(true, "success", res.data.message);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        // return Promise.reject(error);
      });
  };
  // edit end

  // delete Start
  const deleteIngredient = (e, id) => {
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
          .delete(`/api/deleteIngredient/${id}`)
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
  // delete End

  //retriving data using laravel API for show
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.post(`/api/getIngredient`);
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // dataLoad();
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [check]);
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
          allPrev[index].errors.name = "Name for ingerdient is required";
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

  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <tr key={item.id}>
          <td>{i + 1}</td>

          <td> {item.name}</td>
          <td>
            {checkPermission("ingredients-edit") && (
              <button
                type="button"
                onClick={(e) => fetch(e, item.id)}
                className="btn btn-outline-danger btn-sm"
              >
                {t("edit")}
              </button>
            )}
            &nbsp;&nbsp;&nbsp;
            {checkPermission("ingredients-delete") && (
              <button
                type="button"
                onClick={(e) => deleteIngredient(e, item.id)}
                className="btn btn-outline-warning btn-sm"
              >
                {t("delete")}
              </button>
            )}
          </td>
        </tr>
      );
    });
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
      {/* insert */}
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_ingredient")}</Modal.Title>
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <form onSubmit={(e) => save(e)}>
          <Modal.Body>
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
                    placeholder="Ingredient Name..."
                    value={item.name}
                    onChange={(e) => onChange(index, e)}
                  />

                  {item.errors.name && (
                    <div className="invalid-feedback">{item.errors.name}</div>
                  )}
                </div>

                <div className="col-2">
                  <IconButton onClick={(e) => handleRemoveField(e, index)}>
                    <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                  </IconButton>
                </div>
              </div>
            ))}

            <button className="btn btn-primary mt-2" onClick={handleAddLink}>
              {t("add")}
            </button>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => setModalCentered(false)}
              variant="danger light"
            >
              {t("close")}
            </Button>
            <Button variant="primary" type="submit">
              {t("save")}{" "}
            </Button>
          </Modal.Footer>
        </form>

        {/* </Form>
          )}
        </Formik> */}
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Modal.Header>
          <Modal.Title>{t("edit_ingredient")} </Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={edit}
          validationSchema={validationSchema}
          onSubmit={update}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("name")}</label>
                  <Field
                    name="name"
                    type="text"
                    className={
                      "form-control" +
                      (errors.name && touched.name ? " is-invalid" : "")
                    }
                    placeholder="Name...."
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setEditModalCentered(false)}
                  variant="danger light"
                >
                  {t("close")}
                </Button>
                <Button variant="primary" type="submit">
                  {t("update")}{" "}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("ingredients")}</h4>
              </div>
              <div className="dropdown">
                {checkPermission("ingredients-create") && (
                  <Button
                    variant="primary"
                    type="button"
                    className="mb-2 mr-2"
                    onClick={() => setModalCentered(true)}
                  >
                    {t("add_ingredient")}
                  </Button>
                )}
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("name")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>{viewProducts_HTMLTABLE}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Ingredients;
