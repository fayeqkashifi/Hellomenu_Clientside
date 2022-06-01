import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
import circle_menu_button from "../../../images/hellomenu/circle_menu_button.png";
import pill_menu_button from "../../../images/hellomenu/pill_menu_button.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { Form } from "react-bootstrap";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { useHistory } from "react-router-dom";
import { localization as t } from "../Localization";
import { base_url, port } from "../../../Consts";
import logo from "../../../images/hellomenu/logo.svg";
import QRCode from "qrcode.react";
import Swal from "sweetalert2";
import CustomAlert from "../CustomAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";

const EditTheme = (props) => {
  const history = useHistory();
  const id = props.history.location.state.id;
  const [loading, setLoading] = useState(true);

  const [imageState, setImageState] = useState([]);
  const [imageValidation, setImageValidation] = useState();
  const [backValidation, setbackValidation] = useState();
  const handleImage = (e, text) => {
    if (text === "logo") {
      setImageValidation();
    } else {
      setbackValidation();
    }
    const image = e.target.files[0];
    if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      if (text === "logo") {
        setImageValidation("Unsupported File Format.");
      } else {
        setbackValidation("Unsupported File Format.");
      }
    } else if (image.size >= 5000000) {
      if (text === "logo") {
        setImageValidation("File Size is too large(Max Size 5MB).");
      } else {
        setbackValidation("File Size is too large(Max Size 5MB).");
      }
    } else {
      setImageState({ ...imageState, [e.target.name]: image });
    }
    setImageState({ ...imageState, [e.target.name]: e.target.files[0] });
  };

  // update Start
  const [themes, setThemes] = useState([]);
  const handleInput = (e) => {
    e.persist();
    setThemes({ ...themes, [e.target.name]: e.target.value });
  };
  const [buttonShow, setButtonShow] = useState();

  const update = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Logo", imageState.Logo);
    formData.append(
      "HomeScreenBackgroundURL",
      imageState.HomeScreenBackgroundURL
    );
    formData.append("ThemeName", themes.ThemeName);
    formData.append("MenuStructure", themes.MenuStructure);
    formData.append("TextColor", themes.TextColor);
    formData.append("HighlightColor", themes.HighlightColor);
    formData.append("BackgroundColor", themes.BackgroundColor);
    formData.append("CardColor", themes.CardColor);
    formData.append("QRCodeColor", themes.QRCodeColor);
    formData.append("QRCodeBackgroundColor", themes.QRCodeBackgroundColor);
    formData.append("ShowButton", buttonShow ? 1 : 0);
    formData.append("ButtonShape", themes.ButtonShape);
    formData.append("Logo", themes.Logo === null ? "null" : themes.Logo);
    formData.append(
      "HomeScreenBackgroundURL",
      themes.HomeScreenBackgroundURL === null
        ? "null"
        : themes.HomeScreenBackgroundURL
    );
    axios
      .post(`/api/updateTheme/${id}`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: "Good job!",
            html: res.data.message,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#93de8b",
          }).then((check) => {
            if (check) {
              history.goBack();
            }
          });
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // update End
  const removeImage = (e, name) => {
    e.persist();
    setThemes({ ...themes, [name]: null });
  };
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/editTheme/${id}`);
      if (result.data.status === 200) {
        setThemes(result.data.data);
        setButtonShow(result.data.data.ShowButton == 1 ? true : false);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [check, setCheck] = useState(false);
  useEffect(() => {
    dataLoad();
    return () => {
      setThemes([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [check]);
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
  const reset = (e) => {
    e.preventDefault();
    axios
      .get(`/api/resetTheme/${themes.id}`)
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
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    return (
      <>
        {alert.open && (
          <CustomAlert
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            setAlert={setAlert}
          />
        )}
        {themes.length !== 0 ? (
          <div className="">
            <Form onSubmit={update} method="POST" encType="multipart/form-data">
              <Grid item xs={12} className="text-right">
                <button
                  className="btn btn-info m-1"
                  type="button"
                  onClick={(e) => reset(e)}
                >
                  {t("reset_to_default")}
                </button>
                <div
                  className="btn btn-light m-1"
                  onClick={() => history.goBack()}
                >
                  {t("back")}
                </div>
              </Grid>
              <div className="row">
                <div className="col-12 mb-2">
                  <input
                    type="text"
                    style={{ border: "none" }}
                    className="form-control"
                    placeholder={t("theme_name")}
                    onChange={handleInput}
                    value={themes.ThemeName ? themes.ThemeName : ""}
                    name="ThemeName"
                  />
                </div>
                <div className="col-6">
                  <CCard>
                    <CCardHeader component="h5">{t("logo")}</CCardHeader>
                    <CCardBody>
                      <div className="mb-3">{t("note_for_logo")}</div>
                      <div className="p-2">
                        <input
                          type="file"
                          accept="image/*"
                          className={
                            "form-control" +
                            (imageValidation ? " is-invalid" : "")
                          }
                          name="Logo"
                          onChange={(e) => handleImage(e, "logo")}
                        />
                        <div className="text-danger">
                          <small> {imageValidation}</small>
                        </div>
                        <div className="text-left m-2">
                          <img
                            style={{ height: "100px", objectFit: "contain" }}
                            src={
                              themes.Logo
                                ? `http://${base_url}:${port}/images/Themes/${themes.Logo}`
                                : logo
                            }
                            className="w-100 "
                            alt="Menu"
                          />
                        </div>
                        <div className="card-footer pt-0 pb-0 text-center">
                          <Tooltip title="Delete">
                            <IconButton onClick={(e) => removeImage(e, "Logo")}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-12">
                      <CCard>
                        <CCardHeader component="h5">
                          {t("home_screen_background")}
                        </CCardHeader>
                        <CCardBody>
                          <div className="form-group">
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className={
                                "form-control" +
                                (backValidation ? " is-invalid" : "")
                              }
                              name="HomeScreenBackgroundURL"
                              onChange={(e) => handleImage(e, "backgrouond")}
                            />
                            <div className="text-danger">
                              <small> {backValidation}</small>
                            </div>

                            {themes.HomeScreenBackgroundURL && (
                              <div className="m-2">
                                <img
                                  style={{
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                  src={`http://${base_url}:${port}/images/Themes/${themes.HomeScreenBackgroundURL}`}
                                  className="w-100 "
                                  alt="Menu"
                                />
                                <div className="card-footer pt-0 pb-0 text-center">
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={(e) =>
                                        removeImage(
                                          e,
                                          "HomeScreenBackgroundURL"
                                        )
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            )}
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                    <div className="col-12">
                      <CCard>
                        <CCardHeader component="h5">
                          {t("theme_colors")}
                        </CCardHeader>
                        <CCardBody>
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
                                value={
                                  themes.TextColor
                                    ? themes.TextColor
                                    : "#000000"
                                }
                                name="TextColor"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="staticEmail"
                              className="col-sm-6 col-form-label"
                            >
                              {t("highlight_color")}
                            </CFormLabel>
                            <CCol sm={6} className="text-center">
                              <input
                                type="color"
                                onChange={handleInput}
                                value={
                                  themes.HighlightColor
                                    ? themes.HighlightColor
                                    : "#ffffff"
                                }
                                name="HighlightColor"
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
                                value={
                                  themes.BackgroundColor
                                    ? themes.BackgroundColor
                                    : "#ffffff"
                                }
                                name="BackgroundColor"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="inputPassword"
                              className="col-sm-6 col-form-label"
                            >
                              {t("card_color")}
                            </CFormLabel>
                            <CCol sm={6} className="text-center">
                              <input
                                type="color"
                                onChange={handleInput}
                                value={
                                  themes.CardColor
                                    ? themes.CardColor
                                    : "#ffffff"
                                }
                                name="CardColor"
                              />
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </div>
                  </div>
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
                          bgColor={
                            themes.QRCodeBackgroundColor
                              ? themes.QRCodeBackgroundColor
                              : "#FFFFFF"
                          }
                          fgColor={
                            themes.QRCodeColor ? themes.QRCodeColor : "#F50B65"
                          }
                          value={`http://${base_url}:${port}/public/${btoa(
                            btoa(btoa(themes.branchId))
                          )}`}
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
                            value={
                              themes.QRCodeColor
                                ? themes.QRCodeColor
                                : "#F50B65"
                            }
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
                            value={
                              themes.QRCodeBackgroundColor
                                ? themes.QRCodeBackgroundColor
                                : "#FFFFFF"
                            }
                            name="QRCodeBackgroundColor"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-12">
                      <CCard>
                        <CCardHeader component="h5">
                          {t("button_shape")}
                        </CCardHeader>
                        <CCardBody>
                          <CRow>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor="staticEmail"
                                className="col-sm-6 col-form-label"
                              >
                                {t("show_button")}
                              </CFormLabel>
                              <CCol sm={6} className="text-center">
                                <Switch
                                  // defaultChecked
                                  onChange={() => setButtonShow(!buttonShow)}
                                  checked={buttonShow}
                                  // onChange={handleInput}
                                  name="ShowButton"
                                  color="secondary"
                                />
                              </CCol>
                            </CRow>
                            {buttonShow ? (
                              <CCol sm={12} className="text-center">
                                <RadioGroup
                                  aria-label="menu_button"
                                  defaultValue={themes.ButtonShape}
                                  name="radio-buttons-group"
                                >
                                  <FormControlLabel
                                    value="R"
                                    control={
                                      <div>
                                        <Radio
                                          onChange={handleInput}
                                          name="ButtonShape"
                                          value="R"
                                          color="secondary"
                                        />{" "}
                                        <img
                                          src={circle_menu_button}
                                          alt=""
                                          width="80"
                                        />
                                      </div>
                                    }
                                    label={t("round")}
                                  />
                                  <FormControlLabel
                                    value="P"
                                    control={
                                      <div>
                                        <Radio
                                          onChange={handleInput}
                                          name="ButtonShape"
                                          value="P"
                                          color="secondary"
                                        />{" "}
                                        <img
                                          src={pill_menu_button}
                                          alt=""
                                          width="80"
                                        />
                                      </div>
                                    }
                                    label={t("pill")}
                                  />
                                </RadioGroup>
                              </CCol>
                            ) : null}
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mx-4 mb-4">
                <button className="btn btn-primary" type="submit">
                  {t("update")}
                </button>
                <Link
                  className="btn btn-light m-1"
                  to=""
                  onClick={() => history.goBack()}
                >
                  {t("back")}
                </Link>
              </div>
            </Form>
          </div>
        ) : (
          <div className="spinner-border text-primary " role="status">
            <span className="sr-only">{t("loading")}</span>
          </div>
        )}
      </>
    );
  }
};

export default EditTheme;
