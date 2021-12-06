import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
// import Switch from "react-switch";

import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { Form } from "react-bootstrap";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { useHistory } from "react-router-dom";

const Customization = (props) => {
  const { t } = useTranslation();
  const templateId = atob(props.match.params.id);
  const history = useHistory();

  const [settings, setSettings] = useState([]);
  const handleInput = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    const formData = new FormData();
    formData.append(
      "settings",
      JSON.stringify({ ...settings, [e.target.name]: e.target.value })
    );
    axios
      .post(`/api/InsertCustomization/${templateId}`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          setLoading(true);
        }
      });
  };
  // const save = () => {
  //   const formData = new FormData();
  //   formData.append("settings", JSON.stringify(settings));
  //   axios
  //     .post(`/api/InsertCustomization/${templateId}`, formData)
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setLoading(true);
  //       }
  //     });
  // };
  const reset = (e) => {
    e.preventDefault();
    axios.get(`/api/ResetCustomization/${templateId}`).then((res) => {
      if (res.data.status === 200) {
        setSettings([]);
        setLoading(true);
        swal("Success", res.data.message, "success");
      }
    });
  };
  const [template, setTemplate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/GetTemplate/${templateId}`).then((res) => {
      if (res.data.status === 200) {
        setSettings(res.data.fetchData[0].Customization)
        setTemplate(res.data.fetchData[0]);
      }
      setLoading(false);
    });
    // const interval = setInterval(() => {
    //   save();
    // }, 15000);
    // return () => clearInterval(interval);
  }, [loading]);

  var viewPreview_HTMLTABLE = "";
  if (loading) {
    viewPreview_HTMLTABLE = (
      <CCard>
        <CCardHeader component="h5">{t("preview")}</CCardHeader>
        <CCardBody>
          <div className="spinner-border text-primary" role="status"
            style={{ position: "fixed", top: "0%", left: "50%" }}
          >
            <span className="sr-only">{t("loading")}</span>
          </div>
        </CCardBody>
      </CCard>
    );
  } else {
    viewPreview_HTMLTABLE = (
      <CCard>
        <CCardHeader component="h5">{t("preview")}</CCardHeader>
        <CCardBody>
          <Card>
            <CardActionArea>
              <CardMedia
                component="iframe"
                height="600"
                image={`/${template?.URL}/${btoa(3)}`}
                alt="template"
              />
            </CardActionArea>
          </Card>
        </CCardBody>
      </CCard>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col-7">
          <CCard>
            <CCardHeader component="h5">{t("customization")}</CCardHeader>
            <CCardBody>
              <CRow className="mb-2">
                <CFormLabel className="col-sm-6 col-form-label font-weight-bold">
                  {t("Name")}
                </CFormLabel>
                <CFormLabel className="col-sm-3 col-form-label font-weight-bold">
                  {t("value")}
                </CFormLabel>
                <CFormLabel className="col-sm-3 col-form-label text-center font-weight-bold">
                  {t("default")}
                </CFormLabel>
              </CRow>
              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("branch_name_color")}
                </CFormLabel>
                <CCol sm={2} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.branch_name_color}
                    name="branch_name_color"
                  />
                </CCol>
                <CCol sm={4} className="text-center">
                  <input type="color" disabled value="#ff751d" />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("branch_name_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.branch_name_font_size}

                    type="number"
                    name="branch_name_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("14")}
                </CFormLabel>
              </CRow>

              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("categories_and_sub_categoies_color")}
                </CFormLabel>
                <CCol sm={3} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.categories_and_sub_categoies_color}
                    name="categories_and_sub_categoies_color"
                  />
                </CCol>
                <CCol sm={2} className="text-center">
                  <input type="color" disabled value="#f1fcfe" />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("categories_and_sub_categoies_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.categories_and_sub_categoies_font_size}

                    type="number"
                    name="categories_and_sub_categoies_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("12")}
                </CFormLabel>
              </CRow>

              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("product_name_color")}
                </CFormLabel>
                <CCol sm={3} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.product_name_color}

                    name="product_name_color"
                  />
                </CCol>
                <CCol sm={2} className="text-center">
                  <input type="color" disabled value="#ff751d" />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("product_name_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.product_name_font_size}

                    type="number"
                    name="product_name_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("12")}
                </CFormLabel>
              </CRow>
              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("product_discription_color")}
                </CFormLabel>
                <CCol sm={3} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.product_discription_color}
                    name="product_discription_color"
                  />
                </CCol>
                <CCol sm={2} className="text-center">
                  <input type="color" disabled value="#777" />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("product_discription_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.product_discription_font_size}

                    type="number"
                    name="product_discription_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("10")}
                </CFormLabel>
              </CRow>
              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("price_color")}
                </CFormLabel>
                <CCol sm={3} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.price_color}

                    name="price_color"
                  />
                </CCol>
                <CCol sm={2} className="text-center">
                  <input type="color" disabled value="#ff751d" />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("price_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.price_font_size}

                    type="number"
                    name="price_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("12")}
                </CFormLabel>
              </CRow>
              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("button_text_color")}
                </CFormLabel>
                <CCol sm={2} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.button_text_color}

                    // value={themes.TextColor}
                    name="button_text_color"
                  />
                </CCol>
                <CCol sm={4} className="text-center">
                  <input
                    type="color"
                    disabled
                    // onChange={handleInput}
                    value="#f1fcfe"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("button_background_color")}
                </CFormLabel>
                <CCol sm={2} className="text-left">
                  <input
                    type="color"
                    onChange={handleInput}
                    value={settings?.button_background_color}

                    //   value={themes.TextColor}
                    name="button_background_color"
                  />
                </CCol>
                <CCol sm={4} className="text-center">
                  <input
                    type="color"
                    disabled
                    // onChange={handleInput}
                    value="#ff751d"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("button_text_font_size")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    value={settings?.button_text_font_size}
                    
                    type="number"
                    name="button_text_font_size"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("12")}
                </CFormLabel>
              </CRow>
              <CRow className="mb-2">
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-6 col-form-label"
                >
                  {t("number_of_products_in_each_row")}
                </CFormLabel>
                <CCol sm={2}>
                  <input
                    className="form-control"
                    onChange={handleInput}
                    type="number"
                    value={settings?.number_of_products_in_each_row}
                    
                    name="number_of_products_in_each_row"
                  />
                </CCol>
                <CFormLabel
                  htmlFor="inputPassword"
                  className="col-sm-4 col-form-label text-center"
                >
                  {t("2")}
                </CFormLabel>
              </CRow>
              <CRow>
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("mode")}
                </CFormLabel>

                <CCol sm={2} className="text-left">
                  <RadioGroup
                    row
                    aria-label="dark"
                    defaultValue={settings?.mode?settings.mode: "dark" }
                    name="mode"
                    onChange={handleInput}
                  >
                    <FormControlLabel
                      value="light"
                      control={<Radio />}
                      label="Light"
                    />
                    <FormControlLabel
                      value="dark"
                      control={<Radio />}
                      label="Dark"
                    />
                  </RadioGroup>
                </CCol>
                <CCol sm={4} className="text-center">
                  <CFormLabel
                    htmlFor="staticEmail"
                    className="col-sm-6 col-form-label "
                  >
                    Dark
                  </CFormLabel>
                </CCol>
              </CRow>
              <CRow>
                <CFormLabel
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label"
                >
                  {t("font")}
                </CFormLabel>

                <CCol sm={2} className="text-left">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("fonts")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      //   value={age}
                      label="fonts"
                      onChange={handleInput}
                      name="font"
                      defaultValue={settings?.font?settings.font: "sans-serif" }
                    >
                      <MenuItem value="-apple-system">-apple-system</MenuItem>
                      <MenuItem value="BlinkMacSystemFont">
                        BlinkMacSystemFont
                      </MenuItem>
                      <MenuItem value="Segoe UI">Segoe UI</MenuItem>
                      <MenuItem value="Roboto">Roboto</MenuItem>
                      <MenuItem value="Helvetica Neue">Helvetica Neue</MenuItem>
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="sans-serif">sans-serif</MenuItem>
                      <MenuItem value="Apple Color Emoji">
                        Apple Color Emoji
                      </MenuItem>
                      <MenuItem value="Segoe UI Emoji">Segoe UI Emoji</MenuItem>
                      <MenuItem value="Segoe UI Symbol">
                        Segoe UI Symbol
                      </MenuItem>
                    </Select>
                  </FormControl>
                </CCol>
                <CCol sm={4} className="text-center">
                  <CFormLabel
                    htmlFor="staticEmail"
                    className="col-sm-6 col-form-label "
                  >
                    sans-serif
                  </CFormLabel>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
        <div className="col-5">{viewPreview_HTMLTABLE}</div>
      </div>
      <div className="text-center mx-4 mb-4">
        <button className="btn btn-info m-1" onClick={(e) => reset(e)}>
          {t("reset_to_default")}
        </button>
        <button className="btn btn-light m-1" onClick={() => history.goBack()}>
          {t("back")}
        </button>
      </div>
    </>
  );
};

export default Customization;
