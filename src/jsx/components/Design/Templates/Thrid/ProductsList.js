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
import getSymbolFromCurrency from "currency-symbol-map";

export default function ProductsList(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const cateId = atob(props.match.params.id);
  const SubCategoryName = props.history.location.state.SubCategoryName;

  const [products, setProducts] = useState([]);
  const [themeCustomization, setThemeCustomization] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetProductsBasedOnSubCategory/${cateId}`).then((res) => {
      if (res.data.status === 200) {
        setProducts(res.data.data);
        console.log(res.data.data);
      }
      setLoading(false);
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
          : 14,
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
        <Grid item xs={12} sm={6} md={6} key={i}>
          <Card sx={{ display: "flex" }}>
            <CardMedia
              component="img"
              sx={{
                height: "150px",
                width: "40%",
                borderRadius: "10%",
              }}
              image={`http://${base_url}:${port}/images/products/${item.image}`}
              alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Link
                to={{
                  pathname: `/thrid-template/products-list/product-details/${btoa(
                    item.id
                  )}`,
                  state: { themes: themeCustomization },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    className="font-weight-bold"
                  >
                    {item.ProductName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.Description}
                  </Typography>
                  <Typography
                    variant="button"
                    gutterBottom
                    className="font-weight-bold"
                  >
                    {item.price +
                      " " +
                      getSymbolFromCurrency(item.currency_code)}
                  </Typography>
                </CardContent>
              </Link>
            </Box>
          </Card>
        </Grid>
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className="p-2">
        <Grid item className="text-center">
          <Typography
            variant="button"
            gutterBottom
            className="font-weight-bold m-1"
          >
            {SubCategoryName}
          </Typography>
        </Grid>

        <Grid container spacing={2} className="mt-1">
          {viewShow_HTMLTABLE}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
