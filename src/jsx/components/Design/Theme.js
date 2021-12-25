import React, { useState } from "react";
import {
  CBreadcrumb,
  CCard,
  CCardBody,
  CAccordionBody,
  CListGroupItem,
  CListGroup,
  CCardHeader,
  CAccordion,
  CAccordionHeader,
  CAccordionItem,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
// import Switch from "react-switch";
import circle_menu_button from "../../../images/hellomenu/circle_menu_button.png";
import pill_menu_button from "../../../images/hellomenu/pill_menu_button.png";
import Avatar from "@mui/material/Avatar";
import {
  AvatarGroup,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
import { Form } from "react-bootstrap";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";

const Theme = (props) => {
  const history = useHistory();

  const { t } = useTranslation();
  const branchId = props.history.location.state.id;

  const [state, setState] = useState({ checked: false });
  const [homeScreen, setHomeScreen] = useState(false);
  const [menuScreen, setMenuScreen] = useState(false);
  const [buttonShow, setButtonShow] = useState(1);
  const handleChange = (checked) => {
    setState({ checked });
  };
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, HomeScreenBackground: e.target.files[0] });
  };
  const [imageStateMenu, setImageStateMenu] = useState([]);
  const handleImageMenu = (e) => {
    setImageStateMenu({
      ...imageStateMenu,
      MenuScreenBackground: e.target.files[0],
    });
  };
  // Insert Start
  const [themes, setThemes] = useState([]);
  const handleInput = (e) => {
    e.persist();
    setThemes({ ...themes, [e.target.name]: e.target.value });
  };
  const changeColor = (first, second, thrid) => {
    setThemes({
      ...themes,
      TextColor: first,
      BackgroundColor: second,
      HighlightColor: thrid,
    });
  };
  const save = (e) => {
    e.preventDefault();
    // console.log(themes);
    const formData = new FormData();
    formData.append("HomeScreenBackground", imageState.HomeScreenBackground);
    formData.append(
      "MenuScreenBackground",
      imageStateMenu.MenuScreenBackground
    );
    formData.append("ThemeName", themes.ThemeName);
    // formData.append("Orientation", themes.Orientation);
    // formData.append("MenuStructure", themes.MenuStructure);
    formData.append("TextColor", themes.TextColor);
    formData.append("BackgroundColor", themes.BackgroundColor);
    formData.append("HighlightColor", themes.HighlightColor);
    // formData.append("QRCodeColor", themes.QRCodeColor);
    // formData.append("QRCodeBackgroundColor", themes.QRCodeBackgroundColor);
    formData.append("HomeScreenBackground", themes.HomeScreenBackground);
    formData.append("MenuScreenBackground", themes.MenuScreenBackground);
    formData.append("ShowButton", themes.ShowButton);
    formData.append("ButtonShape", themes.ButtonShape);
    axios.post(`/api/InsertTheme/${branchId}`, formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        history.goBack();
        // setThemes([]);
        // setImageStateMenu([]);
        // setImageState([]);
      }
    });
  };
  // insert End
  const [expanded, setExpanded] = React.useState(false);

  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <div className=" overflow-hidden border">
        <Form onSubmit={save} method="POST" encType="multipart/form-data">
          <div className="row">
            <div className="col-12 mb-2">
              <div
                className="col-6 mb-2"
                style={{ borderBottom: "2px solid black" }}
              >
                <input
                  type="text"
                  style={{ border: "none" }}
                  className="form-control"
                  placeholder={t("theme_name")}
                  onChange={handleInput}
                  name="ThemeName"
                />
              </div>
            </div>
            <div className="col-6">
              <CCard>
                <CCardHeader component="h5">{t("theme_colors")}</CCardHeader>
                <CCardBody>
                  <div>
                    <Accordion
                      expanded={expanded === "panel1"}
                      onChange={handleChangePanel("panel1")}
                      className="my-3"
                    >
                      <AccordionSummary
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={8}>
                            <Typography sx={{ width: "33%", flexShrink: 0 }}>
                              {t("selected")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={4}>
                            <Typography sx={{ color: "text.secondary" }}>
                              <AvatarGroup max={4}>
                                <Avatar
                                  sx={{
                                    bgcolor: themes.TextColor,
                                    width: 20,
                                    height: 20,
                                  }}
                                >
                                  {" "}
                                </Avatar>
                                <Avatar
                                  sx={{
                                    bgcolor: themes.BackgroundColor,
                                    width: 20,
                                    height: 20,
                                  }}
                                >
                                  {" "}
                                </Avatar>
                                <Avatar
                                  sx={{
                                    bgcolor: themes.HighlightColor,
                                    width: 20,
                                    height: 20,
                                  }}
                                >
                                  {" "}
                                </Avatar>
                              </AvatarGroup>
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton
                                onClick={() =>
                                  changeColor("red", "green", "black")
                                }
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={6} md={8}>
                                    <ListItemText primary="First Color Theme" />
                                  </Grid>
                                  <Grid item xs={6} md={4}>
                                    <Typography
                                      sx={{ color: "text.secondary" }}
                                    >
                                      <AvatarGroup max={4}>
                                        <Avatar
                                          sx={{
                                            bgcolor: "red",
                                            width: 20,
                                            height: 20,
                                          }}
                                        >
                                          {" "}
                                        </Avatar>
                                        <Avatar
                                          sx={{
                                            bgcolor: "green",
                                            width: 20,
                                            height: 20,
                                          }}
                                        >
                                          {" "}
                                        </Avatar>
                                        <Avatar
                                          sx={{
                                            bgcolor: "black",
                                            width: 20,
                                            height: 20,
                                          }}
                                        >
                                          {" "}
                                        </Avatar>
                                      </AvatarGroup>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
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
                        name="TextColor"
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor="inputPassword"
                      className="col-sm-6 col-form-label"
                    >
                      {t("background_color")}
                    </CFormLabel>
                    <CCol sm={6} className="text-center">
                      <input
                        type="color"
                        onChange={handleInput}
                        value={themes.BackgroundColor}
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
                        name="HighlightColor"
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <button className="btn btn-light m-1" type="button">
                      {t("advanced_customization")}
                    </button>
                  </CRow>
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
                              id="favcolor"
                              onChange={handleInput}
                              value={themes.HomeScreenBackground}
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
                    <CCardHeader component="h5">
                      {t("menu_screen_background")}
                    </CCardHeader>
                    <CCardBody>
                      <RadioGroup
                        aria-label="MenuScreen"
                        defaultValue="1"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio
                              onClick={() => setMenuScreen(false)}
                              color="secondary"
                            />
                          }
                          label={t("solid_color")}
                        />
                        <FormControlLabel
                          value="0"
                          control={
                            <Radio
                              onClick={() => setMenuScreen(true)}
                              color="secondary"
                            />
                          }
                          label={t("image")}
                        />
                      </RadioGroup>
                      <CRow className="mb-3">
                        <CCol sm={12} className="text-right">
                          {menuScreen ? (
                            " "
                          ) : (
                            <input
                              type="color"
                              onChange={handleInput}
                              value={themes.MenuScreenBackground}
                              name="MenuScreenBackground"
                            />
                          )}
                        </CCol>
                      </CRow>
                      {menuScreen ? (
                        <div className="form-group">
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="form-control"
                                name="MenuScreenBackground"
                                required
                                onChange={handleImageMenu}
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
                    <CCardHeader component="h5">{t("menu_button")}</CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor="staticEmail"
                          className="col-sm-6 col-form-label"
                        >
                          {t("show_button")}
                        </CFormLabel>
                        <CCol sm={6} className="text-center">
                          <Switch
                            defaultChecked
                            onChange={() => setButtonShow(!buttonShow)}
                            value={buttonShow}
                            onChange={handleInput}
                            name="ShowButton"
                            color="secondary"
                          />
                        </CCol>
                      </CRow>
                      {buttonShow ? (
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor="inputPassword"
                            className="col-sm-12 col-form-label"
                          >
                            {t("button_shape")}
                          </CFormLabel>
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
                        </CRow>
                      ) : null}
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
    </>
  );
};

export default Theme;
