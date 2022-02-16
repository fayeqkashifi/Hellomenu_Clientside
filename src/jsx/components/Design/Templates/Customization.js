import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormLabel,
  CCol,
} from "@coreui/react";
import { Form } from "react-bootstrap";

import { useTranslation } from "react-i18next";
// import Switch from "react-switch";

import axios from "axios";
import swal from "sweetalert";
import { FormControlLabel, RadioGroup, Radio } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
// import Switch from "@mui/material/Switch";
const Customization = (props) => {
  const { t } = useTranslation();
  // const templateId = atob(props.match.params.id);
  const templateId = props.history.location.state.id;
  const branchId = props.history.location.state.branchId;

  const history = useHistory();

  const [settings, setSettings] = useState([]);
  const handleInput = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    // const formData = new FormData();
    // formData.append(
    //   "settings",
    //   JSON.stringify({ ...settings, [e.target.name]: e.target.value })
    // );
    // axios
    //   .post(`/api/InsertCustomization/${templateId}`, formData)
    //   .then((res) => {
    //     if (res.data.status === 200) {
    //       setLoading(true);
    //     }
    //   });
  };
  const save = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("settings", JSON.stringify(settings));
    axios
      .post(`/api/InsertCustomization/${templateId}`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");
          setLoading(true);
        }
      });
  };
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
  const dataLoad = () => {
    axios.get(`/api/GetTemplate/${templateId}`).then((res) => {
      if (res.data.status === 200) {
        setSettings(res.data.fetchData.Customization);
        setTemplate(res.data.fetchData);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setSettings([]);
      setTemplate([]);
      setLoading(true);
    };
  }, [loading]);

  var viewPreview_HTMLTABLE = "";
  if (loading) {
    viewPreview_HTMLTABLE = (
      <CCard>
        <CCardHeader component="h5">{t("preview")}</CCardHeader>
        <CCardBody>
          <div
            className="spinner-border text-primary"
            role="status"
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
                height="700px"
                image={`/filterSelection`}
                // image={`/${template?.URL}/${btoa(branchId)}`}
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
      <Form onSubmit={save} method="POST" encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12} className="text-right">
            <button className="btn btn-success m-1" type="submit">
              {t("save_and_preview")}
            </button>
            <button
              className="btn btn-info m-1"
              type="button"
              onClick={(e) => reset(e)}
            >
              {t("reset_to_default")}
            </button>
            <div className="btn btn-light m-1" onClick={() => history.goBack()}>
              {t("back")}
            </div>
          </Grid>
          <Grid item xs={7}>
            <CCard>
              <CCardHeader component="h5">{t("customization")}</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm={12} className="m-1 font-weight-bold text-primary">
                    BACKGROUND COLORS
                  </CCol>
                </CRow>
                <section style={{ padding: 10, border: "1px dashed grey" }}>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("Name")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("value")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("default")}
                      </CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("bgColor")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.bgColor}
                        name="bgColor"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#22252a" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("cardBgColor")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.cardBgColor}
                        name="cardBgColor"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#2d3134" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("button_background_color")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.button_background_color}
                        //   value={themes.TextColor}
                        name="button_background_color"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        disabled
                        // onChange={handleInput}
                        value="#ff751d"
                      />
                    </CCol>
                  </CRow>
                </section>
                <CRow>
                  <CCol sm={12} className="m-1 font-weight-bold text-primary">
                    COLORS
                  </CCol>
                </CRow>

                <section style={{ padding: 10, border: "1px dashed grey" }}>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("Name")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("value")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("default")}
                      </CFormLabel>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("menusAcriveColor")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.menusAcriveColor}
                        name="menusAcriveColor"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#ff751d" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("menusDeactiveColor")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.menusDeactiveColor}
                        name="menusDeactiveColor"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#ffffff" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("product_name_color")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.product_name_color}
                        name="product_name_color"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#ff751d" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("product_discription_color")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.product_discription_color}
                        name="product_discription_color"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#777" />
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("price_color")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.price_color}
                        name="price_color"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input type="color" disabled value="#ff751d" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label">
                        {t("button_text_color")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        onChange={handleInput}
                        value={settings?.button_text_color}
                        // value={themes.TextColor}
                        name="button_text_color"
                      />
                    </CCol>
                    <CCol sm={2}>
                      <input
                        type="color"
                        disabled
                        // onChange={handleInput}
                        value="#f1fcfe"
                      />
                    </CCol>
                  </CRow>
                </section>
                <CRow>
                  <CCol sm={12} className="m-1 font-weight-bold text-primary">
                    FONT SIZE
                  </CCol>
                </CRow>
                <section style={{ padding: 10, border: "1px dashed grey" }}>
                  <CRow>
                    <CCol sm={8}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("Name")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("value")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={2} className="text-center">
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("default")}
                      </CFormLabel>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol sm={7} className="mt-2">
                      <CFormLabel className="col-form-label">
                        {t("menusSize")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        type="number"
                        className="form-control m-1"
                        onChange={handleInput}
                        value={settings?.menusSize}
                        name="menusSize"
                        min="1"
                        max="5"
                        step="0.25"
                      />
                    </CCol>
                    <CCol sm={2} className="text-center mt-2">
                      1
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol sm={7} className="mt-2">
                      <CFormLabel className="col-form-label">
                        {t("pNameSize")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        type="number"
                        className="form-control m-1"
                        onChange={handleInput}
                        value={settings?.pNameSize}
                        name="pNameSize"
                        min="1"
                        max="5"
                        step="0.25"
                      />
                    </CCol>
                    <CCol sm={2} className="text-center mt-2">
                      1
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={7} className="mt-2">
                      <CFormLabel className="col-form-label">
                        {t("pDiscriptionSize")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        type="number"
                        className="form-control m-1"
                        onChange={handleInput}
                        value={settings?.pDiscriptionSize}
                        name="pDiscriptionSize"
                        min="1"
                        max="5"
                        step="0.25"
                      />
                    </CCol>
                    <CCol sm={2} className="text-center mt-2">
                      0.75
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol sm={7} className="mt-2">
                      <CFormLabel className="col-form-label">
                        {t("priceSize")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        type="number"
                        className="form-control m-1"
                        onChange={handleInput}
                        value={settings?.priceSize}
                        name="priceSize"
                        min="1"
                        max="5"
                        step="0.25"
                      />
                    </CCol>
                    <CCol sm={2} className="text-center mt-2">
                      1.25
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={7} className="mt-2">
                      <CFormLabel className="col-form-label">
                        {t("bTextSize")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        type="number"
                        className="form-control m-1"
                        onChange={handleInput}
                        value={settings?.bTextSize}
                        name="bTextSize"
                        min="1"
                        max="5"
                        step="0.25"
                      />
                    </CCol>
                    <CCol sm={2} className="text-center mt-2">
                      1
                    </CCol>
                  </CRow>
                </section>

                <CRow>
                  <CCol sm={12} className="m-1 font-weight-bold text-primary">
                    FONTS
                  </CCol>
                </CRow>
                <section style={{ padding: 10, border: "1px dashed grey" }}>
                  <CRow>
                    <CCol sm={4}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("Name")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={4}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("value")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={4}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("default")}
                      </CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={4}>
                      <CFormLabel className="col-form-label">
                        {t("font")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={4}>
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
                          defaultValue={
                            settings?.font ? settings.font : "sans-serif"
                          }
                        >
                          <MenuItem value="-apple-system">
                            -apple-system
                          </MenuItem>
                          <MenuItem value="BlinkMacSystemFont">
                            BlinkMacSystemFont
                          </MenuItem>
                          <MenuItem value="Segoe UI">Segoe UI</MenuItem>
                          <MenuItem value="Roboto">Roboto</MenuItem>
                          <MenuItem value="Helvetica Neue">
                            Helvetica Neue
                          </MenuItem>
                          <MenuItem value="Arial">Arial</MenuItem>
                          <MenuItem value="sans-serif">sans-serif</MenuItem>
                          <MenuItem value="Apple Color Emoji">
                            Apple Color Emoji
                          </MenuItem>
                          <MenuItem value="Segoe UI Emoji">
                            Segoe UI Emoji
                          </MenuItem>
                          <MenuItem value="Segoe UI Symbol">
                            Segoe UI Symbol
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </CCol>
                    <CCol sm={4}>
                      <CFormLabel className="col-form-label ">
                        sans-serif
                      </CFormLabel>
                    </CCol>
                  </CRow>
                </section>
                <CRow>
                  <CCol sm={12} className="m-1 font-weight-bold text-primary">
                    OTHERS
                  </CCol>
                </CRow>
                <section style={{ padding: 10, border: "1px dashed grey" }}>
                  <CRow>
                    <CCol sm={6}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("Name")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("value")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <CFormLabel className="col-form-label font-weight-bold">
                        {t("default")}
                      </CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={6}>
                      <CFormLabel className="col-form-label">
                        {t("number_of_products_in_each_row")}
                      </CFormLabel>
                    </CCol>
                    <CCol sm={3}>
                      <input
                        className="form-control m-1"
                        onChange={handleInput}
                        type="number"
                        value={settings?.numberProductInRowMobile}
                        name="numberProductInRowMobile"
                        min="1"
                        max="6"
                        step="1"
                      />
                      <input
                        className="form-control m-1"
                        onChange={handleInput}
                        type="number"
                        value={settings?.numberProductInRowTablet}
                        name="numberProductInRowTablet"
                        min="1"
                        max="6"
                        step="1"
                      />
                      <input
                        className="form-control m-1"
                        onChange={handleInput}
                        type="number"
                        value={settings?.numberProductInRowComputer}
                        name="numberProductInRowComputer"
                        min="1"
                        max="6"
                        step="1"
                      />
                    </CCol>
                    <CCol sm={3}>
                      <CFormLabel
                        htmlFor="inputPassword"
                        className="col-form-label"
                      >
                        2 For Mobile <br></br>3 For tablet<br></br>4 For
                        computer
                      </CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={5}>
                      <CFormLabel className="col-form-label">
                        {t("show_preparation_time")}
                      </CFormLabel>
                    </CCol>

                    <CCol sm={5}>
                      <RadioGroup
                        row
                        value={
                          settings?.preparation_time
                            ? settings.preparation_time
                            : "1"
                        }
                        name="preparation_time"
                        onChange={handleInput}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className=" col-form-label ">Yes</CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={5}>
                      <CFormLabel className="col-form-label">
                        {t("show_extras")}
                      </CFormLabel>
                    </CCol>

                    <CCol sm={5}>
                      <RadioGroup
                        row
                        value={
                          settings?.show_extras ? settings.show_extras : "1"
                        }
                        name="show_extras"
                        onChange={handleInput}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className=" col-form-label ">Yes</CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={5}>
                      <CFormLabel className="col-form-label">
                        {t("show_ingredients")}
                      </CFormLabel>
                    </CCol>

                    <CCol sm={5}>
                      <RadioGroup
                        row
                        value={
                          settings?.show_ingredients
                            ? settings.show_ingredients
                            : "1"
                        }
                        name="show_ingredients"
                        onChange={handleInput}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className=" col-form-label ">Yes</CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={5}>
                      <CFormLabel className="col-form-label">
                        {t("show_recommendation")}
                      </CFormLabel>
                    </CCol>

                    <CCol sm={5}>
                      <RadioGroup
                        row
                        value={
                          settings?.show_recommendation
                            ? settings.show_recommendation
                            : "1"
                        }
                        name="show_recommendation"
                        onChange={handleInput}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className=" col-form-label ">Yes</CFormLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={5}>
                      <CFormLabel className="col-form-label">
                        {t("show_variants")}
                      </CFormLabel>
                    </CCol>
                    {}
                    <CCol sm={5}>
                      <RadioGroup
                        row
                        value={
                          settings?.show_variants ? settings.show_variants : "1"
                        }
                        name="show_variants"
                        onChange={handleInput}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </CCol>
                    <CCol sm={2}>
                      <CFormLabel className=" col-form-label ">Yes</CFormLabel>
                    </CCol>
                  </CRow>
                </section>
              </CCardBody>
            </CCard>
          </Grid>
          <Grid item xs={5}>
            {viewPreview_HTMLTABLE}
          </Grid>
        </Grid>
      </Form>
    </>
  );
};

export default Customization;
