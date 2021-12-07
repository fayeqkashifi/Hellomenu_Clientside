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
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
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
        // console.log(res.data.status);
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
  const [visible, setVisible] = useState(false);
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
  }, [branchstate, editBranchstate]);
  // to display public link inside phone
  const [destinationLink, setDestinationLink] = useState("");
  const phone = (e, srcLink) => {
    e.preventDefault();
    setDestinationLink(srcLink);
    setVisible(true);
  };

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
                    {/* <div className="mx-3 my-2">
                      <Link
                        to=""
                        data-toggle="tooltip"
                        data-placement="right"
                        title="To perview on mobile click this."
                        onClick={(e) =>
                          phone(
                            e,
                            `/standard-template/${btoa(item.id)}`
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-phone-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
                        </svg>
                        <span> {t("preview")}</span>
                      </Link>
                    </div>

                    <div className="mx-3 my-2">
                      <Link
                        to={{
                          pathname: `/branches/service-area`,
                          state: { id: item.id, BrancheName: item.BrancheName },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bounding-box"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 2V0H0v5h2v6H0v5h5v-2h6v2h5v-5h-2V5h2V0h-5v2H5zm6 1v2h2v6h-2v2H5v-2H3V5h2V3h6zm1-2h3v3h-3V1zm3 11v3h-3v-3h3zM4 15H1v-3h3v3zM1 4V1h3v3H1z" />
                        </svg>
                        <span> {t("services")}</span>
                      </Link>
                    </div>
                    <div className="mx-3 my-2">
                      <Link
                        to={{
                          pathname: `/branches/unit`,
                          state: { id: item.id, BrancheName: item.BrancheName },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-border-style"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4-4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1z" />
                        </svg>
                        <span> {t("units")}</span>
                      </Link>
                    </div>

                    <div className="mx-3 my-2">
                      <Link
                        to={{
                          pathname: `/branches/inventory`,
                          state: { id: item.id, BrancheName: item.BrancheName },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-stack-overflow"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.412 14.572V10.29h1.428V16H1v-5.71h1.428v4.282h9.984z" />
                          <path d="M3.857 13.145h7.137v-1.428H3.857v1.428zM10.254 0 9.108.852l4.26 5.727 1.146-.852L10.254 0zm-3.54 3.377 5.484 4.567.913-1.097L7.627 2.28l-.914 1.097zM4.922 6.55l6.47 3.013.603-1.294-6.47-3.013-.603 1.294zm-.925 3.344 6.985 1.469.294-1.398-6.985-1.468-.294 1.397z" />
                        </svg>
                        <span> {t("inventory")}</span>
                      </Link>
                    </div>
                    <div className="mx-3 my-2">
                      <Link
                        to={{
                          pathname: `/branches/tables`,
                          state: { id: item.id, BrancheName: item.BrancheName },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-tablet"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                        <span> {t("tables")}</span>
                      </Link>
                    </div>
                    <span className="mx-3 my-2">
                      <Link
                        to={`/standard-template/${btoa(item.id)}`}
                        // to={`/dark-template/${btoa(item.id)}`}
                        target="_blank"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-square-dotted"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                        <span> {t("public_link")} </span>
                      </Link>
                    </span>
                    <span className="mx-3 my-2">
                      <Link
                        // to={`show-branch-details/${btoa(item.id)}`}
                        to={`branches/design/${btoa(item.id)}`}
                      >
                        <i className="flaticon-381-notepad"></i>

                        <span> {t("design")} </span>
                      </Link>
                    </span> */}
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

      {/* <CButton onClick={() =>}>Toggle offcanvas</CButton> */}
      <COffcanvas
        placement="end"
        className="fade bd-example-modal-lg"
        scroll
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>{t("display_mobile")}</COffcanvasTitle>
          <CCloseButton
            className="text-reset"
            onClick={() => setVisible(false)}
          />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div className="wrapper">
            <div className="iphone">
              <div className="power"></div>
              <div className="lock"></div>
              <div className="volume up"></div>
              <div className="volume down"></div>
              <div className="camera"></div>
              <div className="speaker"></div>
              <div className="screen">
                <iframe
                  src={destinationLink}
                  height="100%"
                  width="100%"
                  title="Devices"
                ></iframe>
              </div>
              <div className="button">
                <div className="square"></div>
              </div>
            </div>
          </div>
        </COffcanvasBody>
      </COffcanvas>
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
