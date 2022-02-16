import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import swal from "sweetalert";
import QRCode from "qrcode.react";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import CustomAlert from "../CustomAlert";
import "yup-phone";
import { base_url, port } from "../../../Consts";

const Branches = () => {
  const { t } = useTranslation();
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
  const [branchdata, setBranchdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/GetBranches");
      if (result.data.status === 200) {
        setBranchdata(result.data.branches);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  // for mobile
  useEffect(() => {
    dataLoad();
    return () => {
      setBranchdata([]);
      setLoading(true);
    };
  }, [check]);

  const downloadQRCode = (e, id) => {
    e.preventDefault();
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
        <div className="col-xl-3 col-md-4 col-lg-6 col-sm-6" key={item.id}>
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
                    value={`http://${base_url}:${port}/public/${btoa(item.id)}`}
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
                  <Link
                    to={{
                      pathname: `/branches/edit-branch`,
                      state: { id: item.id },
                    }}
                    // onClick={(e) => editBranch(e, item.id)}
                  >
                    <span>{t("edit")}</span>
                  </Link>
                </div>
                <div className="col-6 pt-3 pb-3">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={(e) => deleteBranch(e, item.id)}
                  >
                    <span>{t("delete")}</span>
                  </div>
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
        <CBreadcrumbItem active>{t("Branches")}</CBreadcrumbItem>
      </CBreadcrumb>
      <div className="d-flex justify-content-end">
        <IconButton aria-label="Example" onClick={changeLayout}>
          {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
        </IconButton>
      </div>
      {layout ? (
        <div className="row">
          {viewBranches_HTMLTABLE}
          <div className="col-xl-3 col-lg-6 col-md-4 col-sm-6">
            <div className="card overflow-hidden ">
              <div
                className="card-body d-flex justify-content-center text-center"
                style={{ border: "2px dashed #f50b65" }}
              >
                <div className="align-self-center text-center">
                  <Link
                    to={`/branches/add-branch`}
                    className="btn btn-outline-primary"
                  >
                    <AddIcon />
                    {t("add_branch")}
                  </Link>
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
                  <Link className="btn btn-primary" to={`/branches/add-branch`}>
                    {t("add_branch")}
                  </Link>
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
                              <Link
                                to={{
                                  pathname: `/branches/edit-branch`,
                                  state: { id: item.id },
                                }}
                                // onClick={(e) => editBranch(e, item.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                {t("edit")}
                              </Link>
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
