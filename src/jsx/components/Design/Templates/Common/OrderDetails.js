import React, { useState, useContext } from "react";
import Container from "@mui/material/Container";
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
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import RecCounter from "./RecCounter";
import { TemplateContext } from "../TemplateContext";
const OrderDetails = () => {
  const {
    fetchData,
    setFetchData,
    locale,
    cart,
    setCart,
    item,
    // setItem,
    style,
    orignalPrice,
    orignalStock,
    extraValue,
    ingredients,
    price,
    stock,
    productName,
    countryCode,
    picture,
    skuarray,
    activeSKU,
    loading,
  } = useContext(TemplateContext);

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
    const recom = fetchData.map((item) => {
      if (item.show) {
        const array = {
          value: item.value,
          qty: item.qty,
        };
        return array;
      }
    });
    const check = cart.every((val) => {
      return val.id !== item[0].id;
    });
    let array = [];
    if (check) {
      array.push({
        id: item[0].id,
        qty: item[0].qty,
        currency_code: item[0].currency_code,
        price: orignalPrice,
        stock: orignalStock,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      localStorage.setItem("cart", JSON.stringify(cart.concat(array)));
      setCart(cart.concat(array));
      setAlerts(true, "success", "Successfully added to cart");
    } else {
      let data = cart.filter((val) => {
        return val.id === item[0].id;
      });
      array.push({
        id: data[0].id,
        qty: data[0].qty,
        currency_code: data[0].currency_code,
        price: orignalPrice,
        stock: orignalStock,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      const otherData = cart.filter((val) => {
        return val.id !== item[0].id;
      });
      localStorage.setItem("cart", JSON.stringify(otherData.concat(array)));
      setCart(otherData.concat(array));
      setAlerts(true, "success", "Cart Updated");
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
        ></div>
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
                  checked={
                    item.show == undefined ? false : item.show ? true : false
                  }
                  color="default"
                  onChange={(e) => {
                    extraHandlers(e, item.price, item.value, item.qty);
                  }}
                  sx={style?.checkbox}
                />
              }
              label={
                <Typography style={style?.cartDescription}>
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
              <RecCounter item={item} sum={sum} setSum={setSum} />
            </Grid>
          ) : (
            " "
          )}
        </Grid>
      );
    });
  }
  return (
    <div style={style?.background}>
      {alert.open && (
        <CustomAlert
          vertical="top"
          horizontal="right"
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      )}
      <Container maxWidth="lg">
        <Header details={true} search={false} />
        <Container
          className="d-flex justify-content-center "
          style={style?.varaintContainer}
        >
          <Grid container spacing={2} className="d-flex justify-content-center">
            <Grid item xs={12} sm={8} md={8}>
              <Card sx={style?.card}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Swiper
                    speed={2500}
                    className="mySwiper2 m-2"
                    spaceBetween={1}
                  >
                    {JSON.parse(picture)?.map((image, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <img
                            src={
                              stock === "No Stock" || stock === 0
                                ? `http://${base_url}:${port}/images/products/${image}`
                                : `http://${base_url}:${port}/images/products/${image}`
                            }
                            alt=""
                            style={{
                              height: "300px",
                              width: "100%",
                              borderRadius: "10px",
                              objectFit: "contain",
                            }}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </Grid>
                <FavoriteIcon
                  className="my-4 mx-3"
                  style={style?.favIconActive}
                />

                <div className="row mx-3">
                  <Typography style={style?.cartPrice}>
                    {productName}{" "}
                    {orignalPrice +
                      ".00" +
                      " " +
                      getSymbolFromCurrency(countryCode)}
                  </Typography>
                  {style?.show_recommendation == 0 || fetchData.length === 0 ? (
                    ""
                  ) : (
                    <>
                      <Typography style={style?.productName}>
                        {locale?.recommendation}
                      </Typography>
                      <FormGroup>{viewImages_HTMLTABLE}</FormGroup>
                    </>
                  )}
                </div>
                <div className="row mx-3">
                  <TextareaAutosize
                    // aria-label="empty textarea"
                    onChange={(e) => changeHandle(e)}
                    name="itemNote"
                    className="my-3"
                    minRows={3}
                    placeholder="Note"
                    style={style?.inputfieldDetails}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Box style={style?.footerStyle} className="bottom-0 text-center p-1">
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Typography
              style={style?.cartDescription}
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
              style={style?.buttonStyle}
              onClick={(e) => addItem(e)}
            >
              {locale?.add_to_cart}
            </button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default OrderDetails;
