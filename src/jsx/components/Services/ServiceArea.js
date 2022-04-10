import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import { Option, MultiValue, animatedComponents } from "../Common/SelectOption";
import MySelect from "../Common/MySelect";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";
const ServiceArea = (props) => {
  const id = props.history.location.state.id;

  // insert Start
  const [modalCentered, setModalCentered] = useState(false);
  const [areaModal, setAreaModal] = useState(false);
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
  const saveServiceAreas = (e) => {
    e.preventDefault();
    if (servicesAreas.length !== 0) {
      const formData = new FormData();
      formData.append("BranchID", id);
      formData.append("AreaName", JSON.stringify(servicesAreas));
      axios
        .post("/api/insertServicAreas", formData)
        .then((res) => {
          if (res.data.status === 200) {
            setServicesAreas([]);
            setCheck(!check);
            setAlerts(true, "success", res.data.message);

            setModalCentered(false);
            //  this.props.history.push("/")
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAlerts(true, "warning", "Please select a location");
    }
  };
  // insert End
  // edit Start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editServiceAreas, setEditServiceAreas] = useState([]);
  const editHandleInput = (e) => {
    e.persist();
    setEditServiceAreas({
      ...editServiceAreas,
      [e.target.name]: e.target.value,
    });
  };
  const fetchServiceArea = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editServiceAreas/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditServiceAreas(res.data.menu);
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateServiceArea = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", editServiceAreas.id);
    formData.append("deliveryFees", editServiceAreas.deliveryFees);
    formData.append(
      "areaLocationId",
      servicesAreaEdit.value
        ? servicesAreaEdit.value
        : editServiceAreas.areaLocationId
    );

    axios
      .post("/api/updateServiceAreas", formData)
      .then((res) => {
        if (res.data.status === 200) {
          // setEditServiceAreas([]);
          setCheck(!check);
          setAlerts(true, "success", res.data.message);

          setEditModalCentered(false);
          //  this.props.history.push("/")
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Edit End

  // delete Start
  const deleteServiceArea = (e, id) => {
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
          .delete(`/api/deleteServiceAreas/${id}`)
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

  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [areaLocation, setAreaLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getAreasBranch/${id}`);
      if (result.data.status === 200) {
        setAreaLocation(result.data.fetchData);
      }
      const response = await axios.get(`/api/getServiceAreas/${id}`);
      if (response.data.status === 200) {
        setFetchData(response.data.fetchData.data);
        let arrayData = [];
        response.data.fetchData.data?.map((val) => {
          return arrayData.push(val.areaName);
        });
      }
      setLoading(false);
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
  const [changeBit, setChangeBit] = useState(true);

  const loadAreas = async () => {
    try {
      const result = await axios.get(`/api/getAreasBranch/${id}`);
      if (result.data.status === 200) {
        setAreaLocation(result.data.fetchData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadAreas();
  }, [changeBit]);
  const [servicesAreas, setServicesAreas] = useState([]);
  const handleSelectEvent = (e) => {
    setServicesAreas(e);
  };
  const [servicesAreaEdit, setServicesAreaEdit] = useState([]);

  const handleSelectEventEdit = (e) => {
    setServicesAreaEdit(e);
  };
  const serviceAreaHandle = (e, id) => {
    let updatedList = servicesAreas.map((item) => {
      if (item.value == id) {
        return { ...item, deliveryFees: e.target.value }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });
    setServicesAreas(updatedList);
  };
  const initialValues = {
    areaName: "",
    city: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      areaName: Yup.string().required("Area Name is required"),
      city: Yup.string().required("Please select a Category"),
    });
  };
  const save = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    const formData = new FormData();
    formData.append("city_id", data.city);
    formData.append("areaName", data.areaName);
    axios
      .post("/api/insertAreas", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setChangeBit(!changeBit);
          setAreaModal(false);
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = (value) => {
    setValue("");
    setValue(value);
  };

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const loadOptions = (inputValue) => {
    return axios
      .get(`/api/getCities`, {
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id: inputValue,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
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
          {/* <td>{i + 1}</td> */}
          <td> {item.areaName}</td>
          <td> {item.deliveryFees}</td>
          <td>
            <div
              className="input-group"
              style={{
                display: "table" /* Instead of display:block */,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {checkPermission("service-areas-edit") && (
                <button
                  type="button"
                  onClick={(e) => fetchServiceArea(e, item.id)}
                  className="btn btn-outline-info btn-sm"
                >
                  {t("edit")}
                </button>
              )}
              &nbsp;
              {checkPermission("service-areas-delete") && (
                <button
                  type="button"
                  onClick={(e) => deleteServiceArea(e, item.id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  {t("delete")}
                </button>
              )}
            </div>
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
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade" size="lg" show={modalCentered}>
        <form onSubmit={saveServiceAreas}>
          <Modal.Header>
            <Modal.Title>{t("add_service_area")}</Modal.Title>
            <Button
              onClick={() => [setModalCentered(false), setServicesAreas([])]}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="row ">
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="form-group">
                  <div className="d-flex justify-content-between">
                    <label className="mb-1 ">
                      {" "}
                      <strong>{t("areas")}</strong>{" "}
                      <small>
                        (Please first choose the fields and then set the input
                        values.)
                      </small>
                    </label>
                    {checkPermission("areas-create") && (
                      <small
                        onClick={() => setAreaModal(true)}
                        style={{ cursor: "pointer" }}
                      >
                        {t("add_area")}
                      </small>
                    )}
                  </div>
                  <MySelect
                    options={areaLocation.map((o, i) => {
                      return { value: o.id, label: o.areaName };
                    })}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{ Option, MultiValue, animatedComponents }}
                    onChange={handleSelectEvent}
                    allowSelectAll={true}
                    value={servicesAreas}
                  />
                </div>
              </div>
            </div>
            {servicesAreas?.map((item, i) => {
              return (
                <div className="row m-1" key={i}>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                    <label className="mb-1 ">
                      <strong>{item.label}</strong>
                    </label>
                  </div>
                  <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                    <input
                      type="number"
                      min="0"
                      required
                      className="form-control"
                      placeholder="Delivery charges for this Area"
                      onChange={(e) => serviceAreaHandle(e, item.value)}
                      value={servicesAreas[i].areaName}
                    />
                  </div>
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => [setModalCentered(false), setServicesAreas([])]}
              variant="danger light"
            >
              {t("close")}
            </Button>
            <Button variant="primary" type="submit">
              {t("save")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal className="fade" show={areaModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={save}
        >
          {({ errors, status, setFieldValue, setFieldTouched, touched }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{t("add_area")}</Modal.Title>
                <Button
                  onClick={() => setAreaModal(false)}
                  variant=""
                  className="close"
                >
                  <span>&times;</span>
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    <strong>{t("city")}</strong>
                  </label>

                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    // value={selectedValue}
                    getOptionLabel={(e) => e.cityName}
                    getOptionValue={(e) => e.id}
                    loadOptions={loadOptions}
                    onInputChange={handleInputChange}
                    onChange={(getOptionValue) => {
                      setFieldValue("city", getOptionValue.id);
                    }}
                  />
                  {errors.city ? (
                    <small
                      className="invalid"
                      style={{ color: "red", marginTop: ".5rem" }}
                    >
                      {errors.city}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label>
                    <strong>{t("name")}</strong>
                  </label>
                  <Field
                    name="areaName"
                    type="text"
                    className="form-control "
                    placeholder="Area Name..."
                  />

                  <ErrorMessage
                    name="areaName"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setAreaModal(false)}
                  variant="danger light"
                >
                  {t("close")}
                </Button>
                <Button variant="primary" type="submit">
                  {t("save")}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <form onSubmit={updateServiceArea} method="POST">
          <Modal.Header>
            <Modal.Title>{t("edit_service_area")}</Modal.Title>

            <Button
              onClick={() => setEditModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("service_area")}</strong>{" "}
              </label>
              <Select
                defaultValue={{
                  value: editServiceAreas.areaLocationId,
                  label: editServiceAreas.areaName,
                }}
                options={areaLocation.map((o, i) => {
                  return { value: o.id, label: o.areaName };
                })}
                onChange={handleSelectEventEdit}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("delivery_fees")}</strong>{" "}
              </label>
              <input
                type="text"
                // min="0"
                onChange={editHandleInput}
                name="deliveryFees"
                required
                className="form-control"
                placeholder="Delivery charges for this Area"
                value={editServiceAreas.deliveryFees}
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
        </form>
      </Modal>
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("service_area")}</h4>
              </div>
              <div>
                <div className="input-group">
                  <Search
                    setFetchData={setFetchData}
                    url={"/api/searchServiceArea"}
                    id={id}
                    defaultUrl={`/api/getServiceAreas/${id}`}
                  />
                  {checkPermission("service-areas-create") && (
                    <Button
                      variant="primary"
                      type="button"
                      className="mb-2 mr-2"
                      onClick={() => setModalCentered(true)}
                    >
                      {t("add")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead className="table-light">
                    <tr>
                      {/* <th>{t("number")}</th> */}
                      <th>{t("service_area")}</th>
                      <th>{t("delivery_fees")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchData.length !== 0 ? (
                      viewProducts_HTMLTABLE
                    ) : (
                      <tr>
                        <td colSpan={3}> {t("noItemFound")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer border-0">
              <Paginate
                fetchData={fetchData}
                setFetchData={setFetchData}
                url={`/api/getServiceAreas/${id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ServiceArea;
