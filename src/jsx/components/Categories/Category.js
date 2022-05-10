import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { base_url, port } from "../../../Consts";
/// Bootstrap
import { Row } from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DefaultPic from "../../../images/hellomenu/category.svg";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";
import Backdrop from "@mui/material/Backdrop";
import ButtonGroup from "@mui/material/ButtonGroup";
import CustomAlert from "../CustomAlert";
import Paginate from "../Common/Paginate";
import Search from "../Common/Search";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Tooltip from "@mui/material/Tooltip";
import AddCategory from "./Cates/AddCategory";
import EditCategory from "./Cates/EditCategory";
import AddSharedCategory from "./Cates/AddSharedCategory";

const Category = (props) => {
  const { url } = useRouteMatch();
  // ID
  const id = props.history.location.state.id;
  const [check, setCheck] = useState(true);
  const [modal, setModal] = useState(false);
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

  const [lang, setLang] = useState([]);

  // edit start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editCate, setEditCate] = useState({
    CategoryName: "",
    CategoryIcon: "",
    branchID: id,
  });
  const fetchMenus = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editCategories/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEditCate(res.data.menu);
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // edit end

  // delete start
  const deleteMenu = (e, id) => {
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
          .delete(`/api/deleteCategories/${id}`)
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
      axios.get(`/api/getCategories/${id}`).then((cat) => {
        if (cat.data.status === 200) {
          setFetchData(cat.data.fetchData.data);
          setLoading(false);
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
  const [layout, setLayout] = useState(
    JSON.parse(
      localStorage.getItem("layoutCategory")
        ? localStorage.getItem("layoutCategory")
        : true
    )
  );
  const changeLayout = () => {
    setLayout(!layout);
    localStorage.setItem("layoutCategory", !layout);
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
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
        <div className="col-xl-3 col-lg-3 col-sm-6 col-md-3" key={i}>
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="text-center">
                <Link
                  to={{
                    pathname: `${url}/sub-category`,
                    state: {
                      id: id,
                      sub_id: item.id,
                      CategoryName: item.CategoryName,
                    },
                  }}
                >
                  <span>
                    <img
                      style={{
                        height: "150px",
                        width: "100%",
                        borderRadius: "20px",
                        objectFit: "contain",
                      }}
                      src={
                        item.CategoryIcon
                          ? `http://${base_url}:${port}/images/catagories/${item.CategoryIcon}`
                          : DefaultPic
                      }
                      alt="category"
                    />
                  </span>
                  <h4 className="mt-2">{item.CategoryName}</h4>
                </Link>
                {item.isShared ? (
                  <Link
                    to={{
                      pathname: `${url}/cat-shared`,
                      state: {
                        id: id,
                        sub_id: item.id,
                      },
                    }}
                  >
                    Shared
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                {checkPermission("categories-edit") && (
                  <div className="col-6 pt-3 pb-3 border-right">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={(e) => fetchMenus(e, item.id)}
                    >
                      <span>{t("edit")}</span>
                    </div>
                  </div>
                )}
                {checkPermission("categories-delete") && (
                  <div className="col-6 pt-3 pb-3">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={(e) => deleteMenu(e, item.id)}
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
      {modal && (
        <AddSharedCategory
          modal={modal}
          setModal={setModal}
          check={check}
          setCheck={setCheck}
          id={id}
          setAlerts={setAlerts}
        />
      )}
      {modalCentered && (
        <AddCategory
          modalCentered={modalCentered}
          setModalCentered={setModalCentered}
          lang={lang}
          setLang={setLang}
          fetchData={fetchData}
          check={check}
          setCheck={setCheck}
          id={id}
          setAlerts={setAlerts}
        />
      )}
      {editmodalCentered && (
        <EditCategory
          editmodalCentered={editmodalCentered}
          setEditModalCentered={setEditModalCentered}
          lang={lang}
          setLang={setLang}
          editCate={editCate}
          setEditCate={setEditCate}
          id={id}
          check={check}
          setCheck={setCheck}
          setAlerts={setAlerts}
        />
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
            {t("categories")}
          </div>
          <div>
            <div className="input-group">
              <Search
                setFetchData={setFetchData}
                url={"/api/searchCategory"}
                id={id}
                defaultUrl={`/api/getCategories/${id}`}
              />
              {checkPermission("categories-create") && (
                <Tooltip title="Add New">
                  <IconButton aria-label="Example" onClick={handleToggle}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Change Layout">
                <IconButton aria-label="Example" onClick={changeLayout}>
                  {layout ? <TableRowsIcon /> : <ViewComfyIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => setModalCentered(true)} className="m-2">
              {" "}
              {t("add_new_category")}
            </Button>
            <Button className="m-2" onClick={() => setModal(true)}>
              {" "}
              {t("add_share_category")}
            </Button>
          </ButtonGroup>
        </Backdrop>
      </div>
      {layout ? (
        <Row>
          {fetchData.length !== 0 ? (
            viewProducts_HTMLTABLE
          ) : (
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
              {t("noItemFound")}
            </div>
          )}
          {checkPermission("categories-create") && (
            <div className="col-xl-3 col-lg-3 col-sm-6 col-md-3">
              <div className="card overflow-hidden ">
                <div
                  className="card-body d-flex justify-content-center text-center"
                  style={{ border: "2px dashed #f50b65" }}
                >
                  <div className="align-self-center text-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleToggle}
                    >
                      <AddIcon />
                      {t("add_category")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Paginate
            fetchData={fetchData}
            setFetchData={setFetchData}
            url={`/api/getCategories/${id}`}
          />
        </Row>
      ) : (
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead className="table-light">
                      <tr className="card-title">
                        <th>{t("image")}</th>
                        <th>{t("category_name")}</th>
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
                                    pathname: `${url}/sub-category`,
                                    state: {
                                      id: id,
                                      sub_id: item.id,
                                    },
                                  }}
                                >
                                  <div>
                                    <img
                                      style={{
                                        height: "50px",
                                        width: "100%",
                                        borderRadius: "10%",
                                        objectFit: "contain",
                                      }}
                                      src={
                                        item.CategoryIcon
                                          ? `http://${base_url}:${port}/images/catagories/${item.CategoryIcon}`
                                          : DefaultPic
                                      }
                                      alt="category"
                                    />
                                  </div>
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={{
                                    pathname: `${url}/sub-category`,
                                    state: {
                                      id: id,
                                      sub_id: item.id,
                                    },
                                  }}
                                >
                                  {item.CategoryName}
                                </Link>
                                {item.isShared ? (
                                  <Chip label="Shared" size="small" />
                                ) : (
                                  ""
                                )}
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
                                  {checkPermission("categories-edit") && (
                                    <button
                                      type="button"
                                      onClick={(e) => fetchMenus(e, item.id)}
                                      className="btn btn-outline-info btn-sm"
                                    >
                                      {t("edit")}
                                    </button>
                                  )}
                                  &nbsp;
                                  {checkPermission("categories-delete") && (
                                    <button
                                      type="button"
                                      onClick={(e) => deleteMenu(e, item.id)}
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
                  url={`/api/getCategories/${id}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Category;
