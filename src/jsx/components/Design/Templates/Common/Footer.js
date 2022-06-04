import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import Drawer from "./Drawer";
import { TemplateContext } from "../TemplateContext";
import { getProduct, getVariations } from "../Functionality";
import axios from "axios";

function Footer(props) {
  const { style, cart, deliveryFees, locale, selectedLang } =
    useContext(TemplateContext);
  const { title, url, stock } = props;
  let [sum, setSum] = useState(0);
  const [fetchData, setFetchData] = useState([]);

  const dataLoad = async () => {
    let total = 0;
    let newArray = [];
    if (cart.length != 0) {
      await cart.map((item) => {
        getProduct(item.id, selectedLang.id, source).then((result) => {
          if (result !== undefined) {
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
                setSum(total);
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
              setSum(total);
            }
          }
        });
      });
    } else {
      setSum(total);
    }
    await setFetchData(newArray);
  };
  let source = axios.CancelToken.source();
  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoad();
    return () => {
      source.cancel();
    };
  }, [cart]);
  // useEffect(() => {
  //   let count = 0;
  //   cart.map(
  //     (item) =>
  //       (count +=
  //         item.totalPrice === undefined
  //           ? item.price * item.qty
  //           : parseInt(item.totalPrice) + item.price * (item.qty - 1))
  //   );
  //   setSum(count);
  //   return () => {
  //     setSum(0);
  //   };
  // }, [cart]);
  const [modalCentered, setModalCentered] = useState(false);
  return (
    <>
      <Box component="footer" sx={style?.footerStyle} className="bottom-0 mt-5">
        <Grid container spacing={2}>
          <Grid item xs={2} lg={2} xl={2} sm={2} md={2}>
            <Link
              className={`col-12 btn border-1 border-solid border-white text-white`}
              // style={style?.buttonStyle}
              to="/track-order"
            >
              Track Order
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            lg={4}
            xl={4}
            sm={4}
            md={4}
            className="d-flex align-items-center justify-content-center"
          >
            <Typography style={style?.cartDescription}>
              {locale?.sub_total}
              <br></br>
              {sum.toFixed(2) +
                "  " +
                (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
                  ? " "
                  : getSymbolFromCurrency(cart[0]?.currency_code))}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            lg={4}
            xl={4}
            sm={4}
            md={4}
            className="d-flex align-items-center justify-content-center"
          >
            <Typography style={style?.cartDescription}>
              {locale?.delivery_fee}
              <br></br>
              {deliveryFees.toFixed(2) +
                "  " +
                (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
                  ? " "
                  : getSymbolFromCurrency(cart[0]?.currency_code))}
            </Typography>
          </Grid>
          <Grid item xs={2} lg={2} xl={2} sm={2} md={2}>
            {url !== undefined ? (
              <Link
                className={`col-12 btn ${
                  stock == "No Stock" || stock == 0 ? "disabled" : ""
                } `}
                style={style?.buttonStyle}
                to={url}
              >
                {title}
              </Link>
            ) : (
              <button
                className="col-12 btn"
                onClick={() => setModalCentered(true)}
                style={style?.buttonStyle}
              >
                {title}
              </button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Drawer
        modalCentered={modalCentered}
        setModalCentered={setModalCentered}
        checkBit={true}
      />
    </>
  );
}

export default Footer;
