import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "./Header";
import { base_url, port } from "../../../../../Consts";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import CardContent from "@mui/material/CardContent";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import ReactWhatsapp from "react-whatsapp";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import QrReader from "react-qr-reader";
import SendIcon from "@mui/icons-material/Send";
import CustomAlert from "../../../CustomAlert";
import * as Yup from "yup";
import "yup-phone";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  getTables,
  checkTheTbl,
  insertOrder,
  remCartItem,
  emptyCart,
} from "../Functionality";
import Counter from "../Common/Counter";
const Cart = (props) => {
  let message = "";
  let { style, checkBit, cart, setCart, branch, deliveryFees, template } =
    props;
  const initialValues = {
    phoneNumber: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      phoneNumber: Yup.string().phone().required("Phone Number is required"),
    });
  };

  // for localization
  const { t } = useTranslation();

  const currency = getSymbolFromCurrency(cart[0]?.currency_code);
  const [loading, setLoading] = useState(true);
  let [sum, setSum] = useState(0);
  const [tables, setTables] = useState([]);
  const dataLoad = async () => {
    let Total = 0;
    cart.map(
      (item) =>
        (Total +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(Total);
    await getTables(branch.id).then((res) => {
      setTables(res);
    });
    setLoading(false);
  };
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, [cart]);

  const remItem = (id, qty, price) => {
    setSum((sum -= price * qty));
    remCartItem(id, cart).then((data) => {
      setCart(data);
    });
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
      checkTheTbl(data).then((res) => {
        setTable(res);
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
      insertOrder(formData).then((msg) => {
        setAlerts(true, "success", msg);
        setTable([]);
        setUserData([]);
        setCart([]);
        localStorage.removeItem("cart");
      });
    }
  };

  const outputs = [];
  console.log(branch?.orderMethods);
  for (const [key, value] of Object.entries(JSON.parse(branch?.orderMethods))) {
    if (value === 1) {
      outputs.push(
        <Grid
          item
          xs={12}
          lg={style?.orderingOptions ? style?.orderingOptions : 3}
          xl={3}
          sm={12}
          md={6}
          key={key}
          // style={}
        >
          <div
            onClick={() => checkOrderingMethod(key)}
            style={orderingWay === key ? style.active : style.deactive}
          >
            <Typography style={style?.cartDescription}>
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
        <Card key={i} sx={style?.card} className="m-1">
          <div className="text-right">
            <IconButton onClick={() => remItem(item.id, item.qty, item.price)}>
              <ClearIcon sx={style.clearIcon} />
            </IconButton>
          </div>

          <CardContent sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={2}
              // style={style?.cartMainDiv}
            >
              <Grid
                item
                // xs={12}
                // lg={2}
                // xl={3}
                // sm={6}
                // md={6}
                style={style?.cartImageDiv}
              >
                <img
                  style={style?.cartImage}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                  // className="h-100"
                />
              </Grid>
              <Grid
                item
                sx={style?.cartProductDiv}
                // xs={12}
                // lg={3}
                // xl={3}
                // sm={6}
                // md={6}
              >
                <Typography style={style?.cartProductName}>
                  {item.ProductName}
                </Typography>
                {item?.variantSKU === undefined ? null : (
                  <Typography style={style?.cartDescription} gutterBottom>
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
                  style={style?.cartPrice}
                  gutterBottom
                  className="font-weight-bold"
                >
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography style={style?.cartDescription} gutterBottom>
                  <b>Qty:</b> {item.qty + " " + item.UnitName}
                </Typography>

                <Typography style={style?.cartDescription} gutterBottom>
                  <b>Discription: </b>
                  {item.Description}
                </Typography>
              </Grid>
              <Grid
                item
                // xs={12}
                // lg={5}
                // xl={5}
                // sm={6}
                // md={6}
                style={style?.cartVariantDiv}
              >
                {" "}
                {item?.ingredients === undefined ? (
                  ""
                ) : (
                  <Typography style={style?.cartDescription} gutterBottom>
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
                {item?.extras === undefined ? (
                  ""
                ) : (
                  <Typography style={style?.cartDescription} gutterBottom>
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
                {item?.recommendations === undefined ? (
                  ""
                ) : (
                  <Typography style={style?.cartDescription} gutterBottom>
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
              <Grid
                item
                // xs={12}
                // lg={2}
                // xl={2}
                // sm={6}
                // md={6}
                style={style?.cartCounterDiv}
              >
                <Counter
                  style={style}
                  cart={cart}
                  setCart={setCart}
                  item={item}
                />
              </Grid>
              <Grid
                item
                // xs={12}
                // lg={6}
                // xl={6}
                // sm={6}
                // md={6}
                style={style?.cartNoteDiv}
              >
                {item?.itemNote === undefined ? (
                  ""
                ) : (
                  <Typography
                    style={style?.cartDescription}
                    gutterBottom
                    className="mx-1"
                  >
                    <b>Item Note: </b>
                    {item?.itemNote}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                // xs={12}
                // lg={6}
                // xl={6}
                // sm={6}
                // md={6}
                style={style?.cartTotalDiv}
              >
                <Typography
                  style={style?.cartDescription}
                  gutterBottom
                  // className=""
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
    <div>
      {/* <CssBaseline /> */}
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
            <Card sx={style?.card} className="m-1">
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    lg={3}
                    xl={3}
                    sm={12}
                    md={6}
                    style={style?.ordersText}
                  >
                    <Typography style={style?.cartDescription}>
                      Ordering Methods
                    </Typography>
                  </Grid>
                  {outputs}
                  {orderingWay === "tbl_qrcode" ? (
                    <>
                      <Grid
                        item
                        xs={12}
                        lg={style?.orderingOptions ? style?.orderingOptions : 4}
                        xl={4}
                        sm={12}
                        md={6}
                        style={style?.ordersText}
                      >
                        <Typography style={style?.cartDescription}>
                          Table Reservation
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        lg={style?.orderingOptions ? style?.orderingOptions : 4}
                        xl={4}
                        sm={12}
                        md={6}
                      >
                        <div
                          onClick={() => checkReservation("inside")}
                          style={
                            showReservation === "inside"
                              ? style.active
                              : style.deactive
                          }
                        >
                          <Typography style={style?.cartDescription}>
                            Scan QR Code
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        lg={style?.orderingOptions ? style?.orderingOptions : 4}
                        xl={4}
                        sm={12}
                        md={6}
                      >
                        <div
                          onClick={() => checkReservation("outside")}
                          style={
                            showReservation === "outside"
                              ? style.active
                              : style.deactive
                          }
                        >
                          <Typography style={style?.cartDescription}>
                            Reserve a table
                          </Typography>
                        </div>
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              </CardContent>
            </Card>
            <Card sx={style?.card} className="m-1">
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
                    <Typography style={style?.cartPrice}>
                      Delivery Fee
                    </Typography>
                    <Typography style={style?.cartPrice}>
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
                    <Typography style={style?.cartPrice}>
                      Grand Total
                    </Typography>
                    <Typography style={style?.cartPrice}>
                      {(sum + deliveryFees).toFixed(2) + "  " + currency}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {showReservation === "inside" ? (
              <Card sx={style?.card} className="m-1">
                <CardContent sx={{ flexGrow: 1 }}>
                  <div>
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "100%" }}
                    />
                    {table.length !== 0 ? (
                      <Typography style={style?.cartDescription} gutterBottom>
                        successfully authenticated: {table.tableId}
                      </Typography>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : showReservation === "outside" ? (
              <Card sx={style?.card} className="m-1">
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
                          style={style?.inputfield}
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
                          style={style?.inputfield}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
            {orderingWay === "delivery" ? (
              <Card sx={style?.card} className="m-1">
                <CardContent sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <TextareaAutosize
                        name="address"
                        onChange={changeHandle}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        minRows={1}
                        placeholder="Address"
                        style={style?.inputfield}
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
                          style={style?.inputfield}
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
                          style={style?.inputfield}
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
                          style={style?.inputfield}
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
                          style={style?.inputfield}
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
                  <Card sx={style?.card} className="m-1">
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
                              style={style?.inputfield}
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
                            style={style?.inputfield}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card sx={style?.card} className="m-1">
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
                                  style={style?.buttonStyle}
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
                                    style={style?.buttonStyle}
                                    type="submit"
                                    // onClick={() => saveOrder()}
                                  >
                                    <WhatsAppIcon /> {t("send_order")}
                                  </button>
                                ) : (
                                  <ReactWhatsapp
                                    className="col-12 btn"
                                    type="submit"
                                    style={style?.buttonStyle}
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
                                  style={style?.buttonStyle}
                                  type="submit"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </button>
                              ) : errors.phoneNumber && touched.phoneNumber ? (
                                <button
                                  className="col-12 btn"
                                  style={style?.buttonStyle}
                                  type="submit"
                                  // onClick={() => saveOrder()}
                                >
                                  <WhatsAppIcon /> {t("send_order")}
                                </button>
                              ) : (
                                <ReactWhatsapp
                                  className="col-12 btn"
                                  type="submit"
                                  style={style?.buttonStyle}
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
                              style={style?.buttonStyle}
                              onClick={() => saveOrder()}
                            >
                              <SendIcon /> {t("send_order")}
                            </button>
                          )}
                        </Grid>
                        <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                          <button
                            className="col-12 btn"
                            style={style?.buttonStyle}
                            onClick={() => [
                              emptyCart(),
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
    </div>
  );
};

export default Cart;
