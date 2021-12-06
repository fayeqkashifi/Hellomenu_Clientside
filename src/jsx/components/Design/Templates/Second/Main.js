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
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import Toolbar from "@mui/material/Toolbar";
import HorizontalScroller from "react-horizontal-scroll-container";

var hold = 1;
export default function Main(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
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
    axios.get(`/api/GetBranchForShow/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranch(res.data.data[0]);
      }
    });
    axios.get(`/api/GetCategories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCategories(res.data.fetchData);
      }
    });
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.fetchData[0].sub_id);
        setSubCategories(res.data.fetchData);
        axios
          .get(
            `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_id}`
          )
          .then((res) => {
            if (res.data.status === 200) {
              setProducts(res.data.data);
              setActiveSubCategory(res.data.data[0]?.sub_category_id);
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
          : "#ff751d",
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
      h6: {
        fontSize: themeCustomization?.branch_name_font_size
          ? themeCustomization.branch_name_font_size
          : 14,
        color: themeCustomization?.branch_name_color
          ? themeCustomization.branch_name_color
          : "#ff751d",
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
        <Grid item xs={12} sm={12} md={12} key={i}>
          <Card
            sx={{
              width: "300px",
              height: "600px",
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
            <Link to={`/product-details/${btoa(item.product_id)}`}>
              <CardContent sx={{ flexGrow: 1 }} className="text-center">
                <Typography variant="button" display="block" gutterBottom>
                  {item.ProductName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {item.Description}
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
        <Header title={branch?.BrancheName} />
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: 600,
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons
                  aria-label="Vertical tabs example"
                  textColor="secondary"
                  indicatorColor="secondary"
                  sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                      "&.Mui-disabled": { opacity: 0.3 },
                    },
                  }}
                >
                  {subcategories?.map((section, i) => (
                    <Tab 
                    className="mb-2"
                    
                    // sx={{bgcolor:activeSubCategory === section.sub_id ? "green" : " "}}
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
                      label={section.SubCategoryName}
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
