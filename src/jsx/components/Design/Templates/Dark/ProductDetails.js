import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Typography from "@mui/material/Typography";

import "react-slideshow-image/dist/styles.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import getSymbolFromCurrency from "currency-symbol-map";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
import Carousel from "react-bootstrap/Carousel";

import "../style.css";

const ProductDetails = (props) => {
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
  // for localization
  const { t } = useTranslation();
  const id = atob(props.match.params.id);
  //for retriving data using laravel API
  // const themes = props.history.location.state.themes;
  let varData = [];
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [showVaralint, setShowVarlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuarray, setSkuArray] = useState([]);
  const [productDetails, setProductDetails] = useState({
    price: 0,
    stock: 0,
    image: fetchData?.image,
  });
  useEffect(() => {
    const getdata = async () => {
      const product = await axios({
        method: "GET",
        url: `/api/GetProduct/${id}`,
      });
      const data = product.data.fetchData;

      const res = await axios({
        method: "GET",
        url: `/api/Getvariations/${id}`,
      });
      setFetchData(data[0]);

      if (res.data.fetchData !== "") {
        varData = JSON.parse(res.data.fetchData);
        parseVariants(varData);
      }

      setLoading(false);
    };
    getdata(); // axios
  }, [id]);
  const changePrice = (varName, variant) => {
    const keys = Object.keys(showVaralint);
    const varlineindex = keys.indexOf(varName);
    const newSkuArray = skuarray;
    newSkuArray[varlineindex] = variant;
    setSkuArray(newSkuArray);
    if (keys.length == newSkuArray.length) {
      caluclatePrice(newSkuArray, variantData);
    }
  };
  const caluclatePrice = (newSkuArray, variantData) => {
    let sku = id + "-";
    for (let i = 0; i < newSkuArray.length; i++) {
      if (i == newSkuArray.length - 1) {
        sku += newSkuArray[i];
      } else {
        sku += newSkuArray[i] + "-";
      }
    }

    const priceList = variantData.filter((item) => {
      return item.sku.replace(/\s+/g, "") == sku.replace(/\s+/g, "");
    });
    console.log(newSkuArray);
    let productdetails = { price: 0, stock: 0 };
    if (priceList.length !== 0) {
      const line = priceList.pop();
      const newProductDetails = {
        price: line.price,
        stock: line.stock,
        image: line.image,
      };
      productdetails = newProductDetails;
    } else {
      const newProductDetails = {
        price: 0,
        stock: "No Stock",
        image: fetchData.image,
      };
      productdetails = newProductDetails;
    }
    setProductDetails({ ...productdetails });
  };
  const parseVariants = (variantData) => {
    const variants = [];
    const savePostion = ["postion", "sku", "price", "stock", "image"];
    const varLine = variantData[0];
    const varlinekey = Object.keys(varLine);
    for (let i = 0; i < varlinekey.length; i++) {
      if (savePostion.indexOf(varlinekey[i]) == -1) {
        let listvar = variantData.map((item) => {
          return item[varlinekey[i]];
        });
        // get unique variants
        listvar = listvar.filter(
          (thing, index, self) =>
            index ===
            self.findIndex((t) => t.place === listvar.place && t === thing)
        );
        if (listvar[0] != 0) variants[varlinekey[i]] = listvar;
      }
    }
    let def = [];
    Object.keys(variants).map((item) => {
      def.push(variants[item][0]);
    });
    setSkuArray(def);
    caluclatePrice(def, variantData);
    setShowVarlist(variants);
    setVariantData(variantData);
  };
  const [ingredients, setIntgredients] = useState([]);
  const changeIngredients = (label) => {
    if (!ingredients.includes(label) === false) {
      setIntgredients(ingredients.filter((item) => item !== label));
    } else {
      setIntgredients([...ingredients, label]);
    }
    // console.log(ingredients);
  };
  let [sum, setSum] = useState(0);
  const [extraValue, setExtraValue] = useState([]);

  const extraHandlers = (e, price) => {
    if (e.target.checked) {
      // console.log((sum += parseInt(price)));
      setSum((sum += parseInt(price)));
      setExtraValue([
        ...extraValue,
        {
          value: e.target.value,
        },
      ]);
    } else {
      setSum((sum -= parseInt(price)));
      setExtraValue(extraValue.filter((item) => item.value != e.target.value));
    }
    console.log(extraValue);
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
    viewImages_HTMLTABLE = (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={5} lg={5}>
          <Carousel>
            {(() => {
              if (Array.isArray(productDetails.image)) {
                return productDetails.image?.map((image) => {
                  return (
                    <Carousel.Item key={image}>
                      <img
                        src={`http://${base_url}:${port}/images/variants_pics/${image}`}
                        // className="img-thumbnail"
                        alt=""
                        style={{
                          height: "200px",
                          width: "100%",
                          borderRadius: "5%",
                          objectFit: "contain",
                        }}
                      />
                    </Carousel.Item>
                  );
                });
              } else {
                return (
                  <Carousel.Item>
                    <img
                      style={{
                        height: "200px",
                        width: "100%",
                        borderRadius: "5%",
                        objectFit: "contain",
                      }}
                      src={
                        productDetails.stock === "No Stock" ||
                        productDetails?.stock === 0
                          ? `http://${base_url}:${port}/images/products/${
                              productDetails.image
                                ? productDetails?.image
                                : fetchData?.image
                            }`
                          : `http://${base_url}:${port}/images/variants_pics/${productDetails.image}`
                      }
                      alt=""
                    />
                  </Carousel.Item>
                );
              }
            })()}
          </Carousel>
        </Grid>

        <Grid item xs={12} sm={7} md={7} lg={7}>
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="row mx-3 mt-3">
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <Typography
                    variant="button"
                    style={{ textTransform: "capitalize" }}
                    // className="font-weight-bold"
                  >
                    {fetchData.ProductName}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <FavoriteIcon sx={{ color: "#ff751d" }} />
                </Grid>
              </Grid>

              <Typography variant="body2" gutterBottom>
                {fetchData?.Description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("preparation_Time")}: {fetchData?.preparationTime} Minutes
              </Typography>

              <Typography
                variant="body1"
                gutterBottom
                className="font-weight-bold"
              >
                {t("price")} :{" "}
                {productDetails.price === 0
                  ? fetchData?.price + sum
                  : parseInt(productDetails.price) + sum}
                {"  " + getSymbolFromCurrency(fetchData.currency_code)}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className="font-weight-bold"
              >
                {t("stock")}:{" "}
                {productDetails.stock === 0
                  ? fetchData?.stock
                  : productDetails.stock}
              </Typography>
            </div>
            <div className="row mx-3">
              <Typography variant="overline" gutterBottom>
                {t("ingredients")}
              </Typography>
              <small>Please select the ingredients you want to remove.</small>
            </div>
            <div className="row mx-4">
              {JSON.parse(fetchData.ingredients)?.map((item, i) => {
                return (
                  <div
                    className="col-md-auto col-sm-auto col-xl-auto col-lg-auto col-auto"
                    onClick={() => {
                      changeIngredients(item.label);
                    }}
                    style={
                      ingredients.includes(item.label)
                        ? {
                            cursor: "pointer",

                            padding: "3px",
                            margin: "2px",
                            border: "1px solid",
                            textAlign: "center",
                            borderRadius: "5px",
                            borderColor: "#ff751d",
                            textDecoration: "line-through",
                            color: "#ff751d",
                          }
                        : {
                            cursor: "pointer",
                            padding: "3px",
                            margin: "2px",
                            border: "1px solid",
                            textAlign: "center",
                            borderRadius: "5px",
                            borderColor: "black",
                          }
                    }
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="row mx-3">
              <Typography variant="overline" gutterBottom>
                {t("extras")}
              </Typography>
              <FormGroup>
                {JSON.parse(fetchData.extras)?.map((item, i) => {
                  return (
                    <FormControlLabel
                      key={i}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            extraHandlers(e, item.price);
                          }}
                          color="default"
                          sx={{
                            color: themeCustomization?.branch_name_color
                              ? themeCustomization.branch_name_color
                              : "#ff751d",
                          }}
                          value={
                            item.label + " ( +" + item.price + ".00" + " )"
                          }
                        />
                      }
                      label={
                        <Typography variant="body2" gutterBottom>
                          {item.label + " ( +" + item.price + ".00" + " )"}
                        </Typography>
                      }
                    />
                  );
                })}
              </FormGroup>
            </div>

            <div className="row mx-3">
              <Typography variant="overline" gutterBottom>
                {t("vatiants")}
              </Typography>
            </div>

            <div className="row mx-4 ">
              {Object.keys(showVaralint).map((list, i) => {
                return (
                  <div className="row m-1" key={i}>
                    {/* {list} */}
                    <div
                      className="row d-flex justify-content-around"
                      style={{
                        backgroundColor: "#2d3134",
                        borderRadius: "50px",
                        padding: "5px",
                      }}
                    >
                      {showVaralint[list].map((variant) => {
                        return (
                          <div className="col">
                            <div
                              onClick={() => {
                                changePrice(list, variant);
                              }}
                              style={
                                skuarray[i] == variant
                                  ? {
                                      cursor: "pointer",
                                      border: "1px solid",
                                      textAlign: "center",
                                      borderRadius: "50px",
                                      borderColor: "black",
                                      backgroundColor: "black",
                                    }
                                  : {
                                      cursor: "pointer",
                                      border: "1px solid",
                                      textAlign: "center",
                                      borderRadius: "50px",
                                      borderColor: "#2d3134",
                                      backgroundColor: "#2d3134",
                                    }
                              }
                            >
                              {variant}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Grid>
      </Grid>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className="mb-2">
        <Header subcategories={0} />
        {viewImages_HTMLTABLE}
      </Container>
      <Footer
        title="Checkout"
        url={{
          pathname: `/dark-template/product/order-details/${btoa(id)}`,
          state: {
            productName: fetchData.ProductName,
            picture: productDetails.image
              ? Array.isArray(productDetails.image)
                ? productDetails.image[0]
                : productDetails?.image
              : fetchData?.image,
            stock: productDetails.stock,
            price:
              productDetails.price === 0
                ? fetchData?.price + sum
                : parseInt(productDetails.price) + sum,
            countryCode: fetchData.currency_code,
            extraValue: extraValue,
            orignalPrice:
              productDetails.price === 0
                ? fetchData?.price
                : productDetails.price,
            ingredients: ingredients,
          },
        }}
      />
    </ThemeProvider>
  );
};

export default ProductDetails;
