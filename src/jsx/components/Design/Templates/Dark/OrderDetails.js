import React, { Fragment, useState, useEffect, SyntheticEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
// import Slider from "react-slick";
import Header from "./Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from "react-slick";

const OrderDetails = (props) => {
  const [themeCustomization, setThemeCustomization] = useState([]);
  const [mode, setMode] = useState(themeCustomization?.mode ? themeCustomization.mode: "dark" );

  const theme = createTheme({
    palette: {
      mode:mode ,
      warning: {
        // button background
        main: themeCustomization?.button_background_color ?themeCustomization.button_background_color: "#ff751d" ,
      },
    },
    typography: {
      fontFamily: themeCustomization?.font?themeCustomization.font: "sans-serif",
      subtitle1: {
        fontSize: themeCustomization?.product_discription_font_size?themeCustomization.product_discription_font_size: 10,
        color: themeCustomization?.product_discription_color?themeCustomization.product_discription_color: "#777",
      },
      // price
      body1: {
        fontSize: themeCustomization?.price_font_size?themeCustomization.price_font_size: 12,
        color: themeCustomization?.price_color?themeCustomization.price_color: "#f1fcfe",
      },
      // product Names
      button: {
        fontSize: themeCustomization?.product_name_font_size?themeCustomization.product_name_font_size: 12,
        color: themeCustomization?.product_name_color?themeCustomization.product_name_color: "#ff751d",
      },
      // categories and sub categories
      overline: {
        fontSize: themeCustomization?.categories_and_sub_categoies_font_size?themeCustomization.categories_and_sub_categoies_font_size: 12,
        color: themeCustomization?.categories_and_sub_categoies_color?themeCustomization.categories_and_sub_categoies_color: "#ff751d",
      },
      // branch Name
      h6:{
        fontSize: themeCustomization?.branch_name_font_size?themeCustomization.branch_name_font_size: 14,
        color: themeCustomization?.branch_name_color?themeCustomization.branch_name_color: "#ff751d", 
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            // button
            props: { variant: 'contained' },
            style: {
              fontSize: themeCustomization?.button_text_font_size?themeCustomization.button_text_font_size: 12,
              color: themeCustomization?.button_text_color?themeCustomization.button_text_color: "#f1fcfe",
            },
          }
        ],
      },
    },
  });
  // for localization
  const { t } = useTranslation();
  const id = atob(props.match.params.id);
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [variantsWithPictures, setVariantsWithPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/GetCustomization/1`).then((res) => {
      if (res.data.status === 200) {
        setThemeCustomization(res.data.fetchData[0].Customization);
        setMode(res.data.fetchData[0].Customization?.mode)
      }
    });
    axios.get(`/api/GetProduct/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
      setLoading(false);
    });
    axios.get(`/api/GetVariantsBasedOnProduct/${id}`).then((res) => {
      if (res.data.status === 200) {
        setVariantData(res.data.fetchData);
      }
    });
    axios
      .get(`/api/GetVariantsBasedOnProductWithPictures/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setVariantsWithPictures(res.data.fetchData);
          // console.log(res.data.fetchData);
        }
      });
  }, [id]);

  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="container ">
        <div
          className="spinner-border text-primary "
          role="status"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = fetchData.map((item, i) => {
      return (
          <Grid item xs={12} sm={12} md={12} key={i}>
            <Card
            className="my-2"
              sx={{
                // height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: "200px", objectFit: "contain" }}
                image={`http://${base_url}:${port}/images/products/${item.image}`}
                alt="Image"
                // className="d-block w-100 img-thumbnail"
              />
            </Card>
            <Card
            // sx={{
            //   // height: "100%",
            //   // display: "flex",
            //   // flexDirection: "column",
            // }}
            >
              <CardContent
                sx={{ flexGrow: 1 }}
              >
                <Typography variant="h6"  gutterBottom>
                   {item.ProductName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {item.Description}
                </Typography>
                
                <RadioGroup
                aria-label="Drinks"
                defaultValue="1"
                name="radio-buttons-group"
            >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
                <FormControlLabel value="4" control={<Radio />} label="4" />
            </RadioGroup>
              </CardContent>
            </Card>
          </Grid>
         
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          // title={branch[0]?.BrancheName}
          categories={0}
          subcategories={0}
          // setSubCategories={setSubCategories}
          // activeSubCategory={activeSubCategory}
          setMode={setMode}
          mode={mode}
        />
        <main>
          {/* <Grid container spacing={2}> */}
          <Slider dots={false} infinite={true} slidesToShow={1} slidesToScroll={1}>
            {viewImages_HTMLTABLE}
          </Slider>
          {/* </Grid> */}
        </main>
      </Container>
      <Footer title="Add" />

    </ThemeProvider>
  );
};

export default OrderDetails;
