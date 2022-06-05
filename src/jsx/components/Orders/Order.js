import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Chip from "@mui/material/Chip";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import Search from "../Common/Search";
import Paginate from "../Common/Paginate";
import OrderStatus from "./Status";

const Order = () => {
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getOrders`);
      if (result.data.status === 200) {
        setFetchData(result.data.fetchData.data);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);

  var viewOrders_HTMLTABLE = "";
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
          <OrderStatus item={item} />
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
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    return (
      <Fragment>
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">{t("orders")}</h4>
                </div>
                <div>
                  <div className="input-group">
                    <Search
                      setFetchData={setFetchData}
                      url={"/api/searchOrder"}
                      defaultUrl={"/api/getOrders"}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive ">
                  <table className="table text-center ">
                    <thead className="table-light">
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
                    <tbody>
                      {fetchData.length !== 0 ? (
                        viewOrders_HTMLTABLE
                      ) : (
                        <tr>
                          <td colSpan={8}> {t("noItemFound")}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer border-0">
                <Paginate
                  fetchData={fetchData}
                  setFetchData={setFetchData}
                  url={"/api/getOrders"}
                />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default Order;
