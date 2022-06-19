import React, { useState, useEffect, useContext } from "react";
import { base_url, port } from "../../../../../../Consts";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import CardContent from "@mui/material/CardContent";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import "yup-phone";
import { getProduct, getVariations } from "../../Functionality";
import "react-phone-number-input/style.css";
import { TemplateContext } from "../../TemplateContext";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

const WishList = () => {
  let {
    style,
    branch,
    cart,
    setCart,
    locale,
    selectedLang,
    wishlist,
    setWishList,
  } = useContext(TemplateContext);
  const currency = getSymbolFromCurrency(branch?.currency_code);
  const [loading, setLoading] = useState(true);
  let [sum, setSum] = useState(0);
  const [fetchData, setFetchData] = useState([]);
  let source = axios.CancelToken.source();
  const dataLoad = async () => {
    let total = 0;
    let newArray = [];
    await wishlist.map((item) => {
      getProduct(item.id, selectedLang.id, source).then((result) => {
        if (result !== undefined) {
          if (result.data.fetchData.length !== 0) {
            let ingredientArray = [];
            result.data.ingredients.map((ingredient) => {
              if (item.ingredients.includes(ingredient.value)) {
                ingredientArray.push(ingredient.label);
              }
            });
            let extraArray = [];
            let extraTotal = 0;
            result.data.extras.map((extra) => {
              if (item.extras.includes(extra.value)) {
                extraArray.push(extra);
                extraTotal += extra.price;
              }
            });
            let recommendArray = [];
            let recomendTotal = 0;
            result.data.recommend.map((recom) => {
              item.recommendations.filter((recommend) => {
                if (recommend.value === recom.value) {
                  recommendArray.push({
                    ...recom,
                    qty: recommend.qty,
                  });
                  recomendTotal += recom.price * recommend.qty;
                }
              });
            });
            const itemFetchData = result.data.fetchData[0];
            if (item.checkSKU) {
              if (item.checkSKU.length != 0) {
                getVariations(item.id, source).then((res) => {
                  if (res !== undefined) {
                    if (res !== "") {
                      let varData = JSON.parse(res.variants).filter(
                        (variant) => variant.sku === item.checkSKU
                      );
                      if (varData.length !== 0) {
                        newArray.push({
                          ...itemFetchData,
                          ...item,
                          price: parseInt(varData[0].price),
                          stock: parseInt(varData[0].stock),
                          ingredients: ingredientArray,
                          totalPrice:
                            parseInt(varData[0].price) * item.qty +
                            extraTotal +
                            recomendTotal,
                          extras: extraArray,
                          recommendations: recommendArray,
                        });
                        total +=
                          parseInt(varData[0].price) * item.qty +
                          extraTotal +
                          recomendTotal;
                        setSum(total);
                      }
                    }
                  }
                });
              } else {
                newArray.push({
                  ...itemFetchData,
                  ...item,
                  ingredients: ingredientArray,
                  totalPrice:
                    itemFetchData.price * item.qty + extraTotal + recomendTotal,
                  extras: extraArray,
                  recommendations: recommendArray,
                });
                total +=
                  itemFetchData.price * item.qty + extraTotal + recomendTotal;
              }
            } else {
              newArray.push({
                ...itemFetchData,
                ...item,
                // totalPrice: 0,
                ingredients: ingredientArray,
                extras: extraArray,
                recommendations: recommendArray,
              });
              total += item.qty * itemFetchData.price;
            }
            setSum(total);
          } else {
            const filterData = wishlist.filter((check) => check.id != item.id);
            setWishList(filterData);
            localStorage.setItem("wishlist", JSON.stringify(filterData));
            console.log(filterData);
          }
        }
      });
    });
    await setFetchData(newArray);
    setLoading(false);
  };
  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoad();
    return () => {
      source.cancel();
    };
  }, []);

  const remItem = (id) => {
    setFetchData(fetchData.filter((item) => item.id != id));
    const data = wishlist.filter((item) => item.id != id);
    setWishList(data);
    localStorage.setItem("wishlist", JSON.stringify(data));
  };
  const addItem = (id) => {
    const checkData = wishlist.filter((item) => item.id == id);
    if (checkData.length != 0) {
      localStorage.setItem("cart", JSON.stringify(cart.concat(checkData)));
      setCart(cart.concat(checkData));
      const wishArray = wishlist.filter((item) => item.id != id);
      setWishList(wishArray);
      localStorage.setItem("wishlist", JSON.stringify(wishArray));
      setFetchData(fetchData.filter((item) => item.id != id));
    }
  };

  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border " role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = fetchData?.map((item, i) => {
      return (
        <Card key={i} sx={style?.card} className="mb-1">
          <div className="text-right">
            <Tooltip title={locale?.close}>
              <IconButton onClick={() => remItem(item.id)}>
                <ClearIcon sx={style.clearIcon} />
              </IconButton>
            </Tooltip>
          </div>

          <CardContent>
            <div className="row">
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12`
                }
                // className="col border"
                style={style?.cartImageDiv}
              >
                <img
                  style={style?.cartImage}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                />
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-4 col-md-6 col-lg-6 col-sm-6 col-12`
                }
                // className="col border"
                sx={style?.cartProductDiv}
              >
                <Typography style={style?.cartProductName}>
                  {item.ProductName}
                </Typography>
                {item.variantSKU === undefined
                  ? null
                  : item?.variantSKU.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.variants}: </b>

                        {item?.variantSKU?.map((val, i) => {
                          if (item?.variantSKU.length === i + 1) {
                            return val;
                          } else {
                            return val + ", ";
                          }
                        })}
                      </Typography>
                    )}
                <Typography
                  style={style?.cartPrice}
                  gutterBottom
                  className="font-weight-bold"
                >
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                {item.UnitName && (
                  <Typography style={style?.cartDescription} gutterBottom>
                    <b>{locale?.unit_name}:</b> {item.UnitName}
                  </Typography>
                )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-4 col-md-11 col-lg-11 col-sm-11 col-12`
                }
                style={style?.cartVariantDiv}
              >
                {" "}
                {item.ingredients === undefined
                  ? ""
                  : item.ingredients.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.ingredients}: </b>
                        {item.ingredients?.map((val, i) => {
                          if (item.ingredients.length === i + 1) {
                            return val + " - Not Included";
                          } else {
                            return val + ", ";
                          }
                        })}
                      </Typography>
                    )}
                {item.extras === undefined
                  ? ""
                  : item.extras.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.extras}: </b>

                        {item.extras?.map((val, i) => {
                          if (item?.extras.length === i + 1) {
                            return (
                              val.label + "(+" + val.price + ")" + " - Included"
                            );
                          } else {
                            return val.label + "(+" + val.price + ")" + " , ";
                          }
                        })}
                      </Typography>
                    )}
                {item.recommendations === undefined
                  ? ""
                  : item.recommendations.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.recommendation}: </b>

                        {item.recommendations?.map((val, i) => {
                          return (
                            val.label +
                            " (Qty: " +
                            val.qty +
                            " * " +
                            val.price +
                            " = " +
                            (val.price * val.qty).toFixed(2) +
                            " " +
                            currency +
                            " )"
                          );
                        })}
                      </Typography>
                    )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-1 col-md-1 col-lg-1 col-sm-1 col-12`
                }
                style={style?.cartCounterDiv}
              >
                <Tooltip title={locale?.add_to_cart}>
                  <IconButton onClick={() => addItem(item.id)}>
                    <ShoppingCartCheckoutIcon sx={style.favIconDeactive} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="row">
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-6 col-md-6 col-lg-6 col-sm-12 col-12`
                }
                style={style?.cartNoteDiv}
              >
                {item?.itemNote === undefined ? (
                  ""
                ) : (
                  <Typography
                    style={style?.cartDescription}
                    gutterBottom
                    className="mx-1"
                  >
                    <b>{locale?.item_note}: </b>
                    {item?.itemNote}
                  </Typography>
                )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-6 col-md-6 col-lg-6 col-sm-12 col-12 text-right`
                }
                style={style?.cartTotalDiv}
              >
                <Typography style={style?.cartDescription} gutterBottom>
                  <b>{locale?.total_price}: </b>
                  {item?.totalPrice !== undefined
                    ? item.totalPrice.toFixed(2)
                    : (parseInt(item.price) * item.qty).toFixed(2)}
                  {" " + currency}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  }
  return (
    <div>
      {wishlist.length === 0 ? (
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
          No Item Found
        </div>
      ) : (
        <>{viewImages_HTMLTABLE}</>
      )}
    </div>
  );
};

export default WishList;
