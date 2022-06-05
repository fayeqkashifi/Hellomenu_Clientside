import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTItle from "../../../layouts/PageTitle";
import { localization as t } from "../../Localization";
import Chip from "@mui/material/Chip";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { base_url, port } from "../../../../Consts";
import getSymbolFromCurrency from "currency-symbol-map";
import { Dropdown } from "react-bootstrap";

import axios from "axios";
// import Analytics from "./Analytics/Analytics";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [countBranches, setCountBranches] = useState(0);
  const [countCategories, setCountCategories] = useState(0);
  const [countProducts, setCountProducts] = useState(0);
  const [countOrders, setCountOrders] = useState(0);
  const [fetchData, setFetchData] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);

  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getBranches");
      if (result.data.status === 200) {
        setCountBranches(result.data.fetchData.data.length);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const res = await axios.get("/api/getCateSubCate");
      if (res.data.status === 200) {
        // console.log(res.data.fetchData);
        setCountCategories(res.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const response = await axios.get("/api/countProducts");
      if (response.data.status === 200) {
        setCountProducts(response.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const orders = await axios.get("/api/countOrders");
      if (orders.data.status === 200) {
        setCountOrders(orders.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const ordersData = await axios.get(`/api/getOrders`);
      if (ordersData.data.status === 200) {
        setFetchData(ordersData.data.fetchData.data);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      const daily = await axios.get(`/api/dailyTrendProducts`);
      if (daily.data.status === 200) {
        setDailyTrend(daily.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setCountBranches([]);
      setLoading(true);
    };
  }, []);
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    return (
      <Fragment>
        <PageTItle
          headingPara={t("dashboard")}
          activeMenu={t("dashboard")}
          motherMenu={t("home")}
        />
        <div className="row">
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div className="widget-stat card">
              <div className="card-body p-4">
                <Link to="/branches">
                  <div className="media ai-icon">
                    <span className="mr-3 bgl-primary text-primary">
                      <i className="ti-user"></i>
                    </span>
                    <div className="media-body">
                      <p className="mb-1">{t("branches")}</p>
                      <h4 className="mb-0">{countBranches}</h4>
                      {/* <span className="badge badge-primary">+3.5%</span> */}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div className="widget-stat card">
              <div className="card-body p-4">
                <div className="media ai-icon">
                  <span className="mr-3 bgl-warning text-warning">
                    <svg
                      id="icon-orders"
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file-text"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </span>
                  <div className="media-body">
                    <p className="mb-1"> {t("active_categories")}</p>
                    <h4 className="mb-0">{countCategories}</h4>
                    {/* <span className="badge badge-warning">+3.5%</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div className="widget-stat card">
              <div className="card-body  p-4">
                <div className="media ai-icon">
                  <span className="mr-3 bgl-danger text-danger">
                    <svg
                      id="icon-revenue"
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-dollar-sign"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </span>
                  <div className="media-body">
                    <p className="mb-1"> {t("products")}</p>
                    <h4 className="mb-0">{countProducts}</h4>
                    {/* <span className="badge badge-danger">-3.5%</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div className="widget-stat card">
              <div className="card-body p-4">
                <Link to="/orders">
                  <div className="media ai-icon">
                    <span className="mr-3 bgl-success text-success">
                      <svg
                        id="icon-database-widget"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-database"
                      >
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                      </svg>
                    </span>
                    <div className="media-body">
                      <p className="mb-1">{t("orders")}</p>
                      <h4 className="mb-0">{countOrders}</h4>
                      {/* <span className="badge badge-success">-3.5%</span> */}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-xxl-8 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">
                    {t("recent_order_request")}
                  </h4>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive ">
                  <table className="table table-hover">
                    <tbody>
                      {fetchData.map((item, i) => {
                        return (
                          <tr key={i} height={100}>
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
                            <td>{item.tableId}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Chip
                                  label={item.status}
                                  color={
                                    item.status_id === 1
                                      ? "default"
                                      : item.status_id === 2
                                      ? "primary"
                                      : item.status_id === 3
                                      ? "secondary"
                                      : item.status_id === 4
                                      ? "info"
                                      : item.status_id === 5
                                      ? "error"
                                      : item.status_id === 5
                                      ? "danger"
                                      : "success"
                                  }
                                  variant="outlined"
                                  size="small"
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Link
                                  to={"#"}
                                  className="btn bgl-warning text-warning"
                                >
                                  PENDING
                                </Link>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant
                                    className="table-dropdown icon-false "
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24px"
                                      height="24px"
                                      viewBox="0 0 24 24"
                                      version="1.1"
                                    >
                                      <g
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                      >
                                        <rect
                                          x="0"
                                          y="0"
                                          width="24"
                                          height="24"
                                        ></rect>
                                        <circle
                                          fill="#000000"
                                          cx="12"
                                          cy="5"
                                          r="2"
                                        ></circle>
                                        <circle
                                          fill="#000000"
                                          cx="12"
                                          cy="12"
                                          r="2"
                                        ></circle>
                                        <circle
                                          fill="#000000"
                                          cx="12"
                                          cy="19"
                                          r="2"
                                        ></circle>
                                      </g>
                                    </svg>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>
                                      <Link to={"#"} className="text-black">
                                        <svg
                                          className="mr-3"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                                            stroke="#209F84"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M22 4L12 14.01L9 11.01"
                                            stroke="#209F84"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                        Accept order
                                      </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <Link to={"#"} className="text-black">
                                        <svg
                                          className="mr-3"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="#F24242"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                          <path
                                            d="M15 9L9 15"
                                            stroke="#F24242"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                          <path
                                            d="M9 9L15 15"
                                            stroke="#F24242"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                        </svg>
                                        Reject order
                                      </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <Link to={"#"} className="text-black">
                                        <svg
                                          className="mr-3"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="#6F6F6F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                          <path
                                            d="M12 16V12"
                                            stroke="#6F6F6F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                          <path
                                            d="M12 8H12.01"
                                            stroke="#6F6F6F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>
                                        </svg>
                                        View Details
                                      </Link>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
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
                      })}
                    </tbody>
                  </table>
                  <div className="card-footer border-0 pt-0 text-center">
                    <Link to={"/orders"} className="btn-link">
                      {t("view_more")} &gt;&gt;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-xxl-4 col-lg-12 col-sm-12">
            <div className="card">
              <div className="card-header border-0">
                <div>
                  <h4 className="card-title mb-2">
                    {t("daily_trending_products")}
                  </h4>
                </div>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="widget-media trending-menus">
                  <ul className="timeline">
                    {dailyTrend.map((item, i) => {
                      return (
                        <li key={i}>
                          <div className="timeline-panel">
                            <div className="media mr-3">
                              {/* <Link to={"/ecom-product-detail"}> */}
                              <img
                                alt=""
                                width="90"
                                src={`http://${base_url}:${port}/images/products/${
                                  JSON.parse(item.image)[0]
                                }`}
                              />
                              {/* </Link> */}
                              <div className="number">#{i + 1}</div>
                            </div>
                            <div className="media-body">
                              <h5 className="mb-3">
                                <Link
                                  to={"/ecom-product-detail"}
                                  className="text-black"
                                >
                                  {item.ProductName}
                                </Link>
                              </h5>
                              <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 text-black font-w600">
                                  {item.price}{" "}
                                  {getSymbolFromCurrency(item.currency_code)}
                                </h4>
                                <p className="mb-0">
                                  {t("order")}{" "}
                                  <strong className="text-black font-w500">
                                    {item.count}x
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Analytics /> */}
      </Fragment>
    );
  }
};

export default Home;
