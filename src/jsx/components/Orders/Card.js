import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import { localization as t } from "../Localization";
import Chip from "@mui/material/Chip";

const ItemCard = (props) => {
  const { setOrder, order, id } = props;

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = getSymbolFromCurrency(fetchData[0]?.currency_code);
  let [sum, setSum] = useState(0);
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
    dataLoad();
    return () => {
      setFetchData([]);
      setOrder([]);
      setSum(0);
      setLoading(true);
    };
  }, []);

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
                    {t("variants")}: {item?.variant_sku}
                  </Typography>
                )}
                <Typography variant="body1" gutterBottom>
                  {t("price")}:{" "}
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t("qty")}:
                  {item.qty +
                    " " +
                    (item.UnitName == null ? "" : item.UnitName)}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={5} xl={5} sm={6} md={6}>
                {item?.ingredients.length == 0 ? null : (
                  <Typography variant="subtitle1" gutterBottom>
                    {t("ingredients")}:
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
                    {t("extras")}:
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
                    {t("recommendation")}:
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
                    {t("item_note")}:{item.item_note}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  className="text-right mx-5"
                >
                  {t("total_price")}:
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
      {viewOrders_HTMLTABLE}
      <div className="card m-1">
        <div className="card-body">
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography variant="body1" gutterBottom>
                {t("ordering_methods")}:
                {order.orderingMethod === "whatsApp"
                  ? t("whatsapp")
                  : order.orderingMethod === "tbl_qrcode"
                  ? t("table_qrcode")
                  : t("home_delivery")}
              </Typography>
              {order.tableId !== null ? (
                <>
                  <Typography variant="body1" gutterBottom>
                    {t("table_number")}:{order.tableId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {t("reservation_date_and_time")}:
                    {order.dateAndTime === null ? "Now" : order.dateAndTime}
                  </Typography>
                </>
              ) : null}
              {order.generalNote && (
                <Typography variant="body1" gutterBottom>
                  {t("general_note")}:{order.generalNote}
                </Typography>
              )}

              <Typography variant="body1" gutterBottom>
                {t("phone_number")}:{order.phoneNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("status")}:
                <Chip
                  label={order.label}
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
                      ? "warning"
                      : order.status_id === 6
                      ? "success"
                      : "error"
                  }
                  variant="outlined"
                  size="small"
                />
              </Typography>
              {order.status === 0 ? (
                <Typography variant="body1" gutterBottom>
                  {t("discard_reason")}:{order.discardReason}
                </Typography>
              ) : null}
            </Grid>
            {order.orderingMethod === "delivery" ? (
              <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
                {order.fullAddress ? (
                  <Typography variant="body1" gutterBottom>
                    {t("full_address")}: {order.fullAddress}
                  </Typography>
                ) : null}
                {(() => {
                  const rows = [];
                  for (const [key, value] of Object.entries(
                    JSON.parse(order.otherAddressFields)
                  )) {
                    rows.push(
                      <Typography variant="body1" gutterBottom key={key}>
                        {key}: {value}
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
    </Fragment>
  );
};
export default ItemCard;
