import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import CustomAlert from "../CustomAlert";
import "yup-phone";
import { base_url, port } from "../../../Consts";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Swal from "sweetalert2";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";
import Tooltip from "@mui/material/Tooltip";

const Branches = () => {
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
          .delete(`/api/deleteBranches/${id}`)
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
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getBranches");
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData.data);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // for mobile
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
    viewBranches_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <div className="col-xl-3 col-md-4 col-lg-6 col-sm-6" key={item.id}>
          <div className="card overflow-hidden">
            <div className="card-body ">
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
                {checkPermission("branches-edit") && (
                  <div className="col-4 py-3 border-right">
                    <Link
                      to={{
                        pathname: `/branches/story-branch`,
                        state: { id: item.id },
                      }}
                    >
                      <span>{t("stories")}</span>
                    </Link>
                  </div>
                )}
                {checkPermission("branches-edit") && (
                  <div className="col-4 py-3 border-right">
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
                )}
                {checkPermission("branches-delete") && (
                  <div className="col-4 py-3 ">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={(e) => deleteBranch(e, item.id)}
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
            {t("branches")}
          </div>
          <div>
            <div className="input-group">
              <div className="d-flex align-items-center justify-content-center ">
                <Search
                  setFetchData={setFetchData}
                  url={"/api/searchBranch"}
                  defaultUrl={"/api/getBranches"}
                />
              </div>

              {checkPermission("branches-create") && (
                <Tooltip title="Add New">
                  <IconButton aria-label="Example">
                    <Link to={`/branches/add-branch`}>
                      <AddIcon />
                    </Link>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Layout">
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
          {fetchData.length !== 0 ? (
            viewBranches_HTMLTABLE
          ) : (
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
              {t("noItemFound")}
            </div>
          )}
          {checkPermission("branches-create") && (
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
          )}

          <Paginate
            fetchData={fetchData}
            setFetchData={setFetchData}
            url={"/api/getBranches"}
          />
        </div>
      ) : (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead className="table-light">
                      <tr className="card-title">
                        <th>{t("qr_code")}</th>
                        <th>{t("branch_name")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchData.length !== 0 ? (
                        fetchData.map((item, i) => {
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
                                    value={`http://${base_url}:${port}/public/${btoa(
                                      btoa(btoa(item.id))
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
                                <div
                                  className="input-group"
                                  style={{
                                    display:
                                      "table" /* Instead of display:block */,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                  }}
                                >
                                  {checkPermission("branches-edit") && (
                                    <Link
                                      to={{
                                        pathname: `/branches/edit-branch`,
                                        state: { id: item.id },
                                      }}
                                      className="btn btn-outline-info btn-sm"
                                    >
                                      {t("edit")}
                                    </Link>
                                  )}
                                  &nbsp;
                                  {checkPermission("branches-delete") && (
                                    <button
                                      type="button"
                                      onClick={(e) => deleteBranch(e, item.id)}
                                      className="btn btn-outline-danger btn-sm"
                                    >
                                      {t("delete")}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                  url={"/api/getBranches"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Branches;
