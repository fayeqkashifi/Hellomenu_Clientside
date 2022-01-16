import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";

function Footer(props) {
  const { title, url, theme, stock, cart, deliveryFees } = props;
  let [sum, setSum] = useState(0);

  useEffect(() => {
    // setSum(0)
    let count = 0;
    cart.map((item) => {
      count += item.price * item.qty;
    });
    setSum(count);
  }, [cart]);
  return (
    <Box
      component="footer"
      style={{ position: "fixed", width: "100%" }}
      sx={{
        bgcolor: theme?.cardBgColor ? theme.cardBgColor : "#2d3134",
        position: "sticky",
        bottom: "0px",
      }}
      className="bottom-0 py-1"
    >
      <Grid container spacing={2} className="text-center">
        <Grid item xs={4}>
          <Typography variant="subtitle1">
            Grand Total
            <p>
              {sum == 0
                ? ""
                : sum.toFixed(2) +
                  "  " +
                  getSymbolFromCurrency(cart[0]?.currency_code)}
            </p>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1">
            Delivery Fee
            <p>
              {parseInt(deliveryFees).toFixed(2) +
                "  " +
                getSymbolFromCurrency(cart[0]?.currency_code)}
            </p>
          </Typography>
        </Grid>
        <Grid item xs={5}>
          {stock == "No Stock" || stock == 0 ? (
            <Link
              className="col-12 btn disabled "
              style={{
                textTransform: "capitalize",
                backgroundColor: theme?.button_background_color
                  ? theme.button_background_color
                  : "#ff751d",
                color: theme?.button_text_color
                  ? theme.button_text_color
                  : "#f1fcfe",
                fontSize: theme?.bTextSize ? theme.bTextSize + "rem" : "1rem",
              }}
              to={url}
            >
              {title}
            </Link>
          ) : (
            <Link
              className="col-12 btn "
              style={{
                textTransform: "capitalize",
                backgroundColor: theme?.button_background_color
                  ? theme.button_background_color
                  : "#ff751d",
                color: theme?.button_text_color
                  ? theme.button_text_color
                  : "#f1fcfe",
                fontSize: theme?.bTextSize ? theme.bTextSize + "rem" : "1rem",
              }}
              to={url}
            >
              {title}
            </Link>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

Footer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Footer;
