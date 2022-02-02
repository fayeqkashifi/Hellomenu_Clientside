import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Import css files
import Footer from "../Common/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "../Common/Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import getSymbolFromCurrency from "currency-symbol-map";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import { getProduct, getvariations } from "../Functionality";
SwiperCore.use([Navigation, Thumbs]);

const ProductDetails = (props) => {
  // for localization
  const { t } = useTranslation();
  const id = atob(props.match.params.id);
  const custom = props.history.location.state.custom;
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);
  const branch = props.history.location.state.branch;

  // design start
  const theme = createTheme({
    palette: {
      background: {
        default: custom?.bgColor ? custom.bgColor : "#22252a",
      },
    },
    typography: {
      fontFamily: custom?.font ? custom.font : "sans-serif",
      // discription
      subtitle1: {
        fontSize: custom?.pDiscriptionSize
          ? custom.pDiscriptionSize + "rem"
          : "0.75rem",

        color: custom?.product_discription_color
          ? custom.product_discription_color
          : "#fff",
      },
      // price
      body1: {
        fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
        color: custom?.price_color ? custom.price_color : "#fff",
      },
      // product Names
      button: {
        fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
        color: custom?.product_name_color ? custom.product_name_color : "#fff",
      },
      // Menus
      h6: {
        fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
        color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
      },
    },
  });
  // design end
  const [swiper, setSwiper] = useState(null);

  let varData = [];
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [showVaralint, setShowVarlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuarray, setSkuArray] = useState([]);
  const [varPics, setVarPics] = useState([]);
  const [activeSKU, setActiveSKU] = useState([]);
  const [productDetails, setProductDetails] = useState({
    price: 0,
    stock: 0,
    image: fetchData?.image,
  });
  useEffect(() => {
    let unmounted = false;

    const getdata = async () => {
      getProduct(id).then((result) => {
        setFetchData(result.data.fetchData[0]);
      });
      getvariations(id).then((res) => {
        if (res !== "") {
          varData = JSON.parse(res.variants);
          setVarPics(JSON.parse(res.variants));
          parseVariants(varData);
        }
        setLoading(false);
      });
    };
    getdata(); // axios
    return () => {
      unmounted = true;
    };
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
    if (swiper) {
      let counter = 0;
      varPics.map((section) => {
        section.image.map((image, i) => {
          if (Array.isArray(productDetails.image)) {
            if (image === productDetails.image[0]) {
              swiper.slideTo(counter);
            }
          } else {
            swiper.slideTo(0);
          }

          counter++;
        });
      });
    }
    setActiveSKU(sku);
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
  };
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="container">
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
        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
          {(() => {
            if (varPics.length != 0) {
              return (
                <div className="swiper">
                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    spaceBetween={10}
                    speed={2500}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    onSwiper={(s) => {
                      setSwiper(s);
                    }}
                    className="mySwiper2 m-1"
                  >
                    {varPics?.map((section) => {
                      return section.image?.map((image, i) => {
                        return (
                          <>
                            <SwiperSlide key={image}>
                              <img
                                src={`http://${base_url}:${port}/images/variants_pics/${image}`}
                                alt=""
                                style={{
                                  height: "400px",
                                  width: "100%",
                                  borderRadius: "5%",
                                  objectFit: "contain",
                                }}
                              />
                            </SwiperSlide>
                          </>
                        );
                      });
                    })}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={5}
                    freeMode={true}
                    watchSlidesProgress={true}
                    className="mySwiper m-1"
                  >
                    {varPics?.map((section) => {
                      return section.image?.map((image) => {
                        return (
                          <SwiperSlide
                            // onSwiper={productDetails.image[0]}
                            key={image}
                          >
                            <img
                              src={`http://${base_url}:${port}/images/variants_pics/${image}`}
                              alt=""
                              style={{
                                height: "70px",
                                width: "100%",
                                borderRadius: "5%",
                                // objectFit: "contain",
                              }}
                            />
                          </SwiperSlide>
                        );
                      });
                    })}
                  </Swiper>
                </div>
              );
            } else {
              return (
                <div className="swiper">
                  <Swiper
                    spaceBetween={10}
                    speed={2500}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    onSwiper={(s) => {
                      setSwiper(s);
                    }}
                    className="mySwiper2 m-1"
                  >
                    {JSON.parse(fetchData.image).map((image) => {
                      return (
                        <SwiperSlide key={image}>
                          <img
                            src={
                              productDetails.stock === "No Stock" ||
                              productDetails?.stock === 0
                                ? `http://${base_url}:${port}/images/products/${
                                    productDetails.image
                                      ? productDetails?.image
                                      : image
                                  }`
                                : `http://${base_url}:${port}/images/variants_pics/${productDetails.image}`
                            }
                            alt=""
                            style={{
                              height: "400px",
                              width: "100%",
                              borderRadius: "5%",
                              objectFit: "contain",
                            }}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={5}
                    freeMode={true}
                    watchSlidesProgress={true}
                    className="mySwiper m-1"
                  >
                    {JSON.parse(fetchData.image)?.map((image) => {
                      return (
                        <SwiperSlide
                          // onSwiper={productDetails.image[0]}
                          key={image}
                        >
                          <img
                            src={`http://${base_url}:${port}/images/products/${image}`}
                            alt=""
                            style={{
                              height: "70px",
                              width: "100%",
                              borderRadius: "5%",
                              // objectFit: "contain",
                            }}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              );
            }
          })()}
        </Grid>

        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "5%",
              backgroundColor: custom?.BgColor ? custom.BgColor : "#22252a",
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

              <Typography variant="subtitle1" gutterBottom>
                {fetchData?.Description}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {custom?.preparation_time === 0 ||
                fetchData?.preparationTime == null ? (
                  ""
                ) : (
                  <>
                    {t("preparation_Time")}: {fetchData?.preparationTime}{" "}
                    Minutes
                  </>
                )}
              </Typography>

              <Typography
                variant="body1"
                gutterBottom
                className="font-weight-bold"
              >
                {t("price")} :{" "}
                {productDetails.price === 0
                  ? (fetchData?.price + sum).toFixed(2)
                  : (parseInt(productDetails.price) + sum).toFixed(2)}
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
            {custom?.show_ingredients === 0 ||
            JSON.parse(fetchData.ingredients).length === 0 ? (
              ""
            ) : (
              <>
                <div className="row mx-3">
                  <Typography variant="h6" gutterBottom>
                    {t("ingredients")}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Please select the ingredients you want to remove.
                  </Typography>
                </div>
                <div className="row mx-4">
                  {JSON.parse(fetchData.ingredients)?.map((item, i) => {
                    return (
                      <div
                        key={i}
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
                                borderColor: custom?.menusAcriveColor
                                  ? custom.menusAcriveColor
                                  : "#f27d1e",
                                textDecoration: "line-through",
                                color: custom?.menusAcriveColor
                                  ? custom.menusAcriveColor
                                  : "#f27d1e",
                                fontSize: custom?.pDiscriptionSize
                                  ? custom.pDiscriptionSize + "rem"
                                  : "0.75rem",
                              }
                            : {
                                cursor: "pointer",
                                padding: "3px",
                                margin: "2px",
                                border: "1px solid",
                                textAlign: "center",
                                borderRadius: "5px",
                                borderColor: custom?.menusDeactiveColor
                                  ? custom.menusDeactiveColor
                                  : "#fff",
                                color: custom?.menusDeactiveColor
                                  ? custom.menusDeactiveColor
                                  : "#fff",
                                fontSize: custom?.pDiscriptionSize
                                  ? custom.pDiscriptionSize + "rem"
                                  : "0.75rem",
                              }
                        }
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {custom?.show_extras === 0 ||
            JSON.parse(fetchData.extras).length === 0 ? (
              ""
            ) : (
              <div className="row mx-3">
                <Typography variant="h6" gutterBottom>
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
                              color: custom?.menusAcriveColor
                                ? custom.menusAcriveColor
                                : "#ff751d",
                            }}
                            value={
                              item.label + " ( +" + item.price + ".00" + " )"
                            }
                          />
                        }
                        label={
                          <Typography variant="subtitle1" gutterBottom>
                            {item.label + " ( +" + item.price + ".00" + " )"}
                          </Typography>
                        }
                      />
                    );
                  })}
                </FormGroup>
              </div>
            )}
            {custom?.show_variants === 0 ||
            Object.keys(showVaralint).length === 0 ? (
              ""
            ) : (
              <>
                <div className="row mx-3">
                  <Typography variant="h6" gutterBottom>
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
                            backgroundColor: custom?.cardBgColor
                              ? custom.cardBgColor
                              : "#2d3134",
                            borderRadius: "50px",
                            padding: "5px",
                          }}
                        >
                          {showVaralint[list].map((variant, z) => {
                            return (
                              <div className="col" key={z}>
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
                                          backgroundColor:
                                            custom?.menusAcriveColor
                                              ? custom.menusAcriveColor
                                              : "black",
                                          color: custom?.menusDeactiveColor
                                            ? custom.menusDeactiveColor
                                            : "#fff",
                                        }
                                      : {
                                          cursor: "pointer",
                                          border: "1px solid",
                                          textAlign: "center",
                                          borderRadius: "50px",
                                          borderColor: "#2d3134",
                                          backgroundColor: "#2d3134",
                                          color: custom?.menusDeactiveColor
                                            ? custom.menusDeactiveColor
                                            : "#fff",
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
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" style={{ marginBottom: "100px" }}>
        <Header
          theme={custom}
          cart={cart}
          branch={branch}
          setCart={setCart}
          deliveryFees={deliveryFees}
        />
        {viewImages_HTMLTABLE}
      </Container>
      <Footer
        title="Checkout"
        theme={custom}
        branch={branch}
        setCart={setCart}
        theme={custom}
        stock={
          productDetails.stock === 0 ? fetchData?.stock : productDetails.stock
        }
        cart={cart}
        deliveryFees={deliveryFees}
        url={{
          pathname: `/dark-template/product/order-details/${btoa(id)}`,
          state: {
            productName: fetchData.ProductName,

            picture: productDetails.image
              ? JSON.stringify(productDetails?.image)
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
            custom: custom,
            skuarray: skuarray,
            activeSKU: activeSKU,
            orignalStock: productDetails.stock,
            branch: branch,
            deliveryFees: deliveryFees,
          },
        }}
      />
    </ThemeProvider>
  );
};

export default ProductDetails;
