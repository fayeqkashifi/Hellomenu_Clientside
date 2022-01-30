import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Import css files
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
// import Slider from "react-slick";
import Header from "./Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Box from "@mui/material/Box";
import getSymbolFromCurrency from "currency-symbol-map";
import FormGroup from "@mui/material/FormGroup";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomAlert from "../../../CustomAlert";
import IconButton from "@mui/material/IconButton";
// import { useHistory } from "react-router-dom";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
const OrderDetails = (props) => {
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
  const { t } = useTranslation();

  const deliveryFees = props.history.location.state.deliveryFees;
  const branch = props.history.location.state.branch;
  const branchId = props.history.location.state.branchId;
  const productName = props.history.location.state.productName;
  const picture = props.history.location.state.picture;
  const stock = props.history.location.state.stock;
  const price = props.history.location.state.price;
  const orignalPrice = props.history.location.state.orignalPrice;
  const orignalStock = props.history.location.state.orignalStock;
  const countryCode = props.history.location.state.countryCode;
  const extraValue = props.history.location.state.extraValue;
  const ingredients = props.history.location.state.ingredients;
  const skuarray = props.history.location.state.skuarray;
  const activeSKU = props.history.location.state.activeSKU;

  const id = atob(props.match.params.id);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState([]);
  useEffect(() => {
    const getdata = async () => {
      const product = await axios({
        method: "GET",
        url: `/api/GetProduct/${id}`,
      });
      const data = product.data.fetchData;
      setItem(data);
      const recData = [];
      JSON.parse(data[0].recommendations).map((item) => {
        axios.get(`/api/GetProduct/${item.value}`).then((res) => {
          if (res.data.status === 200 && res.data.fetchData[0].stock > 0) {
            setFetchData(
              recData.concat({
                stock: res.data.fetchData[0].stock,
                ...item,
              })
            );
          }
        });
      });
      setLoading(false);
    };
    getdata(); // axios
  }, [id]);
  let [sum, setSum] = useState(0);

  const extraHandlers = (e, price, id, qty) => {
    if (e.target.checked) {
      setSum((sum += parseInt(price)));
      setFetchData((fetchData) =>
        fetchData.map((item) =>
          id == item.value ? { ...item, show: true } : item
        )
      );
    } else {
      setSum((sum -= parseInt(price) * qty));
      setFetchData((fetchData) =>
        fetchData.map((item) =>
          id == item.value ? { ...item, qty: 1, show: false } : item
        )
      );
    }
  };

  const handleDecrement = (e, qty, id, price) => {
    e.preventDefault();
    if (qty > 1) {
      setFetchData((fetchData) =>
        fetchData.map((item) =>
          id == item.value
            ? { ...item, qty: item.qty - (item.qty > 0 ? 1 : 0) }
            : item
        )
      );
      setSum((sum -= parseInt(price)));
    }
  };
  const handelIncrement = (e, qty, id, stock, price) => {
    e.preventDefault();
    if (stock > qty) {
      setFetchData((fetchData) =>
        fetchData.map((item) =>
          id == item.value ? { ...item, qty: item.qty + 1 } : item
        )
      );
      setSum((sum += parseInt(price)));
    } else {
      setAlerts(
        true,
        "warning",
        "More than that isn't available because it's out of stock."
      );
    }
  };
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [note, setNote] = useState([]);
  const changeHandle = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
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
  // const history = useHistory();

  const addItem = (e) => {
    e.preventDefault();
    const check = cart.every((val) => {
      return val.id !== item[0].id;
    });
    if (check) {
      item[0].price = orignalPrice;
      item[0].stock = orignalStock;
      item[0].itemNote = note.itemNote;
      item[0].recommendations = fetchData;
      item[0].extras = extraValue;
      item[0].ingredients = ingredients;
      item[0].totalPrice = (parseInt(price) + sum).toFixed(2);
      item[0].variantSKU = skuarray;
      item[0].checkSKU = activeSKU;

      setItem(item);
      localStorage.setItem("cart", JSON.stringify(cart.concat(item)));
      setCart(cart.concat(item));
      setAlerts(true, "success", "Successfully added to cart");
    } else {
      let data = cart.filter((val) => {
        return val.id === item[0].id;
      });
      data[0].price = orignalPrice;
      data[0].stock = orignalStock;
      data[0].itemNote = note.itemNote;
      data[0].recommendations = fetchData;
      data[0].extras = extraValue;
      data[0].ingredients = ingredients;
      data[0].totalPrice = (parseInt(price) + sum).toFixed(2);
      data[0].variantSKU = skuarray;
      data[0].checkSKU = activeSKU;

      const otherData = cart.filter((val) => {
        return val.id !== item[0].id;
      });
      localStorage.setItem("cart", JSON.stringify(otherData.concat(data)));
      setCart(otherData.concat(data));
      setAlerts(true, "success", "Cart Updated");
      // uhistory.push(`/dark-template/${btoa(branchId)}`);
    }
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
          {/* <span className="sr-only">{t("loading")}</span> */}
        </div>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = fetchData?.map((item, i) => {
      return (
        <Grid container spacing={2} key={i}>
          <Grid item xs={8} sm={8} md={8}>
            <FormControlLabel
              control={
                <Checkbox
                  color="default"
                  onChange={(e) => {
                    extraHandlers(e, item.price, item.value, item.qty);
                  }}
                  sx={{
                    color: custom?.menusAcriveColor
                      ? custom.menusAcriveColor
                      : "#ff751d",
                  }}
                />
              }
              label={
                <Typography variant="subtitle1" gutterBottom>
                  {item.label +
                    " ( +" +
                    (item.price * item.qty).toFixed(2) +
                    " " +
                    getSymbolFromCurrency(countryCode) +
                    " )"}
                </Typography>
              }
            />
          </Grid>
          {item?.show ? (
            <Grid item xs={4} sm={4} md={4}>
              <div className="row mt-2">
                <div className={`row`}>
                  <div className="col-4 ">
                    <IconButton
                      onClick={(e) =>
                        handleDecrement(e, item.qty, item.value, item.price)
                      }
                    >
                      <Typography
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
                    </IconButton>
                  </div>
                  <div className="col-4">
                    <IconButton>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        className="mt-1"
                      >
                        {item.qty}
                      </Typography>
                    </IconButton>
                  </div>
                  <div className="col-4">
                    <IconButton
                      onClick={(e) =>
                        handelIncrement(
                          e,
                          item.qty,
                          item.value,
                          item.stock,
                          item.price
                        )
                      }
                    >
                      <Typography
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
                    </IconButton>
                  </div>
                </div>
              </div>
            </Grid>
          ) : (
            " "
          )}
        </Grid>
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {alert.open ? (
        <CustomAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}
      <Container maxWidth="lg">
        <Header
          subcategories={0}
          cart={cart}
          theme={custom}
          branch={branch}
          setCart={setCart}
          deliveryFees={deliveryFees}
          branchId={branchId}
        />
        <Container className="d-flex justify-content-center">
          <Grid container spacing={2} className="d-flex justify-content-center">
            <Grid item xs={12} sm={8} md={8}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "5%",
                  backgroundColor: custom?.cardBgColor
                    ? custom.cardBgColor
                    : "#2d3134",
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Swiper
                    speed={2500}
                    className="mySwiper2"
                    spaceBetween={1}
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    // navigation={true}
                  >
                    {JSON.parse(picture)?.map((image, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <img
                            src={
                              stock === "No Stock" || stock === 0
                                ? `http://${base_url}:${port}/images/products/${image}`
                                : `http://${base_url}:${port}/images/variants_pics/${image}`
                            }
                            alt=""
                            style={{
                              height: "200px",
                              width: "100%",
                              borderRadius: "5%",

                              objectFit: "contain",
                            }}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </Grid>
                <FavoriteIcon sx={{ color: "#ff751d" }} className="mx-4 my-2" />

                <div className="row mx-3">
                  <Typography
                    variant="button"
                    style={{ textTransform: "capitalize" }}
                  >
                    {productName}{" "}
                    {orignalPrice +
                      ".00" +
                      " " +
                      getSymbolFromCurrency(countryCode)}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {ingredients?.map((item, i) => {
                      if (ingredients.length == i + 1) {
                        return item + " - Not Included";
                      } else {
                        return item + " , ";
                      }
                    })}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {extraValue?.map((item, i) => {
                      if (extraValue.length == i + 1) {
                        return item.value + " - Included";
                      } else {
                        return item.value + " , ";
                      }
                    })}
                  </Typography>
                  {custom?.show_recommendation == 0 ||
                  fetchData.length === 0 ? (
                    ""
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {t("recommendation")}
                      </Typography>
                      <FormGroup>{viewImages_HTMLTABLE}</FormGroup>
                    </>
                  )}
                  <TextareaAutosize
                    // aria-label="empty textarea"
                    onChange={(e) => changeHandle(e)}
                    name="itemNote"
                    className="my-3"
                    minRows={3}
                    placeholder="Note"
                    style={{
                      backgroundColor: custom?.cardBgColor
                        ? custom.cardBgColor
                        : "#2d3134",
                      color: custom?.menusDeactiveColor
                        ? custom.menusDeactiveColor
                        : "#fff",
                      fontSize: 12,
                      borderColor: custom?.menusAcriveColor
                        ? custom.menusAcriveColor
                        : "#ff751d",
                    }}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Box
        // style={{ position: "fixed", width: "100%" }}
        sx={{
          bgcolor: theme?.cardBgColor ? theme.cardBgColor : "#2d3134",
          position: "sticky",
          bottom: "0px",
        }}
        // sx={{
        //   borderRadius: "5%",
        //   backgroundColor: "light",
        //   position: "sticky",
        //   bottom: "0px",
        // }}
        className="bottom-0 text-center p-1 mt-5"
      >
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Typography
              variant="body1"
              gutterBottom
              className="font-weight-bold text-center col-12 btn"
            >
              {(parseInt(price) + sum).toFixed(2) +
                " " +
                getSymbolFromCurrency(countryCode)}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <button
              className="col-12 btn"
              style={{
                textTransform: "capitalize",
                backgroundColor: custom?.button_background_color
                  ? custom.button_background_color
                  : "#ff751d",
                color: custom?.button_text_color
                  ? custom.button_text_color
                  : "#f1fcfe",
                fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1rem",
              }}
              onClick={(e) => addItem(e)}
            >
              Add to Cart
            </button>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default OrderDetails;
