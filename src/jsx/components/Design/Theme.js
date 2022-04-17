import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
// import Switch from "react-switch";
import circle_menu_button from "../../../images/hellomenu/circle_menu_button.png";
import pill_menu_button from "../../../images/hellomenu/pill_menu_button.png";
import axios from "axios";
import { Form } from "react-bootstrap";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { useHistory } from "react-router-dom";
import { localization as t } from "../Localization";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { base_url, port } from "../../../Consts";
import logo from "../../../images/hellomenu/logo.svg";
import QRCode from "qrcode.react";
import Switch from "@mui/material/Switch";
const Theme = (props) => {
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const branchId = props.history.location.state.id;

  const [homeScreen, setHomeScreen] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, [e.target.name]: e.target.files[0] });
  };

  // Insert Start
  const [themes, setThemes] = useState([]);
  const handleInput = (e) => {
    e.persist();
    setThemes({ ...themes, [e.target.name]: e.target.value });
  };

  const save = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Logo", imageState.Logo);
    formData.append("HomeScreenBackgroundURL", imageState.HomeScreenBackground);
    formData.append("ThemeName", themes.ThemeName);
    formData.append("Orientation", themes.Orientation);
    formData.append("MenuStructure", themes.MenuStructure);
    formData.append("TextColor", themes.TextColor);
    formData.append("BackgroundColor", themes.BackgroundColor);
    formData.append("CardColor", themes.CardColor);
    formData.append("QRCodeColor", themes.QRCodeColor);
    formData.append("QRCodeBackgroundColor", themes.QRCodeBackgroundColor);
    formData.append("HomeScreenBackground", themes.HomeScreenBackground);
    formData.append("ShowButton", buttonShow ? 1 : 0);
    formData.append("ButtonShape", themes.ButtonShape);
    axios
      .post(`/api/insertTheme/${branchId}`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          MySwal.fire({
            title: <strong>Good job!</strong>,
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
  // insert End
  return (
    <div className=" overflow-hidden border">
      <Form onSubmit={save} method="POST" encType="multipart/form-data">
        <div className="row">
          <div className="col-12 " style={{ borderBottom: "2px solid black" }}>
            <input
              type="text"
              style={{ border: "none" }}
              className="form-control"
              placeholder={t("theme_name")}
              onChange={handleInput}
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
                    {t("home_screen_background")}
                  </CCardHeader>
                  <CCardBody>
                    <RadioGroup
                      aria-label="HomeScreen"
                      defaultValue="1"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="1"
                        control={
                          <Radio
                            onClick={() => setHomeScreen(false)}
                            color="secondary"
                          />
                        }
                        label={t("solid_color")}
                      />
                      <FormControlLabel
                        value="0"
                        control={
                          <Radio
                            onClick={() => setHomeScreen(true)}
                            color="secondary"
                          />
                        }
                        label={t("image_or_video")}
                      />
                    </RadioGroup>
                    <CRow className="mb-3">
                      <CCol sm={12} className="text-right">
                        {homeScreen ? (
                          " "
                        ) : (
                          <input
                            type="color"
                            onChange={handleInput}
                            value={
                              themes.HomeScreenBackground
                                ? themes.HomeScreenBackground
                                : "#ffffff"
                            }
                            name="HomeScreenBackground"
                          />
                        )}
                      </CCol>
                    </CRow>
                    {homeScreen ? (
                      <div className="form-group">
                        <div className="input-group">
                          <div className="custom-file">
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className="form-control"
                              name="HomeScreenBackground"
                              required
                              onChange={handleImage}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-12">
                <CCard>
                  <CCardHeader component="h5">{t("theme_colors")}</CCardHeader>
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
                            themes.TextColor ? themes.TextColor : "#000000"
                          }
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
                            themes.CardColor ? themes.CardColor : "#ffffff"
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
              <CCardHeader component="h5">{t("your_helloMenu_QR")}</CCardHeader>
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
                      btoa(btoa(branchId))
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
                        themes.QRCodeColor ? themes.QRCodeColor : "#F50B65"
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
                    {t("screen_orientation")}
                  </CCardHeader>
                  <CCardBody>
                    <RadioGroup
                      row
                      aria-label="Orientation"
                      name="Orientation"
                      defaultValue="P"
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
                  <CCardHeader component="h5">{t("button_shape")}</CCardHeader>
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
                            defaultValue="P"
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
            {t("save")}
          </button>
          <div
            style={{ cursor: "pointer" }}
            className="btn btn-light m-1"
            onClick={() => history.goBack()}
          >
            {t("back")}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Theme;
