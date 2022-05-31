import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import Drawer from "./Drawer";
import { TemplateContext } from "../TemplateContext";

function Footer(props) {
  const { style, cart, deliveryFees, locale } = useContext(TemplateContext);
  const { title, url, stock } = props;
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
    dataLoad();
    return () => {
      setSum(0);
    };
  }, [cart]);
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
