import React, { useState, useEffect, useContext } from "react";
import Footer from "../Common/Footer";
import Container from "@mui/material/Container";
import Header from "../Common/Header";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import getSymbolFromCurrency from "currency-symbol-map";

import { getVariations } from "../Functionality";
import CustomAlert from "../../../CustomAlert";
import ImageSlider from "./ImageSilder";
import "./imageSilder.css";
import { TemplateContext } from "../TemplateContext";
import axios from "axios";

const ProductDetails = () => {
  const {
    id,
    style,
    cart,
    setCart,
    locale,
    loading,
    fetchData,
    extra,
    productIngredients,
    deliveryFees,
    branchId,
  } = useContext(TemplateContext);
  const [swiper, setSwiper] = useState(null);

  let varData = [];
  //for retriving data using laravel API
  const [variantData, setVariantData] = useState([]);
  const [showVaralint, setShowVarlist] = useState([]);
  const [skuarray, setSkuArray] = useState([]);
  const [varPics, setVarPics] = useState([]);
  const [activeSKU, setActiveSKU] = useState([]);
  const [productDetails, setProductDetails] = useState({
    price: 0,
    stock: 0,
    image: fetchData?.image,
  });
  const getdata = () => {
    getVariations(id, source).then((res) => {
      if (res !== undefined) {
        if (res !== "") {
          varData = JSON.parse(res.variants);
          setVarPics(varData);
          parseVariants(varData);
        }
      }
    });
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    getdata();
    return () => {
      source.cancel();

      // parseVariants([]);
      // setVarPics([]);
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
  const changeIngredients = (value) => {
    if (!ingredients.includes(value) === false) {
      setIntgredients(ingredients.filter((item) => item !== value));
    } else {
      setIntgredients([...ingredients, value]);
    }
    // console.log(ingredients);
  };
  let [sum, setSum] = useState(0);
  const [extraValue, setExtraValue] = useState([]);

  const extraHandlers = (e, price, value) => {
    if (e.target.checked) {
      // console.log((sum += parseInt(price)));
      setSum((sum += parseInt(price)));
      setExtraValue([...extraValue, value]);
    } else {
      setSum((sum -= parseInt(price)));
      setExtraValue(extraValue.filter((item) => item != value));
    }
  };

  const addItem = () => {
    const check = cart.every((val) => {
      return val.id !== fetchData.id;
    });
    let array = [];
    if (check) {
      array.push({
        id: fetchData.id,
        qty: fetchData.qty,
        price: parseInt(
          productDetails.price == 0 ? fetchData?.price : productDetails.price
        ),
        stock: parseInt(
          productDetails.stock == 0 ? fetchData?.stock : productDetails.stock
        ),
        currency_code: fetchData.currency_code,
        ingredients: ingredients,
        extras: extraValue,
        recommendations: [],
        totalPrice: parseInt(fetchData.price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      // setFetchData(fetchData);
      localStorage.setItem("cart", JSON.stringify(cart.concat(array)));
      setCart(cart.concat(array));
      setAlerts(true, "success", locale?.successfully_added_to_cart);
    } else {
      let data = cart.filter((val) => {
        return val.id === fetchData.id;
      });
      array.push({
        id: data[0].id,
        qty: data[0].qty,
        price: parseInt(
          productDetails.price == 0 ? fetchData?.price : productDetails.price
        ),
        stock: parseInt(
          productDetails.stock == 0 ? fetchData?.stock : productDetails.stock
        ),
        currency_code: data[0].currency_code,
        ingredients: ingredients,
        extras: extraValue,
        recommendations: [],
        totalPrice: parseInt(parseInt(fetchData.price) + sum),
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      const otherData = cart.filter((val) => {
        return val.id !== fetchData.id;
      });
      localStorage.setItem("cart", JSON.stringify(otherData.concat(array)));
      setCart(otherData.concat(array));
      setAlerts(true, "success", locale?.cart_updated);
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
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = (
      <Card sx={style?.cardStyleDetails}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
            <ImageSlider
              varPics={varPics}
              setSwiper={setSwiper}
              style={style}
              fetchData={fetchData}
              {...{
                rimProps: {
                  enlargedImagePortalId: "portal",
                  enlargedImageContainerDimensions: {
                    width: "150%",
                    height: "100%",
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
            <div className="ml-3">
              <div
                className="fluid__instructions "
                style={{ position: "relative", zIndex: 999999 }}
              >
                <div id="portal" className="portal" />
              </div>
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
                  className="d-flex align-items-center justify-content-end "
                >
                  <button
                    className={`btn btn-sm mr-2 ${
                      skuarray.length != 0
                        ? productDetails.stock == "No Stock" ||
                          productDetails.stock == 0
                          ? "disabled"
                          : ""
                        : ""
                    } `}
                    onClick={addItem}
                    style={style?.buttonStyle}
                  >
                    {locale?.add_to_cart}
                  </button>
                </Grid>
              </Grid>
              <Typography style={style?.cartDescription}>
                {style?.preparation_time === 0 ||
                fetchData?.preparationTime == null ? (
                  ""
                ) : (
                  <>
                    {locale?.preparation_time}: {fetchData?.preparationTime}{" "}
                    {locale?.minutes}
                  </>
                )}
              </Typography>
              <Typography style={style?.cartPrice}>
                {locale?.price} :{" "}
                {productDetails.price === 0
                  ? (fetchData?.price + sum).toFixed(2)
                  : (parseInt(productDetails.price) + sum).toFixed(2)}
                {"  " + getSymbolFromCurrency(fetchData.currency_code)}
              </Typography>
              <Typography style={style?.cartPrice}>
                {locale?.stock}:{" "}
                {productDetails.stock === 0
                  ? fetchData?.stock
                  : productDetails.stock}
              </Typography>
              {style?.show_variants === 0 ||
              Object.keys(showVaralint).length === 0 ? (
                ""
              ) : (
                <>
                  <div>
                    <Typography style={style?.cartPrice}>
                      {locale?.variants}
                    </Typography>
                  </div>

                  <div>
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
                                <div
                                  className="col"
                                  key={z}
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
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {style?.show_ingredients === 0 ||
              productIngredients.length === 0 ? (
                ""
              ) : (
                <>
                  <div>
                    <Typography style={style?.cartPrice}>
                      {locale?.ingredients}
                    </Typography>
                    <Typography style={style?.cartDescription}>
                      {locale?.please_select_the_ingredients_you_want_to_remove}
                    </Typography>
                  </div>
                  <div>
                    {productIngredients?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            changeIngredients(item.value);
                          }}
                          style={
                            ingredients.includes(item.value)
                              ? style?.ingredientsActive
                              : style?.ingredientsDeActive
                          }
                        >
                          {/* {console.log(item)} */}
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
                <div>
                  <Typography style={style?.cartPrice}>
                    {locale?.extras}
                  </Typography>
                  {/* <FormGroup> */}
                  {extra?.map((item, i) => {
                    // console.log(item);
                    return (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            onChange={(e) => {
                              extraHandlers(e, item.price, item.value);
                            }}
                            color="default"
                            // size="small"
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
                  {/* </FormGroup> */}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
    );
  }
  return (
    <div style={style?.background}>
      <div style={{ zIndex: 99999999 }}>
        {alert.open && (
          <CustomAlert
            vertical="top"
            horizontal="right"
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            setAlert={setAlert}
          />
        )}
      </div>
      <Container maxWidth="lg" style={style?.varaintContainer}>
        <Header details={true} search={false} />
        {viewImages_HTMLTABLE}
      </Container>
      <Footer
        title={locale?.checkout}
        stock={
          productDetails.stock === 0 ? fetchData?.stock : productDetails.stock
        }
        url={{
          pathname: `/public/details/recommend/${btoa(btoa(btoa(id)))}`,
          state: {
            productName: fetchData.ProductName,
            picture: productDetails.image
              ? JSON.stringify(productDetails?.image)
              : fetchData?.image,

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
