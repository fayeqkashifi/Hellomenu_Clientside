import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import { CBreadcrumb } from "@coreui/react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import CustomAlert from "../CustomAlert";
import { Button, Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactWhatsapp from "react-whatsapp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { localization as t } from "../Localization";
import Chip from "@mui/material/Chip";

const OrderDetails = (props) => {
  let message = "";

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = props.history.location.state.id;
  const currency = getSymbolFromCurrency(fetchData[0]?.currency_code);
  const [order, setOrder] = useState([]);
  let [sum, setSum] = useState(0);
  const [check, setCheck] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);
  const dataLoad = async () => {
    try {
      const items = await axios.get(`/api/getOrderItem/${id}`);

      let newArray = [];
      if (items.data.status === 200) {
        const data = items.data.fetchData;
        let TotalSum = 0;
        await data.map(
          (item) =>
            (TotalSum +=
              item.total_price === null
                ? item.price * item.qty
                : item.total_price)
        );
        setSum(TotalSum);
        let ingredients;
        let extras;
        let recommends;
        for (var i = 0; i < data.length; i++) {
          ingredients = await axios.get(
            `/api/getItemIngredients/${data[i].itemId}`
          );
          extras = await axios.get(`/api/getItemExtras/${data[i].itemId}`);
          recommends = await axios.get(
            `/api/getItemRecommends/${data[i].itemId}`
          );
          // console.log(recommends);
          newArray.push({
            ...data[i],
            ingredients: ingredients.data.fetchData,
            extras: extras.data.fetchData,
            recommendations: recommends.data.fetchData,
          });
        }
        setFetchData(newArray);
      }
      const result = await axios.get(`/api/getOrder/${id}`);
      if (result.data.status === 200) {
        setOrder(result.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      await setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // dataLoad();
    return () => {
      setFetchData([]);
      setOrder([]);
      setSum(0);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
    return () => {
      setSum(0);
    };
  }, [check]);
  const initialValues = {
    discardReason: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      discardReason: Yup.string().required("Reason is required"),
    });
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
  const discardOrder = (data) => {
    axios
      .post(`/api/discardOrder/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "error", res.data.message);
          setCheck(!check);
          setModalCentered(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const completedOrder = () => {
    axios
      .get(`/api/completedOrder/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setCheck(!check);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var viewOrders_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only"></span>
      </div>
    );
  } else {
    viewOrders_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <div key={i} className="card m-2">
          <div className="card-body">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={2} xl={3} sm={6} md={6}>
                <img
                  style={{
                    height: "200px",
                    width: "100%",
                    borderRadius: "15px",
                    objectFit: "contain",
                  }}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                />
              </Grid>
              <Grid item xs={12} lg={3} xl={4} sm={6} md={6}>
                <h1 style={{ textTransform: "capitalize" }}>
                  {item.ProductName}
                </h1>
                {item?.variant_sku && (
                  <Typography variant="body1" gutterBottom>
                    <b>{t("variants")}:</b> {item?.variant_sku}
                  </Typography>
                )}
                <Typography variant="body1" gutterBottom>
                  <b>{t("price")}:</b>{" "}
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <b>{t("qty")}:</b>{" "}
                  {item.qty +
                    " " +
                    (item.UnitName == null ? "" : item.UnitName)}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={5} xl={5} sm={6} md={6}>
                {item?.ingredients.length == 0 ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>{t("ingredients")}:</b>
                    {item.ingredients?.map((val, i) => {
                      if (item?.ingredients.length === i + 1) {
                        return val.name + " - Not Included";
                      } else {
                        return val.name + ", ";
                      }
                    })}
                  </Typography>
                )}
                {item?.extras.length === 0 ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>{t("extras")}:</b>

                    {item?.extras?.map((val, i) => {
                      if (item?.extras.length == i + 1) {
                        return (
                          val.name +
                          "(+" +
                          val.extra_price +
                          ")" +
                          " - Included"
                        );
                      } else {
                        return val.name + "(+" + val.extra_price + ")" + " , ";
                      }
                    })}
                  </Typography>
                )}
                {item?.recommendations.length === 0 ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>{t("recommendation")}: </b>

                    {item?.recommendations?.map((val, i) => {
                      return (
                        val.ProductName +
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
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                {item?.item_note && (
                  <Typography variant="body1" className="mx-1">
                    <b>{t("item_note")}: </b>
                    {item.item_note}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  className="text-right mx-5"
                >
                  <b>{t("total_price")}: </b>
                  {item.total_price === null
                    ? (item.price * item.qty).toFixed(2)
                    : item.total_price.toFixed(2)}
                  {" " + currency}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      );
    });
  }
  return (
    <Fragment>
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
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <Link
          to={{
            pathname: `/orders`,
          }}
          className="font-weight-bold"
        >
          {t("orders")}
        </Link>
        {"  ->   "}
        <div className="font-weight-bold">{t("details")}</div>
      </CBreadcrumb>
      {viewOrders_HTMLTABLE}
      <div className="card m-1">
        <div className="card-body">
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <b>{t("ordering_methods")}: </b>
                {order.orderingMethod === "whatsApp"
                  ? t("whatsapp")
                  : order.orderingMethod === "tbl_qrcode"
                  ? t("table_qrcode")
                  : t("home_delivery")}
              </Typography>
              {order.tableId !== null ? (
                <>
                  <Typography variant="body1" gutterBottom>
                    <b>{t("table_number")}: </b>
                    {order.tableId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>{t("reservation_date_and_time")}: </b>
                    {order.dateAndTime === null ? "Now" : order.dateAndTime}
                  </Typography>
                </>
              ) : null}
              {order.generalNote && (
                <Typography variant="body1" gutterBottom>
                  <b>{t("general_note")}: </b>
                  {order.generalNote}
                </Typography>
              )}

              <Typography variant="body1" gutterBottom>
                <b>{t("phone_number")}: </b>
                {order.phoneNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>{t("status")}: </b>
                <Chip
                  label={order.status}
                  color={
                    order.status_id === 1
                      ? "default"
                      : order.status_id === 2
                      ? "primary"
                      : order.status_id === 3
                      ? "secondary"
                      : order.status_id === 4
                      ? "info"
                      : order.status_id === 5
                      ? "error"
                      : order.status_id === 5
                      ? "danger"
                      : "success"
                  }
                  variant="outlined"
                  size="small"
                />
              </Typography>
              {order.status === 0 ? (
                <Typography variant="body1" gutterBottom>
                  <b>{t("discard_reason")}: </b>
                  {order.discardReason}
                </Typography>
              ) : null}
            </Grid>
            {order.orderingMethod === "delivery" ? (
              <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
                {order.fullAddress ? (
                  <Typography variant="body1" gutterBottom>
                    <b>{t("full_address")}: </b> {order.fullAddress}
                  </Typography>
                ) : null}
                {(() => {
                  const rows = [];
                  for (const [key, value] of Object.entries(
                    JSON.parse(order.otherAddressFields)
                  )) {
                    rows.push(
                      <Typography variant="body1" gutterBottom key={key}>
                        <b>{key}: </b> {value}
                      </Typography>
                    );
                  }
                  return rows;
                })()}
              </Grid>
            ) : null}
          </Grid>
        </div>
      </div>
      <div className="card m-1">
        <div className="card-body">
          <Grid container spacing={2} className="text-center ">
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <h4>
                <b>{t("delivery_fees")}: </b>
                {order.deliveryFees + "  " + currency}
              </h4>
            </Grid>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <h4>
                <b>{t("grand_total")}: </b>
                {(sum + order.deliveryFees).toFixed(2) + "  " + currency}
              </h4>
            </Grid>
          </Grid>
        </div>
      </div>
      {order.status === 1 ? null : (
        <div className="text-right m-1">
          <Button variant="success" className="m-1" onClick={completedOrder}>
            {t("complete_order")}{" "}
          </Button>
          <Button
            variant="danger"
            className="m-1"
            onClick={() => setModalCentered(true)}
          >
            {t("discard_order")}{" "}
          </Button>
        </div>
      )}
      {modalCentered && (
        <Modal className="fade" show={modalCentered}>
          <Modal.Header>
            <Modal.Title>Discard Order</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={discardOrder}
          >
            {({ errors, touched, values }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label> Reason </label>
                    <Field
                      as="textarea"
                      name="discardReason"
                      className={
                        "form-control" +
                        (errors.discardReason && touched.discardReason
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Reason..."
                    />
                    <ErrorMessage
                      name="discardReason"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => setModalCentered(false)}
                    variant="danger light"
                  >
                    {t("close")}
                  </Button>
                  <p className="d-none">
                    {
                      (message = `*Order Number*: ${order.id} \n*Status*:* Discarded* \n*Reason*: ${values?.discardReason} \n`)
                    }
                  </p>
                  {values?.discardReason === "" ? (
                    <Button variant="primary" type="submit">
                      {t("save")}{" "}
                    </Button>
                  ) : (
                    <ReactWhatsapp
                      className="btn btn-primary"
                      type="submit"
                      // style={buttonStyle}
                      number={order.phoneNumber}
                      message={message}
                      max="4096"
                      onClick={() => discardOrder()}
                    >
                      <WhatsAppIcon fontSize="small" /> {t("send_order")}
                    </ReactWhatsapp>
                  )}
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </Fragment>
  );
};
export default OrderDetails;
