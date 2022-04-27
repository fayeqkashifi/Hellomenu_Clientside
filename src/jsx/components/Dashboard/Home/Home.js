import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTItle from "../../../layouts/PageTitle";
import { localization as t } from "../../Localization";
import axios from "axios";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [countBranches, setCountBranches] = useState(0);
  const [countCategories, setCountCategories] = useState(0);
  const [countProducts, setCountProducts] = useState(0);
  const [countOrders, setCountOrders] = useState(0);

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
        </div>
      </Fragment>
    );
  }
};

export default Home;
