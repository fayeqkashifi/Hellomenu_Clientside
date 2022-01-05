import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
// import Slider from "react-slick";
import Header from "./Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import "react-slideshow-image/dist/styles.css";
import getSymbolFromCurrency from "currency-symbol-map";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
import CardContent from "@mui/material/CardContent";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import ReactWhatsapp from "react-whatsapp";

import "../style.css";
var message = "";

const Cart = (props) => {
  // for localization
  const { t } = useTranslation();
  const custom = props.history.location.state.custom;
  // design start
  const theme = createTheme({
    palette: {
      background: {
        default: custom?.bgColor ? custom.bgColor : "#22252a",
      },
    },
    typography: {
      fontFamily: custom?.font ? custom.font : "sans-serif",
      // discription
      subtitle1: {
        fontSize: custom?.pDiscriptionSize
          ? custom.pDiscriptionSize + "rem"
          : "0.75rem",

        color: custom?.product_discription_color
          ? custom.product_discription_color
          : "#fff",
      },
      // price
      body1: {
        fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
        color: custom?.price_color ? custom.price_color : "#fff",
      },
      // product Names
      button: {
        fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
        color: custom?.product_name_color ? custom.product_name_color : "#fff",
      },
      // Menus
      h6: {
        fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
        color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
      },
    },
  });
  // design end
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [loading, setLoading] = useState(true);
  let [sum, setSum] = useState(0);

  useEffect(() => {
    setLoading(false);
    cart.map((item) => {
      sum += item.price * item.qty;
    });
    setSum(sum);
  }, []);

  const handleDecrement = (e, qty, id, price) => {
    e.preventDefault();
    let vars = cart.map((item) =>
      id == item.id
        ? {
            ...item,
            qty: item.qty - (item.qty > 0 ? 1 : 0),
          }
        : item
    );
    if (qty > 1) {
      setCart((cart) => vars);
      setSum((sum -= parseInt(price)));
      localStorage.setItem("cart", JSON.stringify(vars));
    }
  };
  const handelIncrement = (e, qty, id, price, stock) => {
    e.preventDefault();
    if (stock > qty) {
      let vars = cart.map((item) =>
        id == item.id ? { ...item, qty: qty + 1 } : item
      );
      setCart((cart) => vars);
      localStorage.setItem("cart", JSON.stringify(vars));

      setSum((sum += parseInt(price)));
    } else {
      alert("More than that isn't available because it's out of stock.");
    }
  };
  const remItem = (id, qty, price) => {
    setSum((sum -= price * qty));

    const data = cart.filter((cart) => {
      return cart.id !== id;
    });
    localStorage.setItem("cart", JSON.stringify(data));
    setCart(data);
  };

  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="container ">
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
    viewImages_HTMLTABLE = cart?.map((item, i) => {
      message =
        message +
        `*Product Name*: ${item.ProductName} \n*Category*: ${
          item.CategoryName
        } \n*Sub Category*: ${item.SubCategoryName} \n*QTY*: ${
          item.qty
        } \n*Price*: ${item.price} \n*Total Price*: ${
          item.qty * item.price
        } *${getSymbolFromCurrency(item.currency_code)}* \n\n`;
      return (
        <Card
          key={i}
          sx={{
            // height: "100%",
            display: "flex",
            flexDirection: "column",
            // borderRadius: "%",
            backgroundColor: custom?.cardBgColor
              ? custom.cardBgColor
              : "#2d3134",
          }}
          className="m-1"
        >
          <div className="text-right">
            <IconButton onClick={() => remItem(item.id, item.qty, item.price)}>
              <ClearIcon
                sx={{
                  color: custom?.menusAcriveColor
                    ? custom.menusAcriveColor
                    : "#f27d1e",
                }}
              />
            </IconButton>
          </div>

          <CardContent sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={3} sm={3} md={3}>
                <img
                  style={{
                    height: "100px",
                    width: "100%",
                    borderRadius: "15%",
                    objectFit: "contain",
                  }}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                  // className="h-100"
                />
              </Grid>
              <Grid item xs={5} sm={5} md={5}>
                <Typography
                  variant="button"
                  style={{ textTransform: "capitalize" }}
                  // className="font-weight-bold"
                >
                  {item.ProductName}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  className="font-weight-bold"
                >
                  {getSymbolFromCurrency(item.currency_code) +
                    "  " +
                    (item.price * item.qty).toFixed(2)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {item.UnitName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {item.Description}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <div className="row mt-2">
                  <div className={`row`}>
                    <div className="col-4 ">
                      <Typography
                        onClick={(e) =>
                          handleDecrement(e, item.qty, item.id, item.price)
                        }
                        style={{ cursor: "pointer" }}
                        variant="h6"
                        gutterBottom
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-dash-square-dotted  "
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834 0h.916v-1h-.916v1zm1.833 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                        </svg>
                      </Typography>
                    </div>
                    <div className="col-4">
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        className="mt-1"
                      >
                        {item.qty}
                      </Typography>
                    </div>
                    <div className="col-4">
                      <Typography
                        onClick={(e) =>
                          handelIncrement(
                            e,
                            item.qty,
                            item.id,
                            item.price,
                            item.stock
                          )
                        }
                        style={{ cursor: "pointer" }}
                        variant="h6"
                        gutterBottom
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-square-dotted"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                      </Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className="mb-2">
        <Header subcategories={0} cart={cart.length} />
        {cart.length === 0 ? (
          <Grid container spacing={2} className="text-center">
            <Grid item xs={12} sm={12} md={12}>
              No Item Available
            </Grid>
          </Grid>
        ) : (
          <>
            {viewImages_HTMLTABLE}
            <Card
              sx={{
                // height: "100%",
                display: "flex",
                flexDirection: "column",
                // borderRadius: "%",
                backgroundColor: custom?.cardBgColor
                  ? custom.cardBgColor
                  : "#2d3134",
              }}
              className="m-1"
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4} md={4}>
                    <Typography
                      variant="body1"
                      className="font-weight-bold col-12 btn"
                    >
                      {sum.toFixed(2) +
                        "  " +
                        getSymbolFromCurrency(cart[0]?.currency_code)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <p className="d-none">
                      {console.log(message)}
                      {(message = `\n\n\n${message} *Grand Total*: ${sum}`)}
                    </p>
                    {console.log(message)}

                    <ReactWhatsapp
                      className="col-12 btn"
                      style={{
                        textTransform: "capitalize",
                        backgroundColor: theme?.button_background_color
                          ? theme.button_background_color
                          : "#ff751d",
                        color: theme?.button_text_color
                          ? theme.button_text_color
                          : "#f1fcfe",
                        fontSize: theme?.bTextSize
                          ? theme.bTextSize + "rem"
                          : "1rem",
                      }}
                      number="+93744647067"
                      message={message}
                      max="4096"
                      type="submit"
                    >
                      {t("send_order")}{" "}
                    </ReactWhatsapp>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <button
                      className="col-12 btn"
                      style={{
                        textTransform: "capitalize",
                        backgroundColor: theme?.button_background_color
                          ? theme.button_background_color
                          : "#ff751d",
                        color: theme?.button_text_color
                          ? theme.button_text_color
                          : "#f1fcfe",
                        fontSize: theme?.bTextSize
                          ? theme.bTextSize + "rem"
                          : "1rem",
                      }}
                      onClick={() => [
                        localStorage.removeItem("cart"),
                        setCart([]),
                      ]}
                    >
                      {t("empty_cart")}{" "}
                    </button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Cart;
