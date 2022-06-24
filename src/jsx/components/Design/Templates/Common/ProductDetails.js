import React, { useState, useEffect, useContext } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import getSymbolFromCurrency from "currency-symbol-map";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { getVariations } from "../Functionality";
import ImageSlider from "./ImageSilder";
import "./imageSilder.css";
import { TemplateContext } from "../TemplateContext";
import { LanguagesContext } from "../LanguagesContext";
import axios from "axios";
import Recommend from "./Recommend";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Tooltip from "@mui/material/Tooltip";

const ProductDetails = (props) => {
  const {
    branch,
    style,
    cart,
    setCart,
    locale,
    wishlist,
    setWishList,
    setAlerts,
  } = useContext(TemplateContext);
  const { fetchData, recommend } = useContext(LanguagesContext);
  const { id, extra, productIngredients } = props;
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
  const [note, setNote] = useState([]);

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
    };
  }, []);
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
  };
  let [sum, setSum] = useState(0);
  const [extraValue, setExtraValue] = useState([]);

  const extraHandlers = (e, price, value) => {
    if (e.target.checked) {
      setSum((sum += parseInt(price)));
      setExtraValue([...extraValue, value]);
    } else {
      setSum((sum -= parseInt(price)));
      setExtraValue(extraValue.filter((item) => item != value));
    }
  };

  const addItem = () => {
    added(cart, setCart, btoa("cart" + branch.id));
    // remove from wishlist
    const wishCheck = wishlist.every((item) => {
      return item.id !== fetchData.id;
    });
    if (!wishCheck) {
      const filterData = wishlist.filter((item) => item.id !== fetchData.id);
      setWishList(filterData);
      localStorage.setItem(
        btoa("wishlist" + branch.id),
        JSON.stringify(filterData)
      );
    }
  };

  const added = (stateName, setStateName, name) => {
    const recom = recommend.map((item) => {
      if (item.show) {
        const array = {
          value: item.value,
          qty: item.qty,
        };
        return array;
      }
    });
    const check = stateName.every((val) => {
      return val.id !== fetchData.id;
    });
    let array = [];
    if (check) {
      array.push({
        id: fetchData.id,
        qty: fetchData.qty,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        // totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      localStorage.setItem(name, JSON.stringify(stateName.concat(array)));
      setStateName(stateName.concat(array));
      setAlerts(true, "success", locale?.successfully_added);
    } else {
      let data = stateName.filter((val) => {
        return val.id === fetchData.id;
      });
      array.push({
        id: data[0].id,
        qty: data[0].qty,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        // totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      const otherData = stateName.filter((val) => {
        return val.id !== fetchData.id;
      });
      localStorage.setItem(name, JSON.stringify(otherData.concat(array)));
      setStateName(otherData.concat(array));
      setAlerts(true, "success", locale?.updated);
    }
  };
  const addWishList = (id) => {
    const check = cart.every((item) => {
      return item.id !== id;
    });
    if (check) {
      added(wishlist, setWishList, btoa("wishlist" + branch.id));
    } else {
      setAlerts(true, "warning", locale?.item_is_already_in_cart);
    }
  };

  return (
    <div className="py-3">
      <Container maxWidth="lg " style={style?.varaintContainer}>
        {/* <Header details={true} search={false} /> */}
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
              <div className="ml-2">
                <div
                  className="fluid__instructions "
                  style={{ position: "relative", zIndex: 999999 }}
                >
                  <div id="portal" className="portal" />
                </div>
                <Grid container spacing={1}>
                  <Grid
                    item
                    sm={10}
                    md={10}
                    lg={10}
                    xl={12}
                    xs={12}
                    className="d-flex align-items-center justify-content-left"
                  >
                    <Typography style={style?.price}>
                      {fetchData.ProductName}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    md={2}
                    lg={2}
                    xl={12}
                    xs={12}
                    className="d-flex align-items-center justify-content-end"
                  >
                    <Tooltip title={locale?.add_to_wishlist}>
                      <IconButton onClick={() => addWishList(fetchData.id)}>
                        {style.template === "thrid" ? (
                          <ShoppingBasketOutlinedIcon
                            sx={
                              wishlist.every(
                                (value) => value.id !== fetchData.id
                              )
                                ? style?.favIconDeactive
                                : style?.favIconActive
                            }
                          />
                        ) : wishlist.every(
                            (value) => value.id !== fetchData.id
                          ) ? (
                          <FavoriteBorderIcon sx={style?.favIconDeactive} />
                        ) : (
                          <FavoriteIcon sx={style?.favIconActive} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={locale?.add_to_cart}>
                      <IconButton
                        // style={style?.cardIconButton}
                        className={`${
                          skuarray.length != 0
                            ? productDetails.stock == "No Stock" ||
                              productDetails.stock == 0
                              ? "disabled"
                              : ""
                            : ""
                        } `}
                        onClick={addItem}
                      >
                        {cart.every((value) => value.id !== fetchData.id) ? (
                          <AddShoppingCartIcon sx={style?.favIconDeactive} />
                        ) : (
                          <AddShoppingCartIcon sx={style?.favIconActive} />
                        )}
                      </IconButton>
                    </Tooltip>
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
                    <>
                      <Typography style={style?.cartPrice}>
                        {locale?.ingredients}
                      </Typography>
                      <Typography style={style?.cartDescription}>
                        {
                          locale?.please_select_the_ingredients_you_want_to_remove
                        }
                      </Typography>
                    </>
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
                      return (
                        <FormControlLabel
                          key={i}
                          control={
                            <Checkbox
                              onChange={(e) => {
                                extraHandlers(e, item.price, item.value);
                              }}
                              color="default"
                              size="small"
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
                  </div>
                )}
                <Recommend note={note} setNote={setNote} />
              </div>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </div>
  );
};

export default ProductDetails;
