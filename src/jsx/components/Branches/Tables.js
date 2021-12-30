import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as yup from "yup";
import QRCode from "qrcode.react";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
const Tables = (props) => {
  // validation start
  const schema = yup
    .object()
    .shape({
      tableId: yup.string().required("This field is a required field"),
      tableName: yup.string().required("This field is a required field"),
    })
    .required();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // validation end

  // for localization
  const { t } = useTranslation();
  // ID
  const id = props.history.location.state.id;
  const [check, setCheck] = useState(true);

  // insert modal
  const [modalCentered, setModalCentered] = useState(false);
  const [tableInsert, setTableInsert] = useState({
    tableId: "",
    tableName: "",
    branchId: id,
  });
  const handleInput = (e) => {
    e.persist();
    setTableInsert({ ...tableInsert, [e.target.name]: e.target.value });
  };
  const saveTable = (e) => {
    // e.preventDefault();
    axios.post("/api/InsertTable", tableInsert).then((res) => {
      if (res.data.status === 200) {
        setTableInsert({
          tableId: "",
          tableName: "",
          branchId: id,
        });
        reset();
        setCheck(!check);
        swal("Success", res.data.message, "success");
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
  };
  // insert end

  // edit modal
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editTable, setEditTable] = useState({
    tableId: "",
    tableName: "",
    branchId: id,
  });
  const editHandleInput = (e) => {
    e.persist();
    setEditTable({ ...editTable, [e.target.name]: e.target.value });
  };
  const fetchTable = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditTable/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditTable(res.data.Details);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  const updateTable = (e) => {
    e.preventDefault();
    axios.post("/api/UpdateTable", editTable).then((res) => {
      if (res.data.status === 200) {
        setEditTable({
          tableId: "",
          tableName: "",
          branchId: id,
        });
        swal("Success", res.data.message, "success");
        setEditModalCentered(false);
        setCheck(!check);

        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // edit end
  // delete section
  const deleteTable = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteTable/${id}`).then((res) => {
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
  // delete end
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`/api/GetTables/${id}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.fetchData);
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [check]);
  // download QRcode
  const downloadQRCode = (e, id) => {
    e.preventDefault();
    // console.log(id)

    const qrCodeURL = document
      .getElementById(id)
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "Table_QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };
  const [layout, setLayout] = useState(true);
  const changeLayout = () => {
    setLayout(!layout);
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
          <td>
            <QRCode
              id={btoa(item.id)}
              level={"H"}
              size={256}
              fgColor="#f50b65"
              value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                item.id
              )}`}
              className="primary d-none"
            />
            <div
              style={{ cursor: "pointer" }}
              onClick={(e) => downloadQRCode(e, btoa(item.id))}
            >
              {t("download_qr_code")}
            </div>
          </td>
          <td>
            <button
              type="button"
              onClick={(e) => fetchTable(e, item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              {t("edit")}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              onClick={(e) => deleteTable(e, item.id)}
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
      <Modal className="fade" show={modalCentered}>
        <Form
          onSubmit={handleSubmit(saveTable)}
          method="POST"
          encType="multipart/form-data"
        >
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("table_id")} </strong>{" "}
              </label>
              <input
                type="text"
                {...register("tableId")}
                className={
                  errors.tableId?.message
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                placeholder={t("table_id")}
                name="tableId"
                onChange={handleInput}
                value={tableInsert.tableId}
              />
              {errors.tableId?.message && (
                <div className="invalid-feedback">
                  {errors.tableId?.message}
                </div>
              )}
              {/* <div className="text-danger">
                                {errors.name?.message}
                            </div> */}
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("table_name")} </strong>{" "}
              </label>
              <input
                type="text"
                {...register("tableName")}
                className={
                  errors.tableName?.message
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                placeholder={t("table_name")}
                name="tableName"
                onChange={handleInput}
                value={tableInsert.tableName}
              />
              {errors.tableName?.message && (
                <div className="invalid-feedback">
                  {errors.tableName?.message}
                </div>
              )}
              {/* <div className="text-danger">
                                {errors.value?.message}
                            </div> */}
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
              {t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Form onSubmit={updateTable} method="POST">
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
          <Modal.Body>
            <div className="form-group text-center">
              <QRCode
                level={"H"}
                size={256}
                fgColor="#f50b65"
                value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                  editTable.tableId
                )}`}
              />
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("table_id")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("table_id")}
                name="tableId"
                required
                onChange={editHandleInput}
                value={editTable.tableId}
              />
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("table_name")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("table_name")}
                name="tableName"
                required
                onChange={editHandleInput}
                value={editTable.tableName}
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
      </Modal>
      <div className="row justify-content-end">
        <div className="col-1">
          <IconButton aria-label="Example" onClick={changeLayout}>
            {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
          </IconButton>
        </div>
      </div>
      {layout ? (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">{t("tables")}</h4>
                </div>
                <div className="dropdown">
                  <Button
                    variant="primary"
                    type="button"
                    className="mb-2 mr-2"
                    onClick={() => setModalCentered(true)}
                  >
                    {t("add_table")}
                  </Button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead>
                      <tr className="card-title">
                        {/* <th>{t('number')}</th> */}
                        <th>{t("table_id")}</th>
                        <th>{t("table_name")}</th>
                        <th>{t("download")}</th>
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
      ) : (
        <div className="row">
          {fetchData.map((item, i) => {
            return (
              <div className="col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                <div className="card overflow-hidden">
                  <div className="card-body">
                    <div className="text-center">
                      <Link
                        to={{
                          pathname: `/branches/show`,
                          state: { id: item.id, BrancheName: item.BrancheName },
                        }}
                      >
                        <QRCode
                          id={btoa(item.id)}
                          level={"H"}
                          size={128}
                          fgColor="#f50b65"
                          value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                            item.id
                          )}`}
                          className="primary "
                        />
                        <div
                          onClick={(e) => downloadQRCode(e, btoa(item.id))}
                          style={{ cursor: "pointer" }}
                        >
                          {" "}
                          {t("download_qr_code")}
                        </div>

                        <h6> {item.tableId}</h6>
                        <h4> {item.tableName}</h4>
                      </Link>
                    </div>
                  </div>
                  <div className="card-footer pt-0 pb-0 text-center">
                    <div className="row">
                      <div className="col-6 pt-3 pb-3 border-right">
                        <Link to="" onClick={(e) => fetchTable(e, item.id)}>
                          <span>{t("edit")}</span>
                        </Link>
                      </div>
                      <div className="col-6 pt-3 pb-3">
                        <Link to="" onClick={(e) => deleteTable(e, item.id)}>
                          <span>{t("delete")}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
        </div>
      )}
    </Fragment>
  );
};

export default Tables;
