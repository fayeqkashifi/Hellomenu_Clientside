import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
const ServiceArea = (props) => {
  // for localization
  const { t } = useTranslation();
  //ID
  const id = props.history.location.state.id;

  // insert Start
  const [modalCentered, setModalCentered] = useState(false);
  const [areaModal, setAreaModal] = useState(false);

  const saveServiceAreas = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("BranchID", id);
    formData.append("AreaName", JSON.stringify(servicesAreas));
    axios.post("/api/InsertServicAreas", formData).then((res) => {
      if (res.data.status === 200) {
        setServicesAreas([]);
        setCheck(!check);

        swal("Success", res.data.message, "success");
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
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
    axios.get(`/api/EditServiceAreas/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditServiceAreas(res.data.menu);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
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

    axios.post("/api/UpdateServiceAreas", formData).then((res) => {
      if (res.data.status === 200) {
        // setEditServiceAreas([]);
        setCheck(!check);

        swal("Success", res.data.message, "success");
        setEditModalCentered(false);
        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // Edit End

  // delete Start
  const deleteServiceArea = (e, id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteServiceAreas/${id}`).then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            setCheck(!check);
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  // delete End

  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [areaLocation, setAreaLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    axios.get(`/api/GetAreas`).then((res) => {
      if (res.data.status === 200) {
        setAreaLocation(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
    });
    axios.get(`/api/GetServiceAreas/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
        // console.log(res.data.fetchData);
        // setAreaLocation(
        //   areaLocation.filter((item) => {
        //     return fetchData.map((set) => {
        //       return item.areaName == set.areaName;
        //     });
        //   })
        // );
      }
      setLoading(false);
    });
  }, [check]);
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
  };
  const validationSchema = () => {
    return Yup.object().shape({
      areaName: Yup.string().required("Area Name is required"),
    });
  };
  const save = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    axios.post("/api/InsertAreas", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setAreaModal(false);
      }
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
          <td>{i + 1}</td>

          <td> {item.areaName}</td>
          <td> {item.deliveryFees}</td>
          <td>
            <button
              type="button"
              onClick={(e) => fetchServiceArea(e, item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              {t("edit")}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              onClick={(e) => deleteServiceArea(e, item.id)}
              className="btn btn-outline-warning btn-sm"
            >
              {t("delete")}
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <Fragment>
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
                    <small
                      onClick={() => setAreaModal(true)}
                      style={{ cursor: "pointer" }}
                    >
                      {t("add_area")}
                    </small>
                  </div>
                  <Select
                    isMulti
                    options={areaLocation.map((o, i) => {
                      return { value: o.id, label: o.areaName };
                    })}
                    onChange={handleSelectEvent}
                    required
                    className="basic-multi-select"
                    classNamePrefix="select"
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
                      type="text"
                      // min="0"
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
                <label> {t("name")} </label>
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
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add_service_area")}
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table ">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("service_area")}</th>
                      <th>{t("delivery_fees")}</th>
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

export default ServiceArea;
