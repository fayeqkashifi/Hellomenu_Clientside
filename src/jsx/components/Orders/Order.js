import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { base_url, port } from "../../../Consts";
import Chip from "@mui/material/Chip";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { CBreadcrumb } from "@coreui/react";

const Order = () => {
  const { t } = useTranslation();
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = () => {
    axios.get(`/api/getOrders`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, []);

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
        <tr key={i}>
          <td>{item.id}</td>
          <td>
            {item.orderingMethod === "whatsApp" ? (
              <Chip
                label="WhatsApp"
                color="success"
                variant="outlined"
                size="small"
              />
            ) : item.orderingMethod === "tbl_qrcode" ? (
              <Chip
                label="Table Reservation"
                color="primary"
                variant="outlined"
                size="small"
              />
            ) : (
              <Chip
                label="Home Delivery"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
          </td>
          <td>{item.phoneNumber}</td>
          <td>{item.generalNote}</td>
          <td>{item.tableId}</td>
          <td>{item.dateAndTime}</td>
          <td>
            {item.status === 1 ? (
              <Chip
                label="Completed"
                color="success"
                variant="outlined"
                size="small"
              />
            ) : item.status === 0 ? (
              <Chip
                label="Discarded"
                color="warning"
                variant="outlined"
                size="small"
              />
            ) : (
              <Chip
                label="Pending"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
          </td>
          <td>
            <Link
              to={{
                pathname: `/orders/orders-details`,
                state: { id: item.id },
              }}
            >
              <Tooltip title="Details">
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </td>
        </tr>
      );
    });
  }
  return (
    <Fragment>
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <Link
          to={{
            pathname: `/orders`,
          }}
          className="font-weight-bold"
        >
          {t("orders")}
        </Link>
      </CBreadcrumb>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive ">
            <table className="table text-center ">
              <thead>
                <tr className="card-title">
                  <th>{t("order_id")}</th>
                  <th>{t("ordering_methods")}</th>
                  <th>{t("phone_number")}</th>
                  <th>{t("note")}</th>
                  <th>{t("table_number")}</th>
                  <th>{t("dateAndTime")}</th>
                  <th>{t("status")}</th>
                  <th>{t("details")}</th>
                </tr>
              </thead>
              <tbody>{viewOrders_HTMLTABLE}</tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Order;
