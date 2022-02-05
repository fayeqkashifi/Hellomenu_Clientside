import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Cart from "../Common/Cart";
import Drawer from "./Drawer";

function Footer(props) {
  const {
    title,
    url,
    style,
    stock,
    cart,
    setCart,
    deliveryFees,
    branch,
    template,
  } = props;
  const { t } = useTranslation();

  let [sum, setSum] = useState(0);
  const dataLoad = () => {
    let count = 0;
    cart.map(
      (item) =>
        (count +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(count);
  };
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, [cart]);
  const [modalCentered, setModalCentered] = useState(false);
  // dark template Style
  return (
    <>
      <Box component="footer" sx={style?.footerStyle} className="bottom-0 mt-5">
        <Grid container spacing={2}>
          <Grid item xs={6} lg={4} xl={4} sm={4} md={4}>
            <Typography style={style?.description}>
              Sub Total
              <p>
                {sum.toFixed(2) +
                  "  " +
                  (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
                    ? " "
                    : getSymbolFromCurrency(cart[0]?.currency_code))}
              </p>
            </Typography>
          </Grid>
          <Grid item xs={6} lg={4} xl={4} sm={4} md={4}>
            <Typography style={style?.description}>
              Delivery Fee
              <p>
                {deliveryFees.toFixed(2) +
                  "  " +
                  (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
                    ? " "
                    : getSymbolFromCurrency(cart[0]?.currency_code))}
              </p>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4} xl={4} sm={4} md={4}>
            {url !== undefined ? (
              <Link
                className={`col-12 btn ${
                  stock === "No Stock" || stock === 0 ? "disabled" : ""
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
        style={style}
        checkBit={true}
        branch={branch}
        cart={cart}
        setCart={setCart}
        deliveryFees={deliveryFees}
      />
    </>
  );
}

export default Footer;
