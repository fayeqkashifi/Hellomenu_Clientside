import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
// import Slider from "react-slick";
import Header from "./Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Box from "@mui/material/Box";
import getSymbolFromCurrency from "currency-symbol-map";
import FormGroup from "@mui/material/FormGroup";

const OrderDetails = (props) => {
  const [themeCustomization, setThemeCustomization] = useState([]);

  // design start
  const theme = createTheme({
    palette: {
      mode: "dark",
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
          : "#fff",
      },
      // price
      body1: {
        fontSize: themeCustomization?.price_font_size
          ? themeCustomization.price_font_size
          : 16,
        color: themeCustomization?.price_color
          ? themeCustomization.price_color
          : "#fff",
      },
      // product Names
      button: {
        fontSize: themeCustomization?.product_name_font_size
          ? themeCustomization.product_name_font_size
          : 14,
        color: themeCustomization?.product_name_color
          ? themeCustomization.product_name_color
          : "#fff",
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
          : "#fff",
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
  const { t } = useTranslation();

  const productName = props.history.location.state.productName;
  const picture = props.history.location.state.picture;
  const stock = props.history.location.state.stock;
  const price = props.history.location.state.price;
  const orignalPrice = props.history.location.state.orignalPrice;
  const countryCode = props.history.location.state.countryCode;
  const extraValue = props.history.location.state.extraValue;
  const ingredients = props.history.location.state.ingredients;

  const id = atob(props.match.params.id);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      const product = await axios({
        method: "GET",
        url: `/api/GetProduct/${id}`,
      });
      const data = product.data.fetchData;
      setFetchData(data[0].recommendations);

      setLoading(false);
    };
    getdata(); // axios
  }, [id]);
  let [sum, setSum] = useState(0);

  const extraHandlers = (e, price) => {
    if (e.target.checked) {
      // console.log((sum += parseInt(price)));
      setSum((sum += parseInt(price)));
    } else {
      setSum((sum -= parseInt(price)));
    }
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
          {/* <span className="sr-only">{t("loading")}</span> */}
        </div>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = JSON.parse(fetchData)?.map((item, i) => {
      return (
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              color="default"
              onChange={(e) => {
                extraHandlers(e, item.price);
              }}
              sx={{
                color: themeCustomization?.branch_name_color
                  ? themeCustomization.branch_name_color
                  : "#ff751d",
              }}
            />
          }
          label={
            <Typography variant="body2" gutterBottom>
              {item.label +
                " ( +" +
                item.price +
                ".00 " +
                getSymbolFromCurrency(countryCode) +
                " )"}
            </Typography>
          }
        />
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header subcategories={0} />

        <Grid item xs={12} sm={12} md={12}>
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              style={{ height: "250px", width: "100%", objectFit: "contain" }}
              src={
                stock === "No Stock" || stock === 0
                  ? `http://${base_url}:${port}/images/products/${picture}`
                  : `http://${base_url}:${port}/images/variants_pics/${picture}`
              }
              alt="Image"
              // className="d-block w-100 img-thumbnail"
            />
            <FavoriteIcon sx={{ color: "#ff751d" }} className="mx-4 my-2" />

            <div className="row mx-3">
              <Typography
                variant="button"
                style={{ textTransform: "capitalize" }}
              >
                {productName}{" "}
                {orignalPrice + " " + getSymbolFromCurrency(countryCode)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {ingredients?.map((item, i) => {
                  if (ingredients.length == i + 1) {
                    return item + " - Not Includes";
                  } else {
                    return item + " , ";
                  }
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {extraValue?.map((item, i) => {
                  if (extraValue.length == i + 1) {
                    return item.value + " - Includes";
                  } else {
                    return item.value + " , ";
                  }
                })}
              </Typography>

              <Typography variant="overline" gutterBottom>
                {t("recommendation")}
              </Typography>
              <FormGroup>{viewImages_HTMLTABLE}</FormGroup>
            </div>
          </Card>
        </Grid>
      </Container>
      <Box
        component="footer"
        sx={{ bgcolor: "#2d3134", position: "sticky" }}
        className="bottom-0 text-center py-1"
      >
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Typography
              className="col-12 btn"
              style={{
                textTransform: "capitalize",
                color: "#ff751d",
              }}
            >
              {getSymbolFromCurrency(countryCode) +
                "  " +
                (parseInt(price) + sum)}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Link
              className="col-12 btn"
              style={{
                textTransform: "capitalize",
                backgroundColor: "#ff751d",
                color: "#f1fcfe",
              }}
            >
              Add
            </Link>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default OrderDetails;
