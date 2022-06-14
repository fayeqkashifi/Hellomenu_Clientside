import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import Drawer from "./Drawer";
import { TemplateContext } from "../../TemplateContext";
import { getProduct, getVariations } from "../../Functionality";
import axios from "axios";

function Footer(props) {
  const { style, cart, setCart, deliveryFees, locale, selectedLang } =
    useContext(TemplateContext);
  const { title, url, stock } = props;
  let [sum, setSum] = useState(0);
  const [check, setCheck] = useState(false);
  const dataLoad = async () => {
    var total = 0;
    if (cart.length != 0) {
      await cart.map((item) => {
        setCheck(false);
        getProduct(item.id, selectedLang.id, source).then((result) => {
          if (result !== undefined) {
            if (result.data.fetchData.length !== 0) {
              let extraTotal = 0;
              result.data.extras.map((extra) => {
                if (item.extras.includes(extra.value)) {
                  extraTotal += extra.price;
                }
              });
              let recomendTotal = 0;
              result.data.recommend.map((recom) => {
                item.recommendations.filter((recommend) => {
                  if (recommend.value === recom.value) {
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
                          total +=
                            parseInt(varData[0].price) * item.qty +
                            extraTotal +
                            recomendTotal;
                          setSum(total);
                        } else {
                          const filterData = cart.filter(
                            (check) => check.id != item.id
                          );
                          setCart(filterData);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(filterData)
                          );
                        }
                      }
                    }
                  });
                } else {
                  total +=
                    itemFetchData.price * item.qty + extraTotal + recomendTotal;
                }
              } else {
                total += item.qty * itemFetchData.price;
              }
              setSum(total);
            } else {
              const filterData = cart.filter((check) => check.id != item.id);
              setCart(filterData);
              localStorage.setItem("cart", JSON.stringify(filterData));
            }
          }
        });
      });
    } else {
      setSum(total);
    }
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

  const [modalCentered, setModalCentered] = useState(false);
  return (
    <>
      <Box component="footer" sx={style?.footerStyle} className=" mt-5">
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            lg={4}
            xl={4}
            sm={6}
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
            xs={6}
            lg={4}
            xl={4}
            sm={6}
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
          <Grid item xs={12} lg={4} xl={4} sm={12} md={4}>
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
          {/* <Grid item xs={2} lg={2} xl={2} sm={2} md={2}>
            <Link
              className={`col-12 btn`}
              style={style?.buttonStyle}
              to="/track-order"
            >
              Track Order
            </Link>
          </Grid> */}
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
