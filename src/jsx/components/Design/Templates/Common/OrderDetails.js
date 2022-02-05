import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Import css files
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
import { getProduct } from "../Functionality";
import RecCounter from "./RecCounter";
// import { addExistingItem } from "../Functionality";
const OrderDetails = (props) => {
  const { t } = useTranslation();

  const {
    id,
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
    deliveryFees,
    skuarray,
    activeSKU,
    branch,
  } = props;
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState([]);
  useEffect(() => {
    let unmounted = false;
    const getdata = async () => {
      var data = [];
      await getProduct(id).then((result) => {
        data = result.data.fetchData;
        setItem(data);
      });
      var recData = [];
      JSON.parse(data[0].recommendations).map(async (item) => {
        await getProduct(item.value).then((res) => {
          if (res.data.status === 200 && res.data.fetchData[0].stock > 0) {
            recData = recData.concat({
              stock: res.data.fetchData[0].stock,
              ...item,
            });
          }
        });
        setFetchData(recData);
        setLoading(false);
      });
    };
    // dataLoad();
    getdata(); // axios
    return () => {
      unmounted = true;
    };
  }, [id]);
  let [sum, setSum] = useState(0);
  // const dataLoad = () => {
  //   let Total = 0;
  //   fetchData.map((item) => (Total += item.price * item.qty));
  //   setSum(Total)
  // };
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
              <RecCounter
                style={style}
                item={item}
                setFetchData={setFetchData}
                fetchData={fetchData}
                sum={sum}
                setSum={setSum}
              />
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
          style={style}
          branch={branch}
          setCart={setCart}
          deliveryFees={deliveryFees}
        />
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
                <FavoriteIcon
                  className="my-4 mx-3"
                  style={style?.favIconActive}
                />

                <div className="row mx-3">
                  <Typography style={style?.productName}>
                    {productName}{" "}
                    {orignalPrice +
                      ".00" +
                      " " +
                      getSymbolFromCurrency(countryCode)}
                  </Typography>
                  <Typography style={style?.cartDescription}>
                    {ingredients?.map((item, i) => {
                      if (ingredients.length == i + 1) {
                        return item + " - Not Included";
                      } else {
                        return item + " , ";
                      }
                    })}
                  </Typography>
                  <Typography style={style?.cartDescription}>
                    {extraValue?.map((item, i) => {
                      if (extraValue.length == i + 1) {
                        return item.value + " - Included";
                      } else {
                        return item.value + " , ";
                      }
                    })}
                  </Typography>
                  {style?.show_recommendation == 0 || fetchData.length === 0 ? (
                    ""
                  ) : (
                    <>
                      <Typography style={style?.cartPrice}>
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
                    style={style?.inputfield}
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
              style={style?.price}
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
              Add to Cart
            </button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default OrderDetails;
