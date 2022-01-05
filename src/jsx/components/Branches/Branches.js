import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import swal from "sweetalert";
import QRCode from "qrcode.react";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
// import ReactWhatsapp from 'react-whatsapp';
// import FloatingWhatsApp from 'react-floating-whatsapp'
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Branches = () => {
  // localization
  const { t } = useTranslation();
  const initialValues = {
    BrancheName: "",
    currencyID: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      BrancheName: Yup.string().required("Branch Name is required"),
      currencyID: Yup.string().required("Currency is required"),
    });
  };
  // insert start
  const [modalCentered, setModalCentered] = useState(false);

  const saveBranch = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    const checkBranch = branchdata.every((item) => {
      return item.BrancheName !== data.BrancheName;
    });
    if (checkBranch) {
      axios.post("/api/InsertBranches", data).then((res) => {
        if (res.data.status === 200) {
          setModalCentered(false);
          setCheck(!check);
          swal("Success", res.data.message, "success");
        }
      });
    } else {
      swal(
        "warning",
        "The name already exists, please try another name.",
        "warning"
      );
    }
  };
  // insert end

  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);

  const [editBranchstate, setEditBranchstate] = useState([]);
  const editBranch = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditBranches/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditBranchstate(res.data.branch);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  const updateBranch = (data) => {
    // const checkBranch = branchdata.every((item) => {
    //   return item.BrancheName !== data.BrancheName;
    // });
    // console.log(checkBranch);
    // if (checkBranch) {
    axios.post("/api/UpdateBranches", data).then((res) => {
      if (res.data.status === 200) {
        setEditModalCentered(false);

        swal("Success", res.data.message, "success").then((done) => {
          if (done) {
            setEditBranchstate([]);
            setCheck(!check);
          }
        });
      }
    });
    // } else {
    //   swal(
    //     "warning",
    //     "The name already exists, please try another name.",
    //     "warning"
    //   );
    // }
  };
  // edit end
  // delete start
  const deleteBranch = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteBranches/${id}`).then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            // thisClicked.closest("tr").remove();
          } else if (res.data.status === 404) {
            swal("Success", res.data.message, "success");
          }
          setCheck(!check);
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  // delete end
  //for retriving data using laravel API
  const [branchdata, setBranchdata] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);

  // for mobile
  useEffect(() => {
    axios.get("/api/GetBranches").then((res) => {
      if (res.data.status === 200) {
        setBranchdata(res.data.branches);
      }
      setLoading(false);
    });
    axios.get("/api/GetCurrencies").then((res) => {
      if (res.data.status === 200) {
        setCurrency(res.data.fetchData);
      }
    });
  }, [check]);
  // for download QRCode

  const downloadQRCode = (e, id) => {
    e.preventDefault();
    // console.log(id)

    const qrCodeURL = document
      .getElementById(id)
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "Branch_QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };
  const [layout, setLayout] = useState(
    JSON.parse(
      localStorage.getItem("layoutBranch")
        ? localStorage.getItem("layoutBranch")
        : true
    )
  );
  const changeLayout = () => {
    setLayout(!layout);
    localStorage.setItem("layoutBranch", !layout);
  };

  var viewBranches_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewBranches_HTMLTABLE = branchdata.map((item, i) => {
      return (
        <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
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
                    size={180}
                    fgColor="#f50b65"
                    value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                      item.id
                    )}`}
                    className="primary"
                  />
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={(e) => downloadQRCode(e, btoa(item.id))}
                  >
                    {" "}
                    <p>{t("download_qr_code")}</p>
                  </div>
                  <h4> {item.BrancheName}</h4>
                </Link>
              </div>
            </div>
            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                <div className="col-6 pt-3 pb-3 border-right">
                  <Link to="" onClick={(e) => editBranch(e, item.id)}>
                    <span>{t("edit")}</span>
                  </Link>
                </div>
                <div className="col-6 pt-3 pb-3">
                  <Link to="" onClick={(e) => deleteBranch(e, item.id)}>
                    <span>{t("delete")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <Fragment>
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <CBreadcrumbItem active>{t("Branches")}</CBreadcrumbItem>
      </CBreadcrumb>

      {/* <PageTItle headingPara={t('Branches')} activeMenu={t('add_branch')} motherMenu={t('Branches')} /> */}
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("add_branch")}</Modal.Title>
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
          onSubmit={saveBranch}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("branch_name")}</label>
                  <Field
                    name="BrancheName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.BrancheName && touched.BrancheName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A unique name..."
                  />
                  <ErrorMessage
                    name="BrancheName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("currency")}</label>
                  <Field
                    as="select"
                    name="currencyID"
                    className={
                      "form-control" +
                      (errors.currencyID && touched.currencyID
                        ? " is-invalid"
                        : "")
                    }
                  >
                    <option value="">{t("select_currency")}</option> )
                    {currency.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.currency_name + " / " + item.currency_code}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="currencyID"
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
          <Modal.Title>{t("edit_branch")}</Modal.Title>
          <Button
            onClick={() => setEditModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
          initialValues={editBranchstate}
          validationSchema={validationSchema}
          onSubmit={updateBranch}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <div className="form-group">
                  <label> {t("branch_name")}</label>
                  <Field
                    name="BrancheName"
                    type="text"
                    className={
                      "form-control" +
                      (errors.BrancheName && touched.BrancheName
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="A unique name..."
                  />
                  <ErrorMessage
                    name="BrancheName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label> {t("currency")}</label>
                  <Field
                    as="select"
                    name="currencyID"
                    className={
                      "form-control" +
                      (errors.currencyID && touched.currencyID
                        ? " is-invalid"
                        : "")
                    }
                  >
                    <option value="">{t("select_currency")}</option> )
                    {currency.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.currency_name + " / " + item.currency_code}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="currencyID"
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
      <div className="row justify-content-end">
        <div className="col-1">
          <IconButton aria-label="Example" onClick={changeLayout}>
            {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
          </IconButton>
        </div>
      </div>

      {layout ? (
        <div className="row">
          {viewBranches_HTMLTABLE}
          <div className="col-xl-4 col-lg-6 col-sm-6 ">
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
                    {t("add_branch")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">{t("branches")}</h4>
                </div>
                <div className="dropdown">
                  <Button
                    variant="primary"
                    type="button"
                    className="mb-2 mr-2"
                    onClick={() => setModalCentered(true)}
                  >
                    {t("add_branch")}
                  </Button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead>
                      <tr className="card-title">
                        <th>{t("qr_code")}</th>
                        <th>{t("branch_name")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchdata.map((item, i) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <Link
                                to={{
                                  pathname: `/branches/show`,
                                  state: {
                                    id: item.id,
                                    BrancheName: item.BrancheName,
                                  },
                                }}
                              >
                                <QRCode
                                  id={btoa(item.id)}
                                  level={"H"}
                                  size={100}
                                  height="100px"
                                  fgColor="#f50b65"
                                  value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                                    item.id
                                  )}`}
                                  className="primary"
                                />
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) =>
                                    downloadQRCode(e, btoa(item.id))
                                  }
                                >
                                  <small>{t("download_qr_code")}</small>
                                </div>
                              </Link>
                            </td>
                            <td>
                              {" "}
                              <Link
                                to={{
                                  pathname: `/branches/show`,
                                  state: {
                                    id: item.id,
                                    BrancheName: item.BrancheName,
                                  },
                                }}
                              >
                                {" "}
                                {item.BrancheName}
                              </Link>
                            </td>

                            <td>
                              <button
                                type="button"
                                onClick={(e) => editBranch(e, item.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                {t("edit")}
                              </button>
                              &nbsp;&nbsp;&nbsp;
                              <button
                                type="button"
                                onClick={(e) => deleteBranch(e, item.id)}
                                className="btn btn-outline-warning btn-sm"
                              >
                                {t("delete")}
                              </button>
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
      )}
    </Fragment>
  );
};

export default Branches;
