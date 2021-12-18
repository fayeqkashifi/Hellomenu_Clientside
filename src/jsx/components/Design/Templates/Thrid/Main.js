import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  const [themeCustomization, setThemeCustomization] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    axios.get(`/api/GetCategories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCategories(res.data.fetchData);
        setActiveCategory(res.data.fetchData[0].id);
        // console.log(res.data.fetchData);
      }
    });
    axios.get(`/api/GetTempBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setThemeCustomization(res.data.fetchData[0]?.Customization);
        // console.log(res.data.fetchData[0].Customization);
      }
    });
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
      setLoading(false);
    });
  }, []);

  // design start
  const theme = createTheme({
    // overrides: {
    //   MuiButton: {
    //     root: {
    //       backgroundr: "#d6e0ec",
    //     },
    //   },
    // },
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
      subtitle2: {
        fontSize: themeCustomization?.branch_name_font_size
          ? themeCustomization.branch_name_font_size
          : 12,
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
  const filterCategory = (cateId) => {
    axios.get(`/api/GetSubCategories/${cateId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
      }
    });
    setActiveCategory(cateId);
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
    viewShow_HTMLTABLE = subcategories?.map((item, i) => {
      return (
        <Grid item xs={4} sm={4} md={2} key={i}>
          <Card
            sx={{
              // width: "300px",
              background: "#ffffff",

              border: "1px solid",
              textAlign: "center",
              borderRadius: "30px",
              borderColor: "#ffffff",
            }}
          >
            <Link
              to={{
                pathname: `/thrid-template/products-list/${btoa(item.sub_id)}`,
                state: {
                  themes: themeCustomization,
                  SubCategoryName: item.SubCategoryName,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }} className="text-center">
                <img
                  style={{
                    height: "80px",
                    width: "100px",
                    textAlign: "center",
                    borderRadius: "10%",
                  }}
                  className="mb-2"
                  src={`http://${base_url}:${port}/images/sub_catagories/${item.SubCategoryIcon}`}
                />
                <Typography
                  variant="subtitle2"
                  style={{ textTransform: "capitalize" }}
                  className="font-weight-bold"
                >
                  {item.SubCategoryName}
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
      <Container
        maxWidth="lg"
        className="p-2"
        // style={{ backgroundColor: "#d6e0ec" }}
      >
        <Grid item className="text-center">
          <Typography
            variant="button"
            gutterBottom
            className="font-weight-bold m-1"
          >
            {subcategories[0].BrancheName}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: "background.paper",
                display: "flex",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                value={value}
                onChange={handleChange}
                // variant="scrollable"
                // scrollButtons
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
                {categories?.map((section, i) => (
                  <Tab
                    onClick={() => filterCategory(section.id)}
                    style={
                      activeCategory == section.id
                        ? {
                            cursor: "pointer",
                            background: "#f6753b",
                            margin: "2px",
                            padding: "5px",
                            border: "1px solid",
                            textAlign: "center",
                            borderRadius: "10px",
                            borderColor: "#f6753b",
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
                          height: "40px",
                          width: "60px",
                          borderRadius: "10%",
                        }}
                        src={`http://${base_url}:${port}/images/catagories/${section.CategoryIcon}`}
                      />
                    }
                    label={
                      <Typography
                        style={
                          activeCategory == section.id
                            ? {
                                color: "white",
                                textTransform: "capitalize",
                              }
                            : {
                                color: "black",
                                textTransform: "capitalize",
                              }
                        }
                        className="font-weight-bold"
                      >
                        {section.CategoryName}
                      </Typography>
                    }
                  />
                ))}
              </Tabs>
            </Box>
          </Grid>
          <Grid container spacing={2} style={{ marginLeft: "1px" }}>
            {viewShow_HTMLTABLE}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
