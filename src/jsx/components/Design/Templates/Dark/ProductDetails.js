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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
const ProductDetails = (props) => {

  const [themeCustomization, setThemeCustomization] = useState([]);
  const [mode, setMode] = useState("dark" );

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
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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
                sx={
                  {
                    // 16:9
                    // pt: "40.25%",
                  }
                }
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
                // className="text-left"
              >
                <Typography variant="overline" gutterBottom>
                  {t("product_name")}: {item.ProductName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {t("description")}: {item.Description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {t("unit")}: {item.UnitName}
                </Typography>
                <Typography variant="overline" gutterBottom>

                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  // aria-label="secondary tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Item One" />
                  <Tab label="Item Two" />
                  <Tab label="Item Three" />
                  <Tab label="Item Four" />
                  <Tab label="Item Five" />
                  <Tab label="Item Six" />
                  <Tab label="Item Seven" />
                </Tabs>
                </Typography>

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
          
          <Grid container spacing={2}>
            {viewImages_HTMLTABLE}
          </Grid>
        </main>
        <Typography variant="overline" display="block" gutterBottom>
            {t("product_variants")}:
            
          </Typography>
          <Grid container spacing={2}>
            {variantsWithPictures.map((item, i) => {
              return (
                <Grid item xs={3} sm={2} md={2} key={i}>
                  <Card
                    sx={{
                      // height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={
                        {
                          // 16:9
                          // pt: "40.25%",
                        }
                      }
                      sx={{ height: "100px", objectFit: "contain" }}
                      image={`http://${base_url}:${port}/images/variants_pics/${item.PicturesLocation}`}
                      alt="Image"
                    />
                    <Link to={`/order-details/${btoa(item.product_id)}`}>
                      <CardContent sx={{ flexGrow: 1 }} className="text-center">
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          // sx={{ color: "#f27d1e" }}
                        >
                          {item.VariationName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {item.UnitName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {item.CurrentPrice + " " + item.currency_code}
                          {item.OldPrice === null
                            ? " "
                            : item.OldPrice + " " + item.currency_code}
                        </Typography>
                      </CardContent>
                    </Link>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        <Footer title="Checkout" />
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetails;
