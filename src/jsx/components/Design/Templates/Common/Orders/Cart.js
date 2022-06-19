import React, { useState, useEffect, useContext } from "react";
import Header from "../Layout/Header";
import { base_url, port } from "../../../../../../Consts";
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
import * as Yup from "yup";
import "yup-phone";
import { Formik, Form, ErrorMessage } from "formik";
import {
  getTables,
  checkTheTbl,
  insertOrder,
  remCartItem,
  emptyCart,
  getProduct,
  getVariations,
} from "../../Functionality";
import PhoneInput, {
  isValidPhoneNumber,
  // isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ipapi from "ipapi.co";
import Counter from "../Counter/Counter";
import { TemplateContext } from "../../TemplateContext";
import axios from "axios";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";

const Cart = (props) => {
  let message = "";

  let {
    style,
    cart,
    setCart,
    branch,
    deliveryFees,
    locale,
    selectedLang,
    setAlerts,
  } = useContext(TemplateContext);
  const initialValues = {
    phoneNumber: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      phoneNumber: Yup.string().required("Phone Number is required"),
    });
  };
  const currency = getSymbolFromCurrency(branch?.currency_code);
  const [loading, setLoading] = useState(true);
  let [sum, setSum] = useState(0);
  const [tables, setTables] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  let source = axios.CancelToken.source();
  const dataLoad = async () => {
    let total = 0;
    let newArray = [];
    await cart.map((item) => {
      getProduct(item.id, selectedLang.id, source).then((result) => {
        if (result !== undefined) {
          if (result.data.fetchData.length !== 0) {
            let ingredientArray = [];
            result.data.ingredients.map((ingredient) => {
              if (item.ingredients.includes(ingredient.value)) {
                ingredientArray.push(ingredient.label);
              }
            });
            let extraArray = [];
            let extraTotal = 0;
            result.data.extras.map((extra) => {
              if (item.extras.includes(extra.value)) {
                extraArray.push(extra);
                extraTotal += extra.price;
              }
            });
            let recommendArray = [];
            let recomendTotal = 0;
            result.data.recommend.map((recom) => {
              item.recommendations.filter((recommend) => {
                if (recommend.value === recom.value) {
                  recommendArray.push({
                    ...recom,
                    qty: recommend.qty,
                  });
                  recomendTotal += recom.price * recommend.qty;
                }
              });
            });
            const itemFetchData = result.data.fetchData[0];
            if (item.checkSKU) {
              if (item.checkSKU.length != 0) {
                getVariations(item.id, source).then((res) => {
                  if (res !== undefined) {
                    if (res !== "") {
                      let varData = JSON.parse(res.variants).filter(
                        (variant) => variant.sku === item.checkSKU
                      );
                      if (varData.length !== 0) {
                        newArray.push({
                          ...itemFetchData,
                          ...item,
                          price: parseInt(varData[0].price),
                          stock: parseInt(varData[0].stock),
                          ingredients: ingredientArray,
                          totalPrice:
                            parseInt(varData[0].price) * item.qty +
                            extraTotal +
                            recomendTotal,
                          extras: extraArray,
                          recommendations: recommendArray,
                        });
                        total +=
                          parseInt(varData[0].price) * item.qty +
                          extraTotal +
                          recomendTotal;
                        setSum(total);
                      }
                    }
                  }
                });
              } else {
                newArray.push({
                  ...itemFetchData,
                  ...item,
                  ingredients: ingredientArray,
                  totalPrice:
                    itemFetchData.price * item.qty + extraTotal + recomendTotal,
                  extras: extraArray,
                  recommendations: recommendArray,
                });
                total +=
                  itemFetchData.price * item.qty + extraTotal + recomendTotal;
              }
            } else {
              newArray.push({
                ...itemFetchData,
                ...item,
                // totalPrice: 0,
                ingredients: ingredientArray,
                extras: extraArray,
                recommendations: recommendArray,
              });
              total += item.qty * itemFetchData.price;
            }
            setSum(total);
          }
        }
      });
    });
    await setFetchData(newArray);

    await getTables(branch.id).then((res) => {
      setTables(res);
    });
    setLoading(false);
  };
  const [ipApi, setIpApi] = useState([]);
  useEffect(() => {
    var callback = function (loc) {
      setIpApi(loc);
    };
    ipapi.location(callback);
  }, []);
  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoad();
    return () => {
      source.cancel();
    };
  }, []);
  useEffect(() => {
    // if (fetchData.length !== cart.length) {
    //   dataLoad();
    // } else {
    let Total = 0;
    fetchData.map(
      (item) =>
        (Total +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(Total);
    // }

    return () => {
      setSum(0);
    };
  }, [cart, fetchData]);
  const remItem = (id, qty, price) => {
    setSum((sum -= price * qty));
    remCartItem(id, cart).then((data) => {
      setCart(data);
      setFetchData(fetchData.filter((item) => item.id !== id));
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
  const [otherAddress, setOtherAddress] = useState([]);
  const changeHandleAddress = (e) => {
    setOtherAddress({ ...otherAddress, [e.target.name]: e.target.value });
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
  const [error, setError] = useState(false);
  const saveOrder = (data) => {
    if (orderingWay !== undefined) {
      if (orderingWay === "tbl_qrcode" && showReservation.length === 0) {
        setAlerts(true, "warning", locale?.please_select_table_reservation);
      } else {
        orderingWay === "tbl_qrcode"
          ? showReservation === "outside"
            ? userData.dateAndTime === undefined ||
              userData.table_id === undefined
              ? setError(true)
              : save(data)
            : table.length === 0
            ? setAlerts(true, "warning", locale?.please_scan_the_table_QR_code)
            : save(data)
          : orderingWay === "delivery"
          ? branch.fullAddress
            ? userData.address === undefined || userData.address === ""
              ? setError(true)
              : save(data)
            : save(data)
          : save(data);
      }
    } else {
      setAlerts(
        true,
        "warning",
        locale?.please_choose_at_least_one_way_of_ordering
      );
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
      formData.append(
        "browserUniqueId",
        atob(localStorage.getItem("uniqueId"))
      );
      formData.append("dateAndTime", userData.dateAndTime);
      formData.append("orderingMethod", orderingWay);
      formData.append("generalNote", userData.generalNote);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("fullAddress", userData.address);
      formData.append("otherAddressFields", JSON.stringify(otherAddress));
      formData.append("deliveryFees", deliveryFees);
      formData.append("branch_id", branch.id);
      insertOrder(formData).then((res) => {
        Swal.fire({
          title: "Thank You For Your Order!",
          html:
            "Please have this number on hand in case you need to track your order: " +
            res.orderId,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#93de8b",
        }).then((check) => {
          if (check) {
            setTable([]);
            setUserData([]);
            setCart([]);
            localStorage.removeItem("cart");
          }
        });
        // setAlerts(true, "success", msg);
      });
    }
  };

  const outputs = [];
  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only"></span>
      </div>
    );
  } else {
    for (const [key, value] of Object.entries(
      JSON.parse(branch.orderMethods)
    )) {
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
          >
            <div
              onClick={() => checkOrderingMethod(key)}
              style={orderingWay === key ? style.active : style.deactive}
            >
              <Typography style={style?.cartDescription}>
                {key === "tbl_qrcode"
                  ? locale?.table_reservation
                  : key === "delivery"
                  ? locale?.home_delivery
                  : key === "whatsApp"
                  ? locale?.whatsApp
                  : key}
              </Typography>
            </div>
          </Grid>
        );
      }
    }

    viewImages_HTMLTABLE = fetchData?.map((item, i) => {
      message =
        message +
        `*${locale?.product_name}*: ${item.ProductName} \n*${
          locale?.category
        }*: ${item.CategoryName} ${
          item.SubCategoryName == null
            ? ""
            : ` \n*${locale?.sub_category}*: ${item.SubCategoryName}`
        } \n*${locale?.qty}*: ${item.qty} \n*${locale?.price}*: ${
          item.price + " " + currency
        }  ${
          item.variantSKU === undefined
            ? ""
            : item.variantSKU.length === 0
            ? ""
            : `\n*${locale?.item_variant}*: ${item.variantSKU}`
        } ${
          item.extras === undefined
            ? ""
            : item.extras.length === 0
            ? ""
            : `\n*${locale?.extras}*: ${item.extras?.map(
                (val) => val.label + "(+" + val.price + ")"
              )} INCLUDED`
        } ${
          item.ingredients === undefined
            ? ""
            : item.ingredients.length === 0
            ? ""
            : `\n*${locale?.ingredients}*: ${item.ingredients} NOT INCLUDED`
        } ${
          item.recommendations === undefined
            ? ""
            : item.recommendations.length === 0
            ? ""
            : `\n*${locale?.recommendation}*: ${item.recommendations?.map(
                (val) =>
                  val.label +
                  ` ${locale?.price}: ` +
                  val.price +
                  currency +
                  ` ${locale?.qty}: ` +
                  val.qty
              )}`
        } ${
          item.itemNote == undefined
            ? ""
            : `\n*${locale?.item_note}*: ${item.itemNote}`
        }${
          item.totalPrice === undefined
            ? `\n*${locale?.item_total_price}*: ${
                item.qty * item.price + " " + currency
              }`
            : `\n*${locale?.item_total_price}*: ${
                item.totalPrice + " " + currency
              }`
        }\n\n`;
      return (
        <Card key={i} sx={style?.card} className="mb-1">
          <div className="text-right">
            <Tooltip title={locale?.close}>
              <IconButton
                onClick={() => remItem(item.id, item.qty, item.price)}
              >
                <ClearIcon sx={style.clearIcon} />
              </IconButton>
            </Tooltip>
          </div>

          <CardContent>
            <div className="row">
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12`
                }
                // className="col border"
                style={style?.cartImageDiv}
              >
                <img
                  style={style?.cartImage}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                />
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-4 col-md-6 col-lg-6 col-sm-6 col-12`
                }
                // className="col border"
                sx={style?.cartProductDiv}
              >
                <Typography style={style?.cartProductName}>
                  {item.ProductName}
                </Typography>
                {item.variantSKU === undefined
                  ? null
                  : item?.variantSKU.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.variants}: </b>

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
                {item.UnitName && (
                  <Typography style={style?.cartDescription} gutterBottom>
                    <b>{locale?.unit_name}:</b> {item.UnitName}
                  </Typography>
                )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-3 col-md-10 col-lg-10 col-sm-10 col-12`
                }
                style={style?.cartVariantDiv}
              >
                {" "}
                {item.ingredients === undefined
                  ? ""
                  : item.ingredients.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.ingredients}: </b>
                        {item.ingredients?.map((val, i) => {
                          if (item.ingredients.length === i + 1) {
                            return val + " - Not Included";
                          } else {
                            return val + ", ";
                          }
                        })}
                      </Typography>
                    )}
                {item.extras === undefined
                  ? ""
                  : item.extras.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.extras}: </b>

                        {item.extras?.map((val, i) => {
                          if (item?.extras.length === i + 1) {
                            return (
                              val.label + "(+" + val.price + ")" + " - Included"
                            );
                          } else {
                            return val.label + "(+" + val.price + ")" + " , ";
                          }
                        })}
                      </Typography>
                    )}
                {item.recommendations === undefined
                  ? ""
                  : item.recommendations.length !== 0 && (
                      <Typography style={style?.cartDescription} gutterBottom>
                        <b>{locale?.recommendation}: </b>

                        {item.recommendations?.map((val, i) => {
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
                        })}
                      </Typography>
                    )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-2 col-md-2 col-lg-2 col-sm-2 col-12`
                }
                style={style?.cartCounterDiv}
              >
                <Counter
                  item={item}
                  setFetchData={setFetchData}
                  fetchData={fetchData}
                />
              </div>
            </div>
            <div className="row">
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-6 col-md-6 col-lg-6 col-sm-12 col-12`
                }
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
                    <b>{locale?.item_note}: </b>
                    {item?.itemNote}
                  </Typography>
                )}
              </div>
              <div
                className={
                  style.template === "dark" &&
                  `col-xl-6 col-md-6 col-lg-6 col-sm-12 col-12 text-right`
                }
                style={style?.cartTotalDiv}
              >
                <Typography style={style?.cartDescription} gutterBottom>
                  <b>{locale?.total_price}: </b>
                  {item?.totalPrice !== undefined
                    ? item.totalPrice.toFixed(2)
                    : (parseInt(item.price) * item.qty).toFixed(2)}
                  {" " + currency}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
    message =
      message +
      `\n\n------------------------- \n *${locale?.sub_total}*: ${
        sum.toFixed(2) + "  " + currency
      }\n *${locale?.delivery_fee}*: ${
        deliveryFees.toFixed(2) + "  " + currency
      }\n *${locale?.grand_total}*: ${
        (sum + deliveryFees).toFixed(2) + "  " + currency
      }${
        userData?.generalNote === undefined || userData?.generalNote === ""
          ? ""
          : `\n *${locale?.general_note}*: ${userData?.generalNote}`
      }`;
    if (orderingWay === "delivery") {
      message =
        message +
        `\n---------------- \n *${locale?.ordering_methods}*:${locale?.home_delivery}\n *${locale?.address}*: ${userData?.address}\n`;
    }
  }
  return (
    <div className="p-5">
      {cart.length === 0 ? (
        <div className="card" style={style?.cardStyle}>
          <div className="card-body">
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
              {locale?.no_item_available}
            </div>
          </div>
        </div>
      ) : (
        <>
          {viewImages_HTMLTABLE}
          <Card sx={style?.card} className="my-1">
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
                    {locale?.ordering_methods}
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
                        {locale?.table_reservation}
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
                          {locale?.scan_QR_code}
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
                          {locale?.reserve_a_table}
                        </Typography>
                      </div>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
          <Card sx={style?.card} className="my-1">
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
                    {locale?.delivery_fee}
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
                    {locale?.grand_total}
                  </Typography>
                  <Typography style={style?.cartPrice}>
                    {(sum + deliveryFees).toFixed(2) + "  " + currency}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {showReservation === "inside" ? (
            <Card sx={style?.card} className="my-1">
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
                      {locale?.successfully_authenticated}: {table.tableId}
                    </Typography>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : showReservation === "outside" ? (
            <Card sx={style?.card} className="my-1">
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                    <div className="form-group">
                      <select
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        // aria-label="Default select example"
                        onChange={changeHandle}
                        style={style?.inputfield}
                        name="table_id"
                      >
                        <option> {locale?.select_a_table}</option>
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
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        placeholder={locale?.date_and_time}
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
            <Card sx={style?.card} className="my-1">
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {branch.fullAddress ? (
                    <Grid item xs={12} lg={4} xl={3} sm={6} md={6}>
                      <TextareaAutosize
                        name="address"
                        onChange={changeHandle}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        minRows={1}
                        placeholder={locale?.full_address}
                        style={style?.inputfield}
                        // width="100%"
                      />
                    </Grid>
                  ) : null}
                  {JSON.parse(branch?.otherAddressFields)?.map((item, i) => {
                    return (
                      <Grid item xs={12} lg={4} xl={3} sm={6} md={6} key={i}>
                        <div className="form-group">
                          <input
                            name={item}
                            type="text"
                            className={"form-control"}
                            placeholder={item}
                            onChange={changeHandleAddress}
                            style={style?.inputfield}
                          />
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          ) : null}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={saveOrder}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Card sx={style?.card} className="my-1">
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} lg={12} xl={6} sm={12} md={12}>
                        <div className="form-group">
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry={ipApi?.country_code}
                            className={
                              errors.phoneNumber && touched.phoneNumber
                                ? " is-invalid"
                                : ""
                            }
                            name="phoneNumber"
                            // style={style?.inputfield}
                            onChange={(getOptionValue) => {
                              setFieldValue("phoneNumber", getOptionValue);
                            }}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            style={{ fontSize: "0.7em" }}
                            className="invalid-feedback"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={12} xl={6} sm={12} md={12}>
                        <TextareaAutosize
                          name="generalNote"
                          onChange={changeHandle}
                          className={"form-control"}
                          minRows={3}
                          placeholder={locale?.general_note}
                          style={style?.inputfield}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={style?.card} className="my-1">
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                        {orderingWay !== "tbl_qrcode" ? (
                          <>
                            {orderingWay === undefined ? (
                              <button
                                className="col-12 btn"
                                style={style?.buttonStyle}
                                type="submit"
                                // onClick={() => saveOrder()}
                              >
                                <WhatsAppIcon /> {locale?.send_order}
                              </button>
                            ) : orderingWay === "delivery" ? (
                              branch.fullAddress ? (
                                userData.address === undefined ||
                                userData.address === "" ? (
                                  <button
                                    className="col-12 btn"
                                    style={style?.buttonStyle}
                                    type="submit"
                                    // onClick={() => saveOrder()}
                                  >
                                    <WhatsAppIcon /> {locale?.send_order}
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
                                    <WhatsAppIcon /> {locale?.send_order}
                                  </ReactWhatsapp>
                                )
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
                                  <WhatsAppIcon />
                                  {locale?.send_order}
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
                                <WhatsAppIcon /> {locale?.send_order}
                              </button>
                            ) : errors.phoneNumber && touched.phoneNumber ? (
                              <button
                                className="col-12 btn"
                                style={style?.buttonStyle}
                                type="submit"
                                // onClick={() => saveOrder()}
                              >
                                <WhatsAppIcon />
                                {locale?.send_order}
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
                                <WhatsAppIcon /> {locale?.send_order}
                              </ReactWhatsapp>
                            )}
                          </>
                        ) : (
                          <button
                            className="col-12 btn"
                            style={style?.buttonStyle}
                            onClick={() => saveOrder()}
                          >
                            <SendIcon /> {locale?.send_order}
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
                          <ClearIcon /> {locale?.empty_cart}
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
    </div>
  );
};

export default Cart;
