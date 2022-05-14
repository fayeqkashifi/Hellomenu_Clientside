import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Analytics = () => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-9 col-xxl-12">
          <div className="row">
            <div className="col-xl-12 col-xxl-6 col-md-6">
              <div className="card">
                <div className="card-header border-0 pb-2 d-lg-flex d-block">
                  <div>
                    <h4 className="card-title mb-2">Most Favorites Items</h4>
                    <p className="fs-14 mb-0">
                      Lorem ipsum dolor sit amet, consectetur
                    </p>
                  </div>
                </div>
                <div className="card-body p-1">
                  <div className="sp15 row border-bottom favorites-items p-3 align-items-center p-sm-4">
                    <div className="col-xl-5 col-lg-5 col-sm-8 col-12 mb-3 mb-lg-0">
                      <div className="media align-items-center">
                        <Link to={"/ecom-product-detail"}>
                          {/* <img
                            className="rounded mr-3"
                            src={
                              require("./../../../../images/card/pic4.jpg")
                                .default
                            }
                            alt=""
                            width="105"
                          /> */}
                        </Link>
                        <div className="media-body">
                          <h5 className="mb-2">
                            <Link
                              to={"/ecom-product-detail"}
                              className="text-black"
                            >
                              Watermelon Juice with Ice
                            </Link>
                          </h5>
                          <div className="star-review fs-14 mb-2">
                            <i className="fa fa-star text-orange"></i>
                            <i className="fa fa-star text-orange"></i>
                            <i className="fa fa-star text-orange"></i>
                            <i className="fa fa-star text-gray"></i>
                            <i className="fa fa-star text-gray"></i>
                            <span className="ml-3 text-dark">(454 revies)</span>
                          </div>
                          <Link
                            to={"#"}
                            className="text-primary fs-14 d-flex align-items-center"
                          >
                            <i
                              className="fa fa-heart fs-20 mr-2"
                              aria-hidden="true"
                            ></i>{" "}
                            <strong>256k</strong> Like it
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-sm-4 col-12 media align-items-center">
                      <div className="media-body">
                        <h3 className="text-black font-w600 mb-1">45%</h3>
                        <span className="text-black">Interest</span>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-sm-6 col-6">
                      <div className="d-flex align-items-flex-end mb-1">
                        <svg
                          className="mr-3"
                          width="25"
                          height="26"
                          viewBox="0 0 25 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="3.54545"
                            height="26"
                            rx="1.77273"
                            fill="#EA4989"
                          />
                          <rect
                            x="7.09082"
                            y="7.0909"
                            width="3.54545"
                            height="18.9091"
                            rx="1.77273"
                            fill="#EA4989"
                          />
                          <rect
                            x="14.1816"
                            y="17.7273"
                            width="3.54545"
                            height="8.27273"
                            rx="1.77273"
                            fill="#EA4989"
                          />
                          <rect
                            x="21.2725"
                            y="3.54546"
                            width="3.54545"
                            height="22.4545"
                            rx="1.77273"
                            fill="#EA4989"
                          />
                        </svg>
                        <h3 className="text-black mb-0 font-w600 fs-22">
                          6732
                        </h3>
                      </div>
                      <span className="text-black">Total Sales</span>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-sm-6 col-6 text-right">
                      <div className="d-inline-block relative donut-chart-sale">
                        {/* <Donught2
                          backgroundColor="#ea4989"
                          height="100"
                          width="100"
                          value="87"
                          cutoutPercentage="80"
                        /> */}
                        <small className="text-black fs-18">87%</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer border-0 text-center">
                  <Link to={"#"} className="btn-link">
                    View More &gt;&gt;
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-xxl-6 col-md-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <div>
                    <h4 className="text-black">Best seler menus</h4>
                    <p className="fs-14 mb-0"> Lorem ipsum dolor</p>
                  </div>
                </div>
                <div className="card-body border-bottom">
                  <div className="media mb-3">
                    <Link to={"/ecom-product-detail"}>
                      {/* <img
                        className="rounded"
                        src={
                          require("../../../../images/card/pic11.jpg").default
                        }
                        style={{ width: "100%" }}
                        alt=""
                      /> */}
                    </Link>
                  </div>
                  <div className="info">
                    <h5 className="text-black mb-3">
                      <Link to={"/ecom-product-detail"} className="text-black">
                        Medium Spicy Pizza with Kemangi Leaf
                      </Link>
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="font-w600 mb-0 text-black">$6.53</h4>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="22"
                          height="20"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.8401 2.60999C19.3294 2.099 18.7229 1.69364 18.0555 1.41708C17.388 1.14052 16.6726 0.998169 15.9501 0.998169C15.2276 0.998169 14.5122 1.14052 13.8448 1.41708C13.1773 1.69364 12.5709 2.099 12.0601 2.60999L11.0001 3.66999L9.94012 2.60999C8.90843 1.5783 7.50915 0.998704 6.05012 0.998704C4.59109 0.998704 3.19181 1.5783 2.16012 2.60999C1.12843 3.64169 0.548828 5.04096 0.548828 6.49999C0.548828 7.95903 1.12843 9.3583 2.16012 10.39L3.22012 11.45L11.0001 19.23L18.7801 11.45L19.8401 10.39C20.3511 9.87924 20.7565 9.27281 21.033 8.60535C21.3096 7.93789 21.4519 7.22248 21.4519 6.49999C21.4519 5.77751 21.3096 5.0621 21.033 4.39464C20.7565 3.72718 20.3511 3.12075 19.8401 2.60999Z"
                            fill="#EA4989"
                          ></path>
                        </svg>
                        <h6 className="text-black mb-0">256k</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="21"
                          height="18"
                          viewBox="0 0 21 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="2.95455"
                            height="18"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="5.90918"
                            y="4.90906"
                            width="2.95455"
                            height="13.0909"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="11.8184"
                            y="12.2728"
                            width="2.95455"
                            height="5.72727"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="17.7275"
                            y="2.45459"
                            width="2.95455"
                            height="15.5455"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                        </svg>
                        <h6 className="text-black mb-0">6,723</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body border-bottom">
                  <div className="media mb-3">
                    <Link to={"/ecom-product-detail"}>
                      {/* <img
                        className="rounded"
                        src={
                          require("../../../../images/card/pic12.jpg").default
                        }
                        style={{ width: "100%" }}
                        alt=""
                      /> */}
                    </Link>
                  </div>
                  <div className="info">
                    <h5 className="text-black mb-3">
                      <Link to={"/ecom-product-detail"} className="text-black">
                        Medium Spicy Pizza with Kemangi Leaf
                      </Link>
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="font-w600 mb-0 text-black">$6.53</h4>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="22"
                          height="20"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.8401 2.60999C19.3294 2.099 18.7229 1.69364 18.0555 1.41708C17.388 1.14052 16.6726 0.998169 15.9501 0.998169C15.2276 0.998169 14.5122 1.14052 13.8448 1.41708C13.1773 1.69364 12.5709 2.099 12.0601 2.60999L11.0001 3.66999L9.94012 2.60999C8.90843 1.5783 7.50915 0.998704 6.05012 0.998704C4.59109 0.998704 3.19181 1.5783 2.16012 2.60999C1.12843 3.64169 0.548828 5.04096 0.548828 6.49999C0.548828 7.95903 1.12843 9.3583 2.16012 10.39L3.22012 11.45L11.0001 19.23L18.7801 11.45L19.8401 10.39C20.3511 9.87924 20.7565 9.27281 21.033 8.60535C21.3096 7.93789 21.4519 7.22248 21.4519 6.49999C21.4519 5.77751 21.3096 5.0621 21.033 4.39464C20.7565 3.72718 20.3511 3.12075 19.8401 2.60999Z"
                            fill="#EA4989"
                          ></path>
                        </svg>
                        <h6 className="text-black mb-0">256k</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="21"
                          height="18"
                          viewBox="0 0 21 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="2.95455"
                            height="18"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="5.90918"
                            y="4.90906"
                            width="2.95455"
                            height="13.0909"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="11.8184"
                            y="12.2728"
                            width="2.95455"
                            height="5.72727"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="17.7275"
                            y="2.45459"
                            width="2.95455"
                            height="15.5455"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                        </svg>
                        <h6 className="text-black mb-0">6,723</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body border-bottom">
                  <div className="media mb-3">
                    <Link to={"/ecom-product-detail"}>
                      {/* <img
                        className="rounded"
                        src={
                          require("../../../../images/card/pic11.jpg").default
                        }
                        style={{ width: "100%" }}
                        alt=""
                      /> */}
                    </Link>
                  </div>
                  <div className="info">
                    <h5 className="text-black mb-3">
                      <Link to={"/ecom-product-detail"} className="text-black">
                        Pizza Meal for Kids (Small size)
                      </Link>
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="font-w600 mb-0 text-black">$6.53</h4>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="22"
                          height="20"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.8401 2.60999C19.3294 2.099 18.7229 1.69364 18.0555 1.41708C17.388 1.14052 16.6726 0.998169 15.9501 0.998169C15.2276 0.998169 14.5122 1.14052 13.8448 1.41708C13.1773 1.69364 12.5709 2.099 12.0601 2.60999L11.0001 3.66999L9.94012 2.60999C8.90843 1.5783 7.50915 0.998704 6.05012 0.998704C4.59109 0.998704 3.19181 1.5783 2.16012 2.60999C1.12843 3.64169 0.548828 5.04096 0.548828 6.49999C0.548828 7.95903 1.12843 9.3583 2.16012 10.39L3.22012 11.45L11.0001 19.23L18.7801 11.45L19.8401 10.39C20.3511 9.87924 20.7565 9.27281 21.033 8.60535C21.3096 7.93789 21.4519 7.22248 21.4519 6.49999C21.4519 5.77751 21.3096 5.0621 21.033 4.39464C20.7565 3.72718 20.3511 3.12075 19.8401 2.60999Z"
                            fill="#EA4989"
                          ></path>
                        </svg>
                        <h6 className="text-black mb-0">256k</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <svg
                          className="mr-2"
                          width="21"
                          height="18"
                          viewBox="0 0 21 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="2.95455"
                            height="18"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="5.90918"
                            y="4.90906"
                            width="2.95455"
                            height="13.0909"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="11.8184"
                            y="12.2728"
                            width="2.95455"
                            height="5.72727"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                          <rect
                            x="17.7275"
                            y="2.45459"
                            width="2.95455"
                            height="15.5455"
                            rx="1.47727"
                            fill="#EA4989"
                          ></rect>
                        </svg>
                        <h6 className="text-black mb-0">6,723</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer border-0 text-center">
                  <Link
                    to={"#"}
                    href="ecom-product-list.html"
                    className="btn-link"
                  >
                    View More &gt;&gt;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Analytics;
