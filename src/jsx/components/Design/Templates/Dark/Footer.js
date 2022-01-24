import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Cart from "./Cart";
function Footer(props) {
  const {
    title,
    url,
    theme,
    stock,
    cart,
    branchId,
    setCart,
    deliveryFees,
    branch,
  } = props;
  const { t } = useTranslation();

  let [sum, setSum] = useState(0);
  useEffect(() => {
    let count = 0;
    cart.map(
      (item) =>
        (count +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(count);
  }, [cart]);
  const [modalCentered, setModalCentered] = useState(false);

  const buttonStyle = {
    textTransform: "capitalize",
    backgroundColor: theme?.button_background_color
      ? theme.button_background_color
      : "#ff751d",
    color: theme?.button_text_color ? theme.button_text_color : "#f1fcfe",
    fontSize: theme?.bTextSize ? theme.bTextSize + "rem" : "1rem",
  };
  return (
    <>
      <Box
        component="footer"
        // style={{ position: "fixed", }}
        sx={{
          bgcolor: theme?.cardBgColor ? theme.cardBgColor : "#2d3134",
          position: "sticky",
          bottom: 0,
          width: "100%",
        }}
        className="bottom-0 mt-5"
      >
        <Grid container spacing={2} className="text-center">
          <Grid item xs={6} lg={4} xl={4} sm={4} md={4}>
            <Typography variant="subtitle1">
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
            <Typography variant="subtitle1">
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
                style={buttonStyle}
                to={url}
              >
                {title}
              </Link>
            ) : (
              <button
                className="col-12 btn"
                onClick={() => setModalCentered(true)}
                style={buttonStyle}
              >
                {title}
              </button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Modal
        className="fade bd-example-modal-lg"
        size="lg"
        show={modalCentered}
        onHide={() => setModalCentered(false)}
      >
        <Modal.Header
          style={{
            backgroundColor: theme?.bgColor ? theme.bgColor : "#22252a",
            borderColor: theme?.cardBgColor ? theme.cardBgColor : "#2d3134",
          }}
        >
          <Modal.Title>
            <Typography variant="h6">{t("order_details")}</Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: theme?.bgColor ? theme.bgColor : "#22252a",
          }}
        >
          <Cart
            custom={theme}
            checkBit={true}
            branch={branch}
            cart={cart}
            setCart={setCart}
            deliveryFees={deliveryFees}
            branchId={branchId}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

Footer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Footer;
