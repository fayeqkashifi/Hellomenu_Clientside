import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HorizontalScroller from "react-horizontal-scroll-container";
import getSymbolFromCurrency from "currency-symbol-map";

var hold = 1;
export default function Main(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const [subcategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(0);
  const [themeCustomization, setThemeCustomization] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetTempBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setThemeCustomization(res.data.fetchData[0]?.Customization);
        // console.log(res.data.fetchData[0].Customization);
      }
    });
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
        setActiveSubCategory(res.data.fetchData[0]?.sub_id);
        setSubName(res.data.fetchData[0].SubCategoryName);

        axios
          .get(
            `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_id}`
          )
          .then((res) => {
            if (res.data.status === 200) {
              setProducts(res.data.data);
            }
          });
        setLoading(false);
      }
    });
  }, []);

  // design start
  const theme = createTheme({
    palette: {
      warning: {
        // button background
        main: themeCustomization?.button_background_color
          ? themeCustomization.button_background_color
          : "#ff751d",
      },
    },
    typography: {
      fontFamily: themeCustomization?.font
        ? themeCustomization.font
        : "sans-serif",
      subtitle1: {
        fontSize: themeCustomization?.product_discription_font_size
          ? themeCustomization.product_discription_font_size
          : 10,
        color: themeCustomization?.product_discription_color
          ? themeCustomization.product_discription_color
          : "#777",
      },
      // price
      body1: {
        fontSize: themeCustomization?.price_font_size
          ? themeCustomization.price_font_size
          : 12,
        color: themeCustomization?.price_color
          ? themeCustomization.price_color
          : "#f1fcfe",
      },
      // product Names
      button: {
        fontSize: themeCustomization?.product_name_font_size
          ? themeCustomization.product_name_font_size
          : 12,
        color: themeCustomization?.product_name_color
          ? themeCustomization.product_name_color
          : "#1f1d1f",
      },
      // categories and sub categories
      overline: {
        fontSize: themeCustomization?.categories_and_sub_categoies_font_size
          ? themeCustomization.categories_and_sub_categoies_font_size
          : 12,
        color: themeCustomization?.categories_and_sub_categoies_color
          ? themeCustomization.categories_and_sub_categoies_color
          : "#ff751d",
      },
      // branch Name
      h4: {
        fontSize: themeCustomization?.branch_name_font_size
          ? themeCustomization.branch_name_font_size
          : 28,
        color: themeCustomization?.branch_name_color
          ? themeCustomization.branch_name_color
          : "#aa3f32",
      },
      h3: {
        fontSize: themeCustomization?.branch_name_font_size
          ? themeCustomization.branch_name_font_size
          : 36,
        color: themeCustomization?.branch_name_color
          ? themeCustomization.branch_name_color
          : "#1f1d1f",
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            // button
            props: { variant: "contained" },
            style: {
              fontSize: themeCustomization?.button_text_font_size
                ? themeCustomization.button_text_font_size
                : 12,
              color: themeCustomization?.button_text_color
                ? themeCustomization.button_text_color
                : "#f1fcfe",
            },
          },
        ],
      },
    },
  });
  // design end
  let [subName, setSubName] = useState("");
  const filterProducts = (subCateID, name) => {
    axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
      }
    });
    setSubName(name);
    setActiveSubCategory(subCateID);
  };
  var viewShow_HTMLTABLE = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewShow_HTMLTABLE = products?.map((item, i) => {
      return (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          key={i}
          sx={{ height: "500px" }}
          className="center"
        >
          <Card
            sx={{
              width: "300px",
              margin: "30px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: "300px", objectFit: "contain" }}
              image={`http://${base_url}:${port}/images/products/${item.image}`}
              alt="Image"
            />
            <Link
              to={{
                pathname: `/second-template/product/${btoa(item.id)}`,
                state: { themes: themeCustomization },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }} className="text-center">
                <Typography
                  variant="button"
                  style={{ textTransform: "capitalize" }}
                >
                  {item.ProductName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {item.Description}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {item.price + " " + getSymbolFromCurrency(item.currency_code)}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Grid>
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="left"
          style={{
            marginLeft: 200,
            paddingBottom: "2px",
            marginBottom: "10px",
            borderBottomStyle: "solid",
            borderottomWidth: "3.1px",
            width: "fit-content",
            borderColor: "#33cd6b",
          }}
          noWrap
          sx={{ flex: 1 }}
        >
          {subName}
        </Typography>

        <Card>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: 500,
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons
                  aria-label="Vertical tabs example"
                  TabIndicatorProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                      "&.Mui-disabled": { opacity: 0.3 },
                    },
                  }}
                >
                  {subcategories?.map((section, i) => (
                    <Tab
                      className="mb-2"
                      onClick={() =>
                        filterProducts(section.sub_id, section.SubCategoryName)
                      }
                      style={
                        activeSubCategory == section.sub_id
                          ? {
                              cursor: "pointer",
                              background: "#33cd6b",
                              margin: "2px",
                              padding: "5px",
                              border: "1px solid",
                              textAlign: "center",
                              borderRadius: "10px",
                              borderColor: "#33cd6b",
                            }
                          : {
                              cursor: "pointer",
                              margin: "2px",
                              padding: "5px",
                              textAlign: "center",
                              borderRadius: "10px",
                            }
                      }
                      icon={
                        <img
                          style={{
                            height: "50px",
                            width: "50px",
                            objectFit: "contain",
                          }}
                          src={`http://${base_url}:${port}/images/sub_catagories/${section.SubCategoryIcon}`}
                        />
                      }
                      label={
                        <Typography
                          style={
                            activeSubCategory == section.sub_id
                              ? {
                                  color: "white",
                                  textTransform: "capitalize",
                                }
                              : {
                                  color: "black",
                                  textTransform: "capitalize",
                                }
                          }
                        >
                          {section.SubCategoryName}
                        </Typography>
                      }
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
            <Grid item xs={10}>
              <HorizontalScroller>{viewShow_HTMLTABLE}</HorizontalScroller>
            </Grid>
          </Grid>
        </Card>
      </Container>
      {/* <Footer /> */}
    </ThemeProvider>
  );
}
