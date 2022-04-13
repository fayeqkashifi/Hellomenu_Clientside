import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Import css files
import Footer from "../Common/Footer";
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
import { getProduct, getVariations } from "../Functionality";
import CustomAlert from "../../../CustomAlert";

SwiperCore.use([Navigation, Thumbs]);

const ProductDetails = (props) => {
  // for localization
  const { id, style, branchId, deliveryFees } = props;
  const { t } = useTranslation();
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
  const [productIngredients, setProductIntgredients] = useState([]);
  const [extra, setExtra] = useState([]);

  useEffect(() => {
    const getdata = () => {
      getProduct(id).then((result) => {
        setFetchData(result.data.fetchData[0]);
        setProductIntgredients(result.data.ingredients);
        setExtra(result.data.extras);
        setLoading(false);
      });
      getVariations(id).then((res) => {
        if (res !== "") {
          varData = JSON.parse(res.variants);
          setVarPics(varData);
          parseVariants(varData);
        }
      });
    };
    getdata();
    return () => {
      // parseVariants([]);
      // setVarPics([]);
      // setFetchData([]);
      setLoading(true);
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
  const addItem = () => {
    const check = cart.every((val) => {
      return val.id !== fetchData.id;
    });
    if (check) {
      fetchData.extras = extraValue;
      fetchData.ingredients = ingredients;
      fetchData.recommendations = [];
      fetchData.totalPrice = (parseInt(fetchData.price) + sum).toFixed(2);
      fetchData.variantSKU = skuarray;
      fetchData.checkSKU = activeSKU;
      setFetchData(fetchData);
      localStorage.setItem("cart", JSON.stringify(cart.concat(fetchData)));
      setCart(cart.concat(fetchData));
      setAlerts(true, "success", "Successfully added to cart");
    } else {
      let data = cart.filter((val) => {
        return val.id === fetchData.id;
      });
      data[0].extras = extraValue;
      data[0].ingredients = ingredients;
      data[0].recommendations = [];
      data[0].totalPrice = (parseInt(fetchData.price) + sum).toFixed(2);
      data[0].variantSKU = skuarray;
      data[0].checkSKU = activeSKU;
      const otherData = cart.filter((val) => {
        return val.id !== fetchData.id;
      });
      localStorage.setItem("cart", JSON.stringify(otherData.concat(data)));
      setCart(otherData.concat(data));
      setAlerts(true, "success", "Cart Updated");
    }
  };
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
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
      <Card sx={style?.cardStyle}>
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
                      className="mySwiper2 mt-3 mb-1"
                    >
                      {varPics?.map((section) => {
                        return section.image?.map((image, i) => {
                          return (
                            <SwiperSlide key={image}>
                              <img
                                src={`http://${base_url}:${port}/images/products/${image}`}
                                alt=""
                                style={style?.variantsImage}
                              />
                            </SwiperSlide>
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
                      className="mySwiper mb-3 mx-3"
                    >
                      {varPics?.map((section) => {
                        return section.image?.map((image) => {
                          return (
                            <SwiperSlide key={image}>
                              <img
                                src={`http://${base_url}:${port}/images/products/${image}`}
                                alt=""
                                style={style?.variantsThumbs}
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
                      // thumbs={{ swiper: thumbsSwiper }}
                      onSwiper={(s) => {
                        setSwiper(s);
                      }}
                      className="mySwiper2 mt-3 mb-1"
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
                                  : `http://${base_url}:${port}/images/products/${productDetails.image}`
                              }
                              alt=""
                              style={style?.variantsImage}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                    <Swiper
                      // onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={5}
                      freeMode={true}
                      watchSlidesProgress={true}
                      className="mySwiper mb-3 mx-3"
                    >
                      {JSON.parse(fetchData.image)?.map((image) => {
                        return (
                          <SwiperSlide key={image}>
                            <img
                              src={`http://${base_url}:${port}/images/products/${image}`}
                              alt=""
                              style={style?.variantsThumbs}
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
            <div className="row ml-3 my-3">
              <Grid container spacing={1}>
                <Grid
                  item
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                  xs={12}
                  className="d-flex align-items-center justify-content-left"
                >
                  <Typography style={style?.price}>
                    {fetchData.ProductName}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  xs={2}
                  className="d-flex align-items-center justify-content-right"
                >
                  <FavoriteIcon style={style?.favIconActive} />
                </Grid>
                <Grid
                  item
                  sm={3}
                  md={3}
                  lg={3}
                  xl={3}
                  xs={10}
                  className="d-flex align-items-center justify-content-righ"
                >
                  <button
                    className="btn btn-sm"
                    onClick={addItem}
                    style={style?.buttonStyle}
                  >
                    {t("add_to_cart")}
                  </button>
                </Grid>
              </Grid>

              <Typography style={style?.cartDescription}>
                {fetchData?.Description}
              </Typography>
              <Typography style={style?.cartDescription}>
                {style?.preparation_time === 0 ||
                fetchData?.preparationTime == null ? (
                  ""
                ) : (
                  <>
                    {t("preparation_time")}: {fetchData?.preparationTime}{" "}
                    Minutes
                  </>
                )}
              </Typography>

              <Typography style={style?.cartPrice}>
                {t("price")} :{" "}
                {productDetails.price === 0
                  ? (fetchData?.price + sum).toFixed(2)
                  : (parseInt(productDetails.price) + sum).toFixed(2)}
                {"  " + getSymbolFromCurrency(fetchData.currency_code)}
              </Typography>
              <Typography style={style?.cartPrice}>
                {t("stock")}:{" "}
                {productDetails.stock === 0
                  ? fetchData?.stock
                  : productDetails.stock}
              </Typography>
            </div>
            {style?.show_ingredients === 0 ||
            productIngredients.length === 0 ? (
              ""
            ) : (
              <>
                <div className="row mx-3">
                  <Typography style={style?.cartPrice}>
                    {t("ingredients")}
                  </Typography>
                  <Typography style={style?.cartDescription}>
                    Please select the ingredients you want to remove.
                  </Typography>
                </div>
                <div className="row mx-4">
                  {productIngredients?.map((item, i) => {
                    return (
                      <div
                        key={i}
                        className="col-md-auto col-sm-auto col-xl-auto col-lg-auto col-auto"
                        onClick={() => {
                          changeIngredients(item.label);
                        }}
                        style={
                          ingredients.includes(item.label)
                            ? style?.ingredientsActive
                            : style?.ingredientsDeActive
                        }
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {style?.show_extras === 0 || extra.length === 0 ? (
              ""
            ) : (
              <div className="row mx-3">
                <Typography style={style?.cartPrice}>{t("extras")}</Typography>
                <FormGroup>
                  {extra?.map((item, i) => {
                    return (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            onChange={(e) => {
                              extraHandlers(e, item.price);
                            }}
                            color="default"
                            sx={style?.checkbox}
                            value={
                              item.label + " ( +" + item.price + ".00" + " )"
                            }
                          />
                        }
                        label={
                          <Typography style={style?.cartDescription}>
                            {item.label + " ( +" + item.price + ".00" + " )"}
                          </Typography>
                        }
                      />
                    );
                  })}
                </FormGroup>
              </div>
            )}
            {style?.show_variants === 0 ||
            Object.keys(showVaralint).length === 0 ? (
              ""
            ) : (
              <>
                <div className="row mx-3">
                  <Typography style={style?.cartPrice}>
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
                          style={style?.variantsDiv}
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
                                      ? style?.variantActive
                                      : style?.variantDeActive
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
          </Grid>
        </Grid>
      </Card>
    );
  }
  return (
    <div style={style?.background}>
      {alert.open && (
        <CustomAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      )}
      <Container maxWidth="lg" style={style?.varaintContainer}>
        <Header
          search={false}
          style={style}
          cart={cart}
          branchId={branchId}
          setCart={setCart}
          deliveryFees={deliveryFees}
        />
        {viewImages_HTMLTABLE}
      </Container>
      <Footer
        title="Checkout"
        style={style}
        branchId={branchId}
        setCart={setCart}
        stock={
          productDetails.stock === 0 ? fetchData?.stock : productDetails.stock
        }
        cart={cart}
        deliveryFees={deliveryFees}
        url={{
          pathname: `/public/details/recommend/${btoa(btoa(btoa(id)))}`,
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
            style: style,
            skuarray: skuarray,
            activeSKU: activeSKU,
            orignalStock: productDetails.stock,
            branchId: branchId,
            deliveryFees: deliveryFees,
          },
        }}
      />
    </div>
  );
};

export default ProductDetails;
