import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { base_url, port } from "../../../Consts";
import { CBreadcrumb } from "@coreui/react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import getSymbolFromCurrency from "currency-symbol-map";
import CustomAlert from "../CustomAlert";
import { Button, Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactWhatsapp from "react-whatsapp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const OrderDetails = (props) => {
  let message = "";

  const { t } = useTranslation();
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
      const result = await axios.get(`/api/getOrder/${id}`);
      if (result.data.status === 200) {
        let items = JSON.parse(result.data.fetchData.orderingItems);
        setFetchData(items);
        setOrder(result.data.fetchData);
        let TotalSum = 0;
        items.map(
          (item) =>
            (TotalSum +=
              item.totalPrice === undefined
                ? item.price * item.qty
                : parseInt(item.totalPrice) + item.price * (item.qty - 1))
        );
        setSum(TotalSum);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
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
    axios.post(`/api/discardOrder/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "error", res.data.message);
        setCheck(!check);
        setModalCentered(false);
      }
    });
  };
  const completedOrder = () => {
    axios.get(`/api/completedOrder/${id}`).then((res) => {
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
        setCheck(!check);
      }
    });
  };
  var viewOrders_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewOrders_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <Card key={i} className="m-1">
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
                  variant="body1"
                  style={{ textTransform: "capitalize" }}
                >
                  <b> Product:</b> {item.ProductName}
                </Typography>
                {item?.variantSKU === undefined ? null : (
                  <Typography variant="body1" gutterBottom>
                    <b>Variants:</b>{" "}
                    {item?.variantSKU?.map((val, i) => {
                      if (item?.variantSKU.length === i + 1) {
                        return val;
                      } else {
                        return val + ", ";
                      }
                    })}
                  </Typography>
                )}
                <Typography variant="body1" gutterBottom>
                  <b>Price:</b>{" "}
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <b>Qty:</b> {item.qty + " " + item.UnitName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <b>Description:</b> {item.Description}
                </Typography>
              </Grid>
              <Grid item xs={6} xs={12} lg={5} xl={5} sm={6} md={6}>
                {item?.ingredients === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Ingredients:</b>
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
                    <b>Extras:</b>

                    {item?.extras?.map((val, i) => {
                      if (item?.extras.length == i + 1) {
                        return val.value + " - Included";
                      } else {
                        return val.value + " , ";
                      }
                    })}
                  </Typography>
                )}
                {item?.recommendations === undefined ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Recommendations:</b>

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
                      }
                    })}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                {item?.itemNote === undefined ? null : (
                  <Typography variant="body1" className="mx-1">
                    <b>Item Note: </b>
                    {item.itemNote}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                <Typography
                  variant="body1"
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
      <Card className="m-1">
        <CardContent sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <b>Prdering Method: </b>
                {order.orderingMethod === "whatsApp"
                  ? " WhatsApp"
                  : order.orderingMethod === "tbl_qrcode"
                  ? " Table Reservation"
                  : " Home Delivery"}
              </Typography>
              {order.tableId !== null ? (
                <>
                  <Typography variant="body1" gutterBottom>
                    <b>Table Number: </b>
                    {order.tableId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Reservation date and time: </b>
                    {order.dateAndTime === null ? "Now" : order.dateAndTime}
                  </Typography>
                </>
              ) : null}
              <Typography variant="body1" gutterBottom>
                <b>General Note: </b>
                {order.generalNote}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Phone Number: </b>
                {order.phoneNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Status: </b>
                {order.status === 0
                  ? " Discarded"
                  : order.status === 1
                  ? " Completed"
                  : " Pending"}
              </Typography>
              {order.status === 0 ? (
                <Typography variant="body1" gutterBottom>
                  <b>Discard Reason: </b>
                  {order.discardReason}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <b>Address: </b> {order.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Building No: </b> {order.buildingNo}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Floor: </b> {order.floor}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Flat: </b> {order.flat}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Directions: </b> {order.directions}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className="m-1">
        <CardContent sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <b>Delivery Fees: </b>
                {order.deliveryFees + "  " + currency}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <b>Grand Total: </b>
                {(sum + order.deliveryFees).toFixed(2) + "  " + currency}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {order.status === 1 ? null : (
        <div className="text-right m-1">
          <Button variant="success" className="m-1" onClick={completedOrder}>
            Complete Order{" "}
          </Button>
          <Button
            variant="danger"
            className="m-1"
            //  onClick={discardOrder}
            onClick={() => setModalCentered(true)}
          >
            Discard Order{" "}
          </Button>
        </div>
      )}
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
          {({ errors, status, touched, values }) => (
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
    </Fragment>
  );
};
export default OrderDetails;
