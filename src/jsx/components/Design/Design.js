import React, { useState, useEffect } from "react";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardImage,
} from "@coreui/react";
import palette from "../../../images/hellomenu/palette.svg";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Switch from "@mui/material/Switch";
import { base_url, port } from "../../../Consts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
// import profile from "";
import CustomAlert from "../CustomAlert";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { localization as t } from "../Localization";

const Design = (props) => {
  const { url } = useRouteMatch();

  // const branchId = atob(props.match.params.id);
  const branchId = props.history.location.state.id;

  const [activeKey, setActiveKey] = useState(1);
  // Insert Start
  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState([]);
  const [check, setCheck] = useState(true);

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

  // change the active theme
  const changeTheActiveTheme = (e, id) => {
    axios
      .post(`/api/themeStatus/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "info", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // change the active template
  const changeTheActiveTemplate = (e, id) => {
    axios
      .post(`/api/templateStatus/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "info", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const dataLoad = async () => {
    try {
      const res = await axios.get(`/api/getThemes/${branchId}`);
      if (res.data.status === 200) {
        console.log(res.data.fetchData);
        setFetchData(res.data.fetchData);
        res.data.fetchData.map((item, i) => {
          if (item.Status === 1) {
            setActiveThemeId(item.id);
            setThemes(item);
          }
        });
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const result = await axios.get(`/api/getTemplates/${branchId}`);
      if (result.data.status === 200) {
        setTemplates(result.data.data);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setFetchData([]);
      setTemplates([]);
      setActiveThemeId([]);
      setThemes([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [check]);
  // delete start
  const deleteTheme = (e, id) => {
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
          .delete(`/api/deleteTheme/${id}`)
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
  //   duplicate Theme
  const duplicateTheme = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/duplicateTheme/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var viewThemes_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewThemes_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <div className="col-xl-3 col-lg-4 col-sm-6" key={i}>
          <CCard>
            <CCardImage
              orientation="top"
              src={
                item.Logo
                  ? `http://${base_url}:${port}/images/Themes/${item.Logo}`
                  : palette
              }
              style={{ height: "250px", objectFit: "contain" }}
            />
            <CCardBody>
              <Link
                to={{
                  pathname: `${url}/edit-theme`,
                  state: { id: item.id },
                }}
                className="m-1"
              >
                <EditIcon />
                {t("edit")}
              </Link>
              {item.Status === 1 ? (
                " "
              ) : (
                <Link
                  to="#"
                  className="m-1"
                  onClick={(e) => deleteTheme(e, item.id)}
                >
                  <DeleteIcon />
                  <span> {t("delete")}</span>
                </Link>
              )}
              <Link
                to="#"
                className="m-1"
                onClick={(e) => duplicateTheme(e, item.id)}
              >
                <ContentCopyIcon />
                <span> {t("duplicate")}</span>
              </Link>
              <div className="row ">
                <div className="col-8 mt-2 text-primary font-weight-bold">
                  {item.ThemeName}
                </div>
                <div className="col-4 text-right">
                  <Switch
                    disabled={item.Status === 1 ? true : false}
                    defaultChecked={item.Status === 1 ? true : false}
                    color="secondary"
                    onChange={(e) => changeTheActiveTheme(e, item.id)}
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div>
      );
    });
  }
  return (
    <>
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
      <CNav variant="pills" role="tablist">
        <CNavItem>
          <CNavLink
            style={{ cursor: "pointer" }}
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            {t("default_templates")}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            // href="#"
            style={{ cursor: "pointer" }}
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            {t("custom_design")}
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane
          role="tabpanel"
          aria-labelledby="profile-tab"
          visible={activeKey === 1}
        >
          <div className=" overflow-hidden border mt-2">
            <Grid container spacing={2}>
              {templates.map((item) => {
                return (
                  <Grid item xs={4} sm={4} md={3} key={item.id}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://${base_url}:${port}/images/Templates/${item.ImageURL}`}
                          alt="template"
                        />

                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {item.TemplateName}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Link
                                to={{
                                  pathname: `/filterSelection`,
                                  // state: { id: item.id },
                                }}
                                target="_blank"
                              >
                                Preview
                              </Link>
                            </Grid>
                            <Grid item xs={8}>
                              {item.Status === 1 ? (
                                <Link
                                  to={{
                                    pathname: `${url}/customization`,
                                    state: { id: item.id, branchId: branchId },
                                  }}
                                >
                                  Customization
                                </Link>
                              ) : (
                                "You must first activate the template before customization."
                              )}
                            </Grid>
                            <Grid item xs={4}>
                              <Switch
                                disabled={item.Status === 1 ? true : false}
                                defaultChecked={
                                  item.Status === 1 ? true : false
                                }
                                color="secondary"
                                onChange={(e) =>
                                  changeTheActiveTemplate(e, item.id)
                                }
                              />
                              {/* {item.Status == 1 ? (
                                <Switch checked disabled color="secondary" />
                              ) : (
                                <Switch
                                  onChange={(e) =>
                                    changeTheActiveTemplate(e, item.id)
                                  }
                                  color="secondary"
                                />
                              )} */}
                            </Grid>
                          </Grid>
                        </CardActions>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="home-tab"
          visible={activeKey === 2}
        >
          <div className="row mt-2">
            {viewThemes_HTMLTABLE}

            <div className="col-xl-3 col-lg-3 col-sm-6">
              <div className="card overflow-hidden ">
                <div
                  className="card-body d-flex justify-content-center text-center"
                  style={{ border: "2px dashed pink" }}
                >
                  <div className="align-self-center text-center">
                    <div>
                      <img src={palette} alt="" />
                    </div>
                    <div className="pt-3">
                      <Link
                        className="btn btn-outline-primary"
                        to={{
                          pathname: `${url}/add-theme`,
                          state: { id: branchId },
                        }}
                      >
                        {t("new_theme")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CTabPane>
      </CTabContent>
    </>
  );
};

export default Design;
