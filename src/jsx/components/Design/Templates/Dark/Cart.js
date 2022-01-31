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
import ReactWhatsapp from "react-whatsapp";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "../style.css";
import QrReader from "react-qr-reader";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import CustomAlert from "../../../CustomAlert";
import * as Yup from "yup";
import "yup-phone";
import { Formik, Field, Form, ErrorMessage } from "formik";

const Cart = (props) => {
  let message = "";
  let { custom, checkBit, cart, setCart, branch, deliveryFees } = props;
  const initialValues = {
    phoneNumber: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      phoneNumber: Yup.string().phone().required("Phone Number is required"),
    });
  };
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
  const style = {
    width: "100%",
    backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
    color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    fontSize: 12,
    borderColor: custom?.menusAcriveColor ? custom.menusAcriveColor : "#ff751d",
  };
  const card = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
  };
  const buttonStyle = {
    textTransform: "capitalize",
    backgroundColor: custom?.button_background_color
      ? custom.button_background_color
      : "#ff751d",
    color: custom?.button_text_color ? custom.button_text_color : "#f1fcfe",
    fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1rem",
  };
  // for localization
  const { t } = useTranslation();

  const currency = getSymbolFromCurrency(cart[0]?.currency_code);
  const [loading, setLoading] = useState(true);
  let [sum, setSum] = useState(0);
  const [tables, setTables] = useState([]);
  const dataLoad = () => {
    let Total = 0;
    cart.map(
      (item) =>
        (Total +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(Total);
    axios.get(`/api/GetTables/${branch.id}`).then((res) => {
      if (res.data.status === 200) {
        setTables(res.data.fetchData);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, []);

  const handleDecrement = (e, qty, id, price) => {
    e.preventDefault();
    let vars = cart.map((item) =>
      id === item.id
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
        id === item.id ? { ...item, qty: qty + 1 } : item
      );
      setCart((cart) => vars);
      localStorage.setItem("cart", JSON.stringify(vars));

      setSum((sum += parseInt(price)));
    } else {
      setAlerts(
        true,
        "warning",
        "More than that isn't available because it's out of stock."
      );
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
  const [orderingWay, setOrderingWay] = useState();
  const checkOrderingMethod = (key) => {
    setOrderingWay(key);
    setShowReservation([]);
  };
  const [showReservation, setShowReservation] = useState([]);
  const checkReservation = (key) => {
    setShowReservation(key);
  };
  const [userData, setUserData] = useState({ phoneNumber: "" });
  const changeHandle = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const [table, setTable] = useState([]);
  const handleScan = (data) => {
    if (data) {
      axios.get(`/api/checkTheTbl/${data}`).then((res) => {
        if (res.data.status === 200) {
          setTable(res.data.data);
        }
      });
    }
  };
  const handleError = (err) => {
    console.error(err);
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
  const [error, setError] = useState(false);
  const saveOrder = (data) => {
    if (orderingWay !== undefined) {
      if (orderingWay === "tbl_qrcode" && showReservation.length === 0) {
        setAlerts(true, "warning", "Please Select Table Reservation.");
      } else {
        orderingWay === "tbl_qrcode"
          ? showReservation === "outside"
            ? userData.dateAndTime === undefined ||
              userData.table_id === undefined
              ? setError(true)
              : save(data)
            : table.length === 0
            ? setAlerts(true, "warning", "Please Scan The Table QR-Code.")
            : save(data)
          : orderingWay === "delivery"
          ? userData.address === undefined || userData.address === ""
            ? setError(true)
            : save(data)
          : save(data);
      }
    } else {
      setAlerts(true, "warning", "Please choose at least one way of ordering.");
    }
  };
  const save = (data) => {
    if (data !== undefined) {
      const formData = new FormData();
      formData.append("orderingItems", localStorage.getItem("cart"));
      formData.append(
        "table_id",
        table.id === undefined ? userData.table_id : table.id
      );
      formData.append("dateAndTime", userData.dateAndTime);
      formData.append("orderingMethod", orderingWay);
      formData.append("generalNote", userData.generalNote);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("buildingNo", userData.buildingNo);
      formData.append("address", userData.address);
      formData.append("floor", userData.floor);
      formData.append("flat", userData.flat);
      formData.append("directions", userData.directions);
      formData.append("deliveryFees", deliveryFees);
      formData.append("branch_id", branch.id);
      axios.post("/api/InsertOrder", formData).then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setTable([]);
          setUserData([]);
          setCart([]);
          localStorage.removeItem("cart");
        }
      });
    }
  };
  const active = {
    cursor: "pointer",
    border: "1px solid",
    textAlign: "center",
    borderRadius: "10px",
    borderColor: "black",
    backgroundColor: custom?.menusAcriveColor
      ? custom.menusAcriveColor
      : "black",
    color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
  };
  const deactive = {
    cursor: "pointer",
    border: "1px solid",
    textAlign: "center",
    borderRadius: "10px",
    borderColor: custom?.menusAcriveColor ? custom.menusAcriveColor : "#ff751d",
    backgroundColor: "#2d3134",
    color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
  };
  const outputs = [];
  for (const [key, value] of Object.entries(JSON.parse(branch?.orderMethods))) {
    if (value === 1) {
      outputs.push(
        <Grid item xs={12} lg={3} xl={3} sm={12} md={6} key={key}>
          <div
            onClick={() => checkOrderingMethod(key)}
            style={orderingWay === key ? active : deactive}
          >
            <Typography
              variant="button"
              style={{ textTransform: "capitalize" }}
              // className="font-weight-bold"
            >
              {key === "tbl_qrcode"
                ? "Table Reservation"
                : key === "delivery"
                ? "Home Delivery"
                : key === "whatsApp"
                ? "WhatsApp"
                : key}
            </Typography>
          </div>
        </Grid>
      );
    }
  }
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
        } ${
          item.SubCategoryName === undefined
            ? ""
            : ` \n*Sub Category*: ${item.SubCategoryName}`
        } \n*QTY*: ${item.qty} \n*Price*: ${item.price + " " + currency} ${
          item.itemNote === undefined ? "" : `\n*Item Note*: ${item.itemNote}`
        } ${
          item.variantSKU === undefined
            ? ""
            : `\n*Item Variant*: ${item.variantSKU}`
        } ${
          item.extras === undefined || item.extras?.length === 0
            ? ""
            : `\n*Extras*: ${item.extras.map((val) => val.value)} INCLUDED`
        } ${
          item.ingredients === undefined || item.ingredients?.length === 0
            ? ""
            : `\n*Ingredients*: ${item.ingredients} NOT INCLUDED`
        } ${
          item.recommendations === undefined ||
          item.recommendations?.length === 0
            ? ""
            : `\n*Recommendations*: ${item.recommendations.map((val) =>
                val.show
                  ? val.label +
                    " price: " +
                    val.price +
                    currency +
                    " qty: " +
                    val.qty
                  : ""
              )}`
        } ${
          item.totalPrice === undefined
            ? `\n*Item Total Price*: ${item.qty * item.price + " " + currency}`
            : `\n*Item Total Price*: ${item.totalPrice + " " + currency}`
        }\n\n`;
      return (
        <Card key={i} sx={card} className="m-1">
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
              <Grid item xs={12} lg={2} xl={3} sm={6} md={6}>
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
              <Grid item xs={12} lg={3} xl={3} sm={6} md={6}>
                <Typography
                  variant="button"
                  style={{ textTransform: "capitalize" }}
                  // className="font-weight-bold"
                >
                  {item.ProductName}
                </Typography>
                {item?.variantSKU === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Variants: </b>

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
                  variant="body1"
                  gutterBottom
                  className="font-weight-bold"
                >
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <b>Qty:</b> {item.qty + " " + item.UnitName}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <b>Discription: </b>
                  {item.Description}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={5} xl={5} sm={6} md={6}>
                {" "}
                {item?.ingredients === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Ingredients: </b>
                    {item?.ingredients?.map((val, i) => {
                      if (item?.ingredients.length === i + 1) {
                        return val + " - Not Included";
                      } else {
                        return val + ", ";
                      }
                    })}
                  </Typography>
                )}
                {item?.extras === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Extras: </b>

                    {item?.extras?.map((val, i) => {
                      if (item?.extras.length === i + 1) {
                        return val.value + " - Included";
                      } else {
                        return val.value + " , ";
                      }
                    })}
                  </Typography>
                )}
                {item?.recommendations === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Recommendations: </b>

                    {item?.recommendations?.map((val, i) => {
                      if (val.show) {
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
                      } else {
                        return "";
                      }
                    })}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={2} xl={2} sm={6} md={6}>
                <div className="row mt-2">
                  <div className={`row`}>
                    <div className="col-4 ">
                      <IconButton
                        onClick={(e) =>
                          handleDecrement(e, item.qty, item.id, item.price)
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
                            item.id,
                            item.price,
                            item.stock
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
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                {item?.itemNote === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom className="mx-1">
                    <b>Item Note: </b>
                    {item?.itemNote}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className="text-right mx-5"
                >
                  <b>Total Price: </b>
                  {item?.totalPrice !== undefined
                    ? (
                        parseInt(item.totalPrice) +
                        item.price * (item.qty - 1)
                      ).toFixed(2)
                    : (parseInt(item.price) * item.qty).toFixed(2)}
                  {" " + currency}
                </Typography>
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
        {checkBit ? "" : <Header subcategories={0} cart={cart.length} />}
        {cart.length === 0 ? (
          <Grid container spacing={2} className="text-center">
            <Grid item xs={12} lg={12} xl={12} sm={6} md={6}>
              No Item Available
            </Grid>
          </Grid>
        ) : (
          <>
            {viewImages_HTMLTABLE}
            <Card sx={card} className="m-1">
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={3} xl={3} sm={12} md={6}>
                    <Typography
                      variant="button"
                      style={{ textTransform: "capitalize" }}
                    >
                      Ordering Methods
                    </Typography>
                  </Grid>
                  {outputs}
                  {orderingWay === "tbl_qrcode" ? (
                    <>
                      <Grid item xs={12} lg={4} xl={4} sm={12} md={6}>
                        <Typography
                          variant="button"
                          style={{ textTransform: "capitalize" }}
                        >
                          Table Reservation
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={4} xl={4} sm={12} md={6}>
                        <div
                          onClick={() => checkReservation("inside")}
                          style={
                            showReservation === "inside" ? active : deactive
                          }
                        >
                          <Typography
                            variant="button"
                            style={{ textTransform: "capitalize" }}
                            // className="font-weight-bold"
                          >
                            Scan QR Code
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={4} xl={4} sm={12} md={6}>
                        <div
                          onClick={() => checkReservation("outside")}
                          style={
                            showReservation === "outside" ? active : deactive
                          }
                        >
                          <Typography
                            variant="button"
                            style={{ textTransform: "capitalize" }}
                          >
                            Reserve a table
                          </Typography>
                        </div>
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              </CardContent>
            </Card>
            <Card sx={card} className="m-1">
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    xl={6}
                    sm={12}
                    md={6}
                    className="text-center"
                  >
                    <Typography variant="body1">Delivery Fee</Typography>
                    <Typography variant="body1" className="font-weight-bold ">
                      {deliveryFees.toFixed(2) + "  " + currency}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    xl={6}
                    sm={12}
                    md={6}
                    className="text-center"
                  >
                    <Typography variant="body1">Grand Total</Typography>
                    <Typography variant="body1" className="font-weight-bold ">
                      {(sum + deliveryFees).toFixed(2) + "  " + currency}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {showReservation === "inside" ? (
              <Card sx={card} className="m-1">
                <CardContent sx={{ flexGrow: 1 }}>
                  <div>
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "100%" }}
                    />
                    {table.length !== 0 ? (
                      <Typography variant="subtitle1" gutterBottom>
                        successfully authenticated: {table.tableId}
                      </Typography>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : showReservation === "outside" ? (
              <Card sx={card} className="m-1">
                <CardContent sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                      <div className="form-group">
                        <select
                          className={`form-control ${
                            error ? "is-invalid" : ""
                          }`}
                          aria-label="Default select example"
                          onChange={changeHandle}
                          style={style}
                          name="table_id"
                        >
                          <option> Select a Table</option>
                          {tables.map((item) => {
                            return (
                              <option value={item.id} key={item.id}>
                                {item.tableId +
                                  " - " +
                                  item.numberOfSeats +
                                  " Seater"}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                      <div className="form-group">
                        <input
                          name="dateAndTime"
                          type="datetime-local"
                          className={`form-control ${
                            error ? "is-invalid" : ""
                          }`}
                          placeholder="Date and Time"
                          onChange={changeHandle}
                          style={style}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
            {orderingWay === "delivery" ? (
              <Card sx={card} className="m-1">
                <CardContent sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <TextareaAutosize
                        name="address"
                        onChange={changeHandle}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        minRows={1}
                        placeholder="Address"
                        style={style}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <div className="form-group">
                        <input
                          name="buildingNo"
                          type="text"
                          className={"form-control"}
                          placeholder="Building No"
                          onChange={changeHandle}
                          style={style}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <div className="form-group">
                        <input
                          name="floor"
                          type="text"
                          className={"form-control"}
                          placeholder="Floor"
                          onChange={changeHandle}
                          style={style}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <div className="form-group">
                        <input
                          name="flat"
                          type="text"
                          className={"form-control"}
                          placeholder="Flat"
                          onChange={changeHandle}
                          style={style}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <div className="form-group">
                        <input
                          name="directions"
                          type="text"
                          className={"form-control"}
                          placeholder="Directions"
                          onChange={changeHandle}
                          style={style}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={saveOrder}
            >
              {({ errors, status, touched, values }) => (
                <Form>
                  <Card sx={card} className="m-1">
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} lg={12} xl={6} sm={12} md={12}>
                          <div className="form-group">
                            <Field
                              name="phoneNumber"
                              type="text"
                              className={
                                "form-control" +
                                (errors.phoneNumber && touched.phoneNumber
                                  ? " is-invalid"
                                  : "")
                              }
                              placeholder="+93--- ---- ---"
                              style={style}
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component="div"
                              style={{ fontSize: "0.7em" }}
                              className="invalid-feedback"
                            />
                            {/* <input
                              name="phoneNumber"
                              type="text"
                              className={`form-control`}
                              placeholder="Phone"
                              onChange={changeHandle}
                              style={style}
                            /> */}
                          </div>
                        </Grid>
                        <Grid item xs={12} lg={12} xl={6} sm={12} md={12}>
                          <TextareaAutosize
                            name="generalNote"
                            onChange={changeHandle}
                            className={"form-control"}
                            minRows={3}
                            placeholder="General Note"
                            style={style}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card sx={card} className="m-1">
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                          {orderingWay !== "tbl_qrcode" ? (
                            <>
                              <p className="d-none">
                                {
                                  (message = `\n\n${message} ------------------------- \n *Sub Total*: ${
                                    sum.toFixed(2) + "  " + currency
                                  }\n *Delivery Fee*: ${
                                    deliveryFees.toFixed(2) + "  " + currency
                                  }\n *Grand Total*: ${
                                    (sum + deliveryFees).toFixed(2) +
                                    "  " +
                                    currency
                                  }\n *Phone Number*: ${values?.phoneNumber}${
                                    userData?.generalNote === undefined
                                      ? ""
                                      : `\n *General Note*: ${userData?.generalNote}`
                                  }
                           `)
                                }
                                {orderingWay === "delivery"
                                  ? (message = `${message} \n---------------- \n *Ordering Method*: Home Delivery\n *Address*: ${userData?.address}\n *Building No*: ${userData?.buildingNo}\n *Floor*: ${userData?.floor}\n *Flat*: ${userData?.flat}\n *Directions*: ${userData?.directions}`)
                                  : null}
                              </p>
                              {orderingWay === undefined ? (
                                <button
                                  className="col-12 btn"
                                  style={buttonStyle}
                                  type="submit"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </button>
                              ) : orderingWay === "delivery" ? (
                                userData.address === undefined ||
                                userData.address === "" ? (
                                  <button
                                    className="col-12 btn"
                                    style={buttonStyle}
                                    type="submit"
                                    // onClick={() => saveOrder()}
                                  >
                                    <WhatsAppIcon /> {t("send_order")}
                                  </button>
                                ) : (
                                  <ReactWhatsapp
                                    className="col-12 btn"
                                    type="submit"
                                    style={buttonStyle}
                                    number={branch?.phoneNumber}
                                    message={message}
                                    max="4096"
                                    // onClick={() => saveOrder()}
                                  >
                                    <WhatsAppIcon /> {t("send_order")}
                                  </ReactWhatsapp>
                                )
                              ) : orderingWay === "whatsApp" &&
                                values.phoneNumber === "" ? (
                                <button
                                  className="col-12 btn"
                                  style={buttonStyle}
                                  type="submit"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </button>
                              ) : errors.phoneNumber && touched.phoneNumber ? (
                                <button
                                  className="col-12 btn"
                                  style={buttonStyle}
                                  type="submit"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </button>
                              ) : (
                                <ReactWhatsapp
                                  className="col-12 btn"
                                  type="submit"
                                  style={buttonStyle}
                                  number={branch?.phoneNumber}
                                  message={message}
                                  max="4096"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </ReactWhatsapp>
                              )}
                            </>
                          ) : (
                            <button
                              className="col-12 btn"
                              style={buttonStyle}
                              onClick={() => saveOrder()}
                            >
                              <SendIcon /> {t("send_order")}
                            </button>
                          )}
                        </Grid>
                        <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                          <button
                            className="col-12 btn"
                            style={buttonStyle}
                            onClick={() => [
                              localStorage.removeItem("cart"),
                              setCart([]),
                              setUserData([]),
                            ]}
                          >
                            <ClearIcon /> {t("empty_cart")}
                          </button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Form>
              )}
            </Formik>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Cart;
