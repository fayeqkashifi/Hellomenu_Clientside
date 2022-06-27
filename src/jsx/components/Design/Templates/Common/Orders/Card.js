import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getSymbolFromCurrency from "currency-symbol-map";
import Chip from "@mui/material/Chip";
import { base_url, port } from "../../../../../../Consts";
import { TemplateContext } from "../../TemplateContext";

const CardOrder = (props) => {
  const { setOrder, order, id } = props;
  let { style, locale } = useContext(TemplateContext);

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
        let grandTotal = 0;
        for (var i = 0; i < data.length; i++) {
          let TotalSum = 0;
          const ingredients = await axios.get(
            `/api/getItemIngredients/${data[i].itemId}`
          );
          const extras = await axios.get(
            `/api/getItemExtras/${data[i].itemId}`
          );
          extras.data.fetchData.map((extra) => {
            TotalSum += extra.extra_price;
          });
          const recommends = await axios.get(
            `/api/getItemRecommends/${data[i].itemId}`
          );
          recommends.data.fetchData.map((recom) => {
            TotalSum += recom.price * recom.qty;
          });
          newArray.push({
            ...data[i],
            totalPrice: parseInt(data[i].price) * data[i].qty + TotalSum,
            ingredients: ingredients.data.fetchData,
            extras: extras.data.fetchData,
            recommendations: recommends.data.fetchData,
          });
          grandTotal += parseInt(data[i].price) * data[i].qty + TotalSum;
        }
        setSum(grandTotal);
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
      <div className="spinner-border " role="status" style={style?.spinner}>
        <span className="sr-only"></span>
      </div>
    );
  } else {
    viewOrders_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <div key={i} className="card my-2" style={style?.card}>
          <div className="card-body">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={3} xl={3} sm={6} md={6}>
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
              <Grid item xs={12} lg={4} xl={4} sm={6} md={6}>
                <Typography style={style?.cartProductName}>
                  {item.ProductName}
                </Typography>
                {item?.variant_sku ? (
                  JSON.parse(item?.variant_sku).length != 0 ? (
                    <Typography style={style?.cartDescription} gutterBottom>
                      {locale?.variants}: {item?.variant_sku}
                    </Typography>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                <Typography style={style?.cartPrice}>
                  {locale?.price}:{" "}
                  {parseInt(item.price).toFixed(2) + "  " + currency}
                </Typography>
                <Typography style={style?.cartDescription}>
                  {locale?.qty}:
                  {item.qty +
                    " " +
                    (item.UnitName == null ? "" : item.UnitName)}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={5} xl={5} sm={12} md={12}>
                {item?.ingredients.length == 0 ? null : (
                  <Typography style={style?.cartDescription}>
                    {locale?.ingredients}:
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
                  <Typography style={style?.cartDescription}>
                    {locale?.extras}:
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
                  <Typography style={style?.cartDescription}>
                    {locale?.recommendation}:
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
                  <Typography style={style?.cartDescription} className="mx-1">
                    {locale?.item_note}:{item.item_note}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6} xl={6} sm={6} md={6}>
                <Typography
                  style={style?.cartDescription}
                  gutterBottom
                  className="text-right mx-5"
                >
                  {locale?.total_price}:{item.totalPrice.toFixed(2)}
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
    <div>
      {viewOrders_HTMLTABLE}
      <div className="card my-1" style={style?.card}>
        <div className="card-body">
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography style={style?.cartDescription}>
                {locale?.ordering_methods}:
                {order.orderingMethod === "whatsApp"
                  ? locale?.whatsApp
                  : order.orderingMethod === "tbl_qrcode"
                  ? locale?.table_reservation
                  : locale?.home_delivery}
              </Typography>
              {order.tableId !== null ? (
                <>
                  <Typography style={style?.cartDescription}>
                    {locale?.table_number}:{order.tableId}
                  </Typography>
                  <Typography style={style?.cartDescription}>
                    {locale?.reservation_date_and_time}:
                    {order.dateAndTime === null ? "Now" : order.dateAndTime}
                  </Typography>
                </>
              ) : null}
              {order.generalNote && (
                <Typography style={style?.cartDescription}>
                  {locale?.general_note}:{order.generalNote}
                </Typography>
              )}

              <Typography style={style?.cartDescription}>
                {locale?.phone_number}:{order.phoneNumber}
              </Typography>
              <Typography style={style?.cartDescription}>
                {locale?.status}:
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
                <Typography style={style?.cartDescription}>
                  {locale?.discard_reason}:{order.discardReason}
                </Typography>
              ) : null}
            </Grid>
            {order.orderingMethod === "delivery" ? (
              <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
                {order.fullAddress ? (
                  <Typography style={style?.cartDescription}>
                    {locale?.full_address}: {order.fullAddress}
                  </Typography>
                ) : null}
                {(() => {
                  const rows = [];
                  for (const [key, value] of Object.entries(
                    JSON.parse(order.otherAddressFields)
                  )) {
                    rows.push(
                      <Typography style={style?.cartDescription}>
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
      <div className="card my-1" style={style?.card}>
        <div className="card-body">
          <Grid container spacing={2} className="text-center ">
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography
                style={style?.cartPrice}
                gutterBottom
                className="font-weight-bold"
              >
                {locale?.delivery_fee}:{order.deliveryFees + "  " + currency}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} xl={6} sm={12} md={6}>
              <Typography
                style={style?.cartPrice}
                gutterBottom
                className="font-weight-bold"
              >
                {locale?.grand_total}:
                {(sum + order.deliveryFees).toFixed(2) + "  " + currency}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default CardOrder;
