import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import swal from "sweetalert";
import QRCode from "qrcode.react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CBreadcrumb,
  CDropdownMenu,
  CDropdown,
  CDropdownToggle,
  CBreadcrumbItem,
} from "@coreui/react";
// import ReactWhatsapp from 'react-whatsapp';
// import FloatingWhatsApp from 'react-floating-whatsapp'

const Branches = () => {
  // validation start
  const schema = yup
    .object()
    .shape({
      BrancheName: yup.string().required("This field is a required field"),
      currencyID: yup.string().required("This field is a required field"),
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

  // localization
  const { t } = useTranslation();

  // insert start
  const [modalCentered, setModalCentered] = useState(false);
  const [branchstate, setBranchstate] = useState([]);
  const handleInput = (e) => {
    e.preventDefault();
    setBranchstate({ ...branchstate, [e.target.name]: e.target.value });
  };
  const saveBranch = (e) => {
    // e.preventDefault();
    axios.post("/api/InsertBranches", branchstate).then((res) => {
      if (res.data.status === 200) {
        setBranchstate([]);
        reset();
        swal("Success", res.data.message, "success");
        setModalCentered(false);
      }
    });
  };
  // insert end

  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);

  const [editBranchstate, setEditBranchstate] = useState([]);
  const editHandleInput = (e) => {
    e.persist();
    setEditBranchstate({ ...editBranchstate, [e.target.name]: e.target.value });
  };
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
  const updateBranch = (e) => {
    e.preventDefault();
    console.log(editBranchstate);
    axios.post("/api/UpdateBranches", editBranchstate).then((res) => {
      if (res.data.status === 200) {
        setBranchdata([]);
        setEditBranchstate([]);
        swal("Success", res.data.message, "success");
        setEditModalCentered(false);
        //  this.props.history.push("/")
      }
    });
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
          setBranchstate([]);
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
  }, [branchstate]);
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
                  // to={`branches/category/${btoa(item.id)}`}
                  // // to={`/branches/show/${btoa(item.id)}`}
                  to={{
                    pathname: `/branches/show`,
                    state: { id: item.id, BrancheName: item.BrancheName },
                  }}
                  // to={{
                  //   pathname: `/branches/category`,
                  //   state: { id: item.id,BrancheName: item.BrancheName },
                  // }}
                >
                  <QRCode
                    id={btoa(item.id)}
                    level={"H"}
                    size={256}
                    fgColor="#f50b65"
                    value={`http://192.168.1.103:3000/show-branch-details/${btoa(
                      item.id
                    )}`}
                    className="primary"
                  />
                  <Link to="" onClick={(e) => downloadQRCode(e, btoa(item.id))}>
                    {" "}
                    <p>{t("download_qr_code")}</p>
                  </Link>
                  <h3 className="mt-4 mb-1"> {item.BrancheName}</h3>
                </Link>
                <CDropdown variant="btn-group">
                  {/* <CButton color="primary" size="sm"></CButton> */}
                  <CDropdownToggle
                    color="primary"
                    size="lg"
                    split
                    shape="rounded"
                    caret={false}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-three-dots"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <div className="mx-3 my-2">
                      <Link to="" onClick={(e) => editBranch(e, item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                        <span> {t("edit")}</span>
                      </Link>
                    </div>
                    <div className="mx-3 my-2">
                      <Link to="" onClick={(e) => deleteBranch(e, item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                        <span> {t("delete")}</span>
                      </Link>
                    </div>
                  </CDropdownMenu>
                </CDropdown>
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
        <Form onSubmit={handleSubmit(saveBranch)} method="POST">
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("branch_name")}</strong>{" "}
              </label>
              <input
                type="text"
                {...register("BrancheName")}
                className={
                  errors.BrancheName?.message
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                placeholder={t("branch_name")}
                name="BrancheName"
                onChange={handleInput}
                value={branchstate.BrancheName}
              />
              {errors.BrancheName?.message && (
                <div className="invalid-feedback">
                  {errors.BrancheName?.message}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("currency")}</strong>{" "}
              </label>
              <select
                type="text"
                {...register("currencyID")}
                className={
                  errors.currencyID?.message
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                placeholder="currencyID"
                name="currencyID"
                onChange={handleInput}
                value={branchstate.currencyID}
              >
                <option value="">{t("select_currency")}</option> )
                {currency.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.currency_name + " / " + item.currency_code}
                  </option>
                ))}
              </select>
              {errors.currencyID?.message && (
                <div className="invalid-feedback">
                  {errors.currencyID?.message}
                </div>
              )}
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
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Form onSubmit={updateBranch} method="POST">
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("id")}</strong>{" "}
              </label>
              <input
                type="text"
                disabled="disabled"
                className="form-control"
                // placeholder="Branch Name"
                name="id"
                required
                onChange={editHandleInput}
                value={editBranchstate.id}
              />
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("branch_name")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("branch_name")}
                name="BrancheName"
                required
                onChange={editHandleInput}
                value={editBranchstate.BrancheName}
              />
            </div>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("currency")}</strong>{" "}
              </label>
              <select
                type="text"
                className="form-control"
                placeholder="currencyID"
                name="currencyID"
                required
                onChange={editHandleInput}
                value={editBranchstate.currencyID}
              >
                <option value="">{t("select_currency")}</option> )
                {currency.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.currency_name + " / " + item.currency_code}
                  </option>
                ))}
              </select>
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
      <div className="row">
        {viewBranches_HTMLTABLE}
        <div className="col-xl-4 col-lg-6 col-sm-6 ">
          <div className="card overflow-hidden ">
            <div
              className="card-body d-flex justify-content-center text-center"
              style={{ border: "2px dashed red" }}
            >
              <div className="align-self-center text-center">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setModalCentered(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  {t("add_branch")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="App">
                <FloatingWhatsApp
                    phoneNumber="93744647067"
                    accountName="Mohammad Faiq"
                    allowClickAway
                    // notification
                    // notificationDelay={60000} // 1 minute
                    // notificationSound
                />
            </div> */}
    </Fragment>
  );
};

export default Branches;
