import React, { useState, useEffect } from "react";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
import palette from "../../../images/hellomenu/palette.svg";
import { Link, useRouteMatch } from "react-router-dom";
import QRCode from "qrcode.react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Switch from "@mui/material/Switch";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { base_url, port } from "../../../Consts";
import logo from "../../../images/hellomenu/logo.svg";
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

  const handleInput = (e) => {
    e.persist();
    setThemes({ ...themes, [e.target.name]: e.target.value });
  };
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, Logo: e.target.files[0] });
  };
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
  const save = (e) => {
    e.preventDefault();
    // console.log(themes);
    const formData = new FormData();
    formData.append("Logo", imageState.Logo);
    formData.append("Orientation", themes.Orientation);
    formData.append("MenuStructure", themes.MenuStructure);
    formData.append("TextColor", themes.TextColor);
    formData.append("BackgroundColor", themes.BackgroundColor);
    formData.append("HighlightColor", themes.HighlightColor);
    formData.append("QRCodeColor", themes.QRCodeColor);
    formData.append("QRCodeBackgroundColor", themes.QRCodeBackgroundColor);
    // console.log(activeThemeId);
    axios
      .post(`/api/updateTheme/${activeThemeId}`, formData)
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

  // insert End
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
  }, [check]);
  // useEffect(() => {
  //   dataLoad();
  // }, [check]);
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
        <div className="col-xl-4 col-lg-4 col-sm-6" key={i}>
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
                  state: { id: branchId },
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
                  <Grid item xs={4} sm={3} md={3} key={item.id}>
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
          <div className=" overflow-hidden border">
            <Form onSubmit={save} method="POST" encType="multipart/form-data">
              <div className="row">
                <div className="col-6">
                  <CCard>
                    <CCardHeader component="h5">{t("logo")}</CCardHeader>
                    <CCardBody>
                      <div className="mb-3">{t("note_for_logo")}</div>
                      <div className="p-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="Logo"
                          onChange={handleImage}
                        />
                        <img
                          style={{ height: "50px", objectFit: "contain" }}
                          src={
                            themes.Logo
                              ? `http://${base_url}:${port}/images/Themes/${themes.Logo}`
                              : logo
                          }
                          // src={`http://${base_url}:${port}/images/Themes/${theme[0].Logo}`}
                          className="w-40 mr-2"
                          alt="Menu"
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-12">
                      <CCard>
                        <CCardHeader component="h5">
                          {t("screen_orientation")}
                        </CCardHeader>
                        <CCardBody>
                          <RadioGroup
                            row
                            aria-label="Orientation"
                            defaultValue={themes.Orientation}
                            name="Orientation"
                            onChange={handleInput}
                          >
                            <FormControlLabel
                              value="P"
                              control={
                                <div>
                                  <Radio
                                    value="P"
                                    name="Orientation"
                                    color="secondary"
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    fill="currentColor"
                                    className="bi bi-phone"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                  </svg>
                                </div>
                              }
                              label={t("portrait")}
                            />
                            <FormControlLabel
                              value="L"
                              control={
                                <div>
                                  <Radio
                                    value="L"
                                    name="Orientation"
                                    color="secondary"
                                  />{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    fill="currentColor"
                                    className="bi bi-phone-landscape mr-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M1 4.5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-6zm-1 6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v6z" />
                                    <path d="M14 7.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
                                  </svg>
                                </div>
                              }
                              label={t("landscape")}
                            />
                          </RadioGroup>
                        </CCardBody>
                      </CCard>
                    </div>

                    <div className="col-12">
                      <CCard>
                        <CCardHeader component="h5">
                          {t("menu_structure")}
                        </CCardHeader>
                        <CCardBody>
                          <RadioGroup
                            row
                            aria-label="MenuStructure"
                            defaultValue={themes.MenuStructure}
                            name="MenuStructure"
                            onChange={handleInput}
                          >
                            <FormControlLabel
                              value="I"
                              control={
                                <div>
                                  <Radio
                                    value="I"
                                    name="MenuStructure"
                                    color="secondary"
                                  />{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    fill="currentColor"
                                    className="bi bi-file-post"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-8z" />
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                                  </svg>
                                </div>
                              }
                              label={t("infinite_scroll")}
                            />
                            <FormControlLabel
                              value="C"
                              control={
                                <div>
                                  <Radio
                                    value="C"
                                    name="MenuStructure"
                                    color="secondary"
                                  />{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    fill="currentColor"
                                    className="bi bi-file-spreadsheet"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v4h10V2a1 1 0 0 0-1-1H4zm9 6h-3v2h3V7zm0 3h-3v2h3v-2zm0 3h-3v2h2a1 1 0 0 0 1-1v-1zm-4 2v-2H6v2h3zm-4 0v-2H3v1a1 1 0 0 0 1 1h1zm-2-3h2v-2H3v2zm0-3h2V7H3v2zm3-2v2h3V7H6zm3 3H6v2h3v-2z" />
                                  </svg>
                                </div>
                              }
                              label={t("classic_layout")}
                            />
                          </RadioGroup>
                        </CCardBody>
                      </CCard>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <CCard>
                    <CCardHeader component="h5">
                      {t("theme_colors")}
                    </CCardHeader>
                    <CCardBody>
                      {/* <SketchPicker /> */}
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="staticEmail"
                          className="col-sm-6 col-form-label"
                        >
                          {t("text_color")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <input
                            type="color"
                            onChange={handleInput}
                            value={themes.TextColor}
                            id="favcolor"
                            name="TextColor"
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="inputPassword"
                          className="col-sm-6 col-form-label"
                        >
                          {t("bgColor")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <input
                            type="color"
                            onChange={handleInput}
                            value={themes.BackgroundColor}
                            id="favcolor"
                            name="BackgroundColor"
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="inputPassword"
                          className="col-sm-6 col-form-label"
                        >
                          {t("highlight_color")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <input
                            type="color"
                            onChange={handleInput}
                            value={themes.HighlightColor}
                            id="favcolor"
                            name="HighlightColor"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col-6">
                  <CCard>
                    <CCardHeader component="h5">
                      {t("your_helloMenu_QR")}
                    </CCardHeader>
                    <CCardBody>
                      <div className="text-center mb-3">
                        <QRCode
                          level={"H"}
                          size={256}
                          bgColor={themes.QRCodeBackgroundColor}
                          fgColor={themes.QRCodeColor}
                          value={`http://192.168.1.103:3000/show-branch-details`}
                          className="primary"
                        />
                      </div>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="staticEmail"
                          className="col-sm-6 col-form-label"
                        >
                          {t("QR_code_color")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <input
                            type="color"
                            onChange={handleInput}
                            value={themes.QRCodeColor}
                            id="favcolor"
                            name="QRCodeColor"
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="inputPassword"
                          className="col-sm-6 col-form-label"
                        >
                          {t("QR_code_background_color")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <input
                            type="color"
                            onChange={handleInput}
                            value={themes.QRCodeBackgroundColor}
                            id="favcolor"
                            name="QRCodeBackgroundColor"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </div>
              </div>
              <div className="text-right mx-4 mb-4">
                <button className="btn btn-primary" type="submit">
                  {t("save")}
                </button>
              </div>
            </Form>
          </div>
          <div className="row mt-2">
            {viewThemes_HTMLTABLE}

            <div className="col-xl-4 col-lg-4 col-sm-6">
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
