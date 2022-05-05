import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import QRCode from "qrcode.react";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";

const Tables = (props) => {
  const id = props.history.location.state.id;
  // validation start
  const initialValues = {
    tableId: "",
    tableName: "",
    numberOfSeats: "",
    branchId: id,
  };
  const validationSchema = () => {
    return Yup.object().shape({
      tableId: Yup.string().required("Table Number is required"),
      numberOfSeats: Yup.number()
        .integer()
        .required("Number Of Seats is required")
        .min(1, "Please add greater than 1"),
      // tableName: Yup.string().required("Table Name is required"),
    });
  };
  // validation end

  const [check, setCheck] = useState(true);

  // insert modal
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
  const saveTable = (data) => {
    // e.preventDefault();
    axios
      .post("/api/insertTable", data)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
          setModalCentered(false);
          //  this.props.history.push("/")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // insert end

  // edit modal
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editTable, setEditTable] = useState({
    tableId: "",
    tableName: "",
    numberOfSeats: "",
    branchId: id,
  });

  const fetchTable = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editTable/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditTable(res.data.Details);
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateTable = (data) => {
    axios
      .post("/api/updateTable", data)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);

          setEditModalCentered(false);
          setCheck(!check);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // edit end
  // delete section
  const deleteTable = (e, id) => {
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
          .delete(`/api/deleteTable/${id}`)
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
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = () => {
    try {
      axios.get(`/api/getTables/${id}`).then((result) => {
        if (result.data.status === 200) {
          setFetchData(result.data.fetchData.data);
          setLoading(false);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      });
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
  const downloadAll = (e) => {
    e.preventDefault();

    fetchData.map((item, i) => downloadQRCode(e, btoa(item.id), item.tableId));
  };
  // download QRcode
  const downloadQRCode = (e, id, tableId) => {
    e.preventDefault();
    const qrCodeURL = document
      .getElementById(id)
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = tableId + ".png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };
  const [layout, setLayout] = useState(
    JSON.parse(
      localStorage.getItem("layoutTables")
        ? localStorage.getItem("layoutTables")
        : true
    )
  );
  const changeLayout = () => {
    setLayout(!layout);
    localStorage.setItem("layoutTables", !layout);
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
          <td> {item.tableId}</td>
          <td> {item.tableName}</td>
          <td> {item.numberOfSeats}</td>
          <td>
            <div>
              <QRCode
                id={btoa(item.id)}
                level={"H"}
                size={256}
                fgColor="#f50b65"
                value={item.tableId}
                className="primary d-none "
              />
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={(e) => downloadQRCode(e, btoa(item.id), item.tableId)}
            >
              {t("download_qr_code")}
            </div>
          </td>
          <td>
            <div
              className="input-group"
              style={{
                display: "table" /* Instead of display:block */,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {checkPermission("tables-edit") && (
                <button
                  type="button"
                  onClick={(e) => fetchTable(e, item.id)}
                  className="btn btn-outline-info btn-sm"
                >
                  {t("edit")}
                </button>
              )}
              &nbsp;
              {checkPermission("tables-delete") && (
                <button
                  type="button"
                  onClick={(e) => deleteTable(e, item.id)}
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

      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_table")}</Modal.Title>
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={saveTable}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("table_number")}</label>
                  <Field
                    name="tableId"
                    type="text"
                    className={
                      "form-control" +
                      (errors.tableId && touched.tableId ? " is-invalid" : "")
                    }
                    placeholder="Number...."
                  />
                  <ErrorMessage
                    name="tableId"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("table_name")}</label>
                  <Field
                    name="tableName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.tableName && touched.tableName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A name for table..."
                  />
                  <ErrorMessage
                    name="tableName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("number_of_seats")}</label>
                  <Field
                    name="numberOfSeats"
                    type="Number"
                    className={
                      "form-control" +
                      (errors.numberOfSeats && touched.numberOfSeats
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A Number..."
                  />
                  <ErrorMessage
                    name="numberOfSeats"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
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
            </Form>
          )}
        </Formik>
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Modal.Header>
          <Modal.Title>{t("edit_table")} </Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editTable}
          validationSchema={validationSchema}
          onSubmit={updateTable}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group text-center">
                  <QRCode
                    level={"H"}
                    size={128}
                    fgColor="#f50b65"
                    value={editTable.tableId}
                  />
                </div>
                <div className="form-group">
                  <label> {t("table_number")}</label>
                  <Field
                    name="tableId"
                    type="text"
                    className={
                      "form-control" +
                      (errors.tableId && touched.tableId ? " is-invalid" : "")
                    }
                    placeholder="Number...."
                  />
                  <ErrorMessage
                    name="tableId"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("table_name")}</label>
                  <Field
                    name="tableName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.tableName && touched.tableName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A name for table..."
                  />
                  <ErrorMessage
                    name="tableName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("number_of_seats")}</label>
                  <Field
                    name="numberOfSeats"
                    type="Number"
                    className={
                      "form-control" +
                      (errors.numberOfSeats && touched.numberOfSeats
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A Number..."
                  />
                  <ErrorMessage
                    name="numberOfSeats"
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
                  {t("save")}{" "}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <div
        className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mb-2"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <div className="d-flex justify-content-between">
          <div
            className="d-flex align-items-center justify-content-center "
            style={{
              backgroundColor: "#f5f5f5",
              fontSize: "16px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {t("tables")}
          </div>
          <div>
            <div className="input-group">
              <Search
                setFetchData={setFetchData}
                url={"/api/searchTable"}
                id={id}
                defaultUrl={`/api/getTables/${id}`}
              />
              {checkPermission("tables-create") && (
                <Tooltip title="Add New">
                  <IconButton
                    aria-label="Example"
                    onClick={() => setModalCentered(true)}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Download All">
                <IconButton
                  aria-label="Example"
                  onClick={(e) => downloadAll(e)}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change Layout">
                <IconButton aria-label="Example" onClick={changeLayout}>
                  {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {layout ? (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead className="table-light">
                      <tr className="card-title">
                        {/* <th>{t('number')}</th> */}
                        <th>{t("table_number")}</th>
                        <th>{t("table_name")}</th>
                        <th>{t("number_of_seats")}</th>
                        <th>{t("download")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchData.length !== 0 ? (
                        viewProducts_HTMLTABLE
                      ) : (
                        <tr>
                          <td colSpan={5}> {t("noItemFound")}</td>
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
                  url={`/api/getTables/${id}`}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {fetchData.length !== 0 ? (
            fetchData.map((item, i) => {
              return (
                <div className="col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                  <div className="card overflow-hidden">
                    <div className="card-body">
                      <div className="text-center">
                        <QRCode
                          id={btoa(item.id)}
                          level={"H"}
                          size={128}
                          fgColor="#f50b65"
                          value={item.tableId}
                          className="primary "
                        />
                        <div
                          onClick={(e) => downloadQRCode(e, btoa(item.id))}
                          style={{ cursor: "pointer" }}
                        >
                          {" "}
                          {t("download_qr_code")}
                        </div>

                        <h4> {item.tableName}</h4>
                        <h6> {item.tableId}</h6>
                        <h6> {item.numberOfSeats}</h6>
                      </div>
                    </div>
                    <div className="card-footer pt-0 pb-0 text-center">
                      <div className="row">
                        {checkPermission("tables-edit") && (
                          <div className="col-6 pt-3 pb-3 border-right">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => fetchTable(e, item.id)}
                            >
                              <span>{t("edit")}</span>
                            </div>
                          </div>
                        )}
                        {checkPermission("tables-delete") && (
                          <div className="col-6 pt-3 pb-3">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => deleteTable(e, item.id)}
                            >
                              <span>{t("delete")}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
              {t("noItemFound")}
            </div>
          )}
          {checkPermission("tables-create") && (
            <div className="col-xl-3 col-lg-4 col-sm-6 ">
              <div className="card overflow-hidden ">
                <div
                  className="card-body d-flex justify-content-center text-center"
                  style={{ border: "2px dashed #f50b65" }}
                >
                  <div className="align-self-center text-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setModalCentered(true)}
                    >
                      <AddIcon />
                      {t("add_table")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Paginate
            fetchData={fetchData}
            setFetchData={setFetchData}
            url={`/api/getTables/${id}`}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Tables;
