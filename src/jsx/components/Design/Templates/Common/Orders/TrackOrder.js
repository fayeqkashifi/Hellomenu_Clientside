import React, { useState, useEffect, useContext } from "react";
import "./TrackStyle.css";
import axios from "axios";
import OrderSearch from "./OrderSearch";
import { TemplateContext } from "../../TemplateContext";
import CardOrder from "./Card";

const TrackOrder = () => {
  let { style } = useContext(TemplateContext);

  const [data, setData] = useState([]);
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getOrderStatus`);
      if (result.data.status === 200) {
        setData(result.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
  }, []);
  const [error, setError] = useState();

  return (
    <div className="p-5">
      <OrderSearch
        setOrder={setOrder}
        setShowDetails={setShowDetails}
        setError={setError}
      />
      {order == null ? (
        error == null ? (
          ""
        ) : (
          <div className="card" style={style?.cardStyle}>
            <div className="card-body">
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
                {error}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="padding-bottom-3x mb-1 " key={order}>
          <div className="card mb-3" style={style?.cardStyle}>
            <div className="p-4 text-center text-white text-lg ">
              <span className="text-uppercase">Tracking Order No - </span>
              <span className="text-medium">{order.orderId}</span>
            </div>
            <div className="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 text-white text-lg">
              <div className="w-100 text-center py-1 px-2 ">
                <span className="text-medium">Status:</span>
                {order.label}
              </div>
              <div className="w-100 text-center py-1 px-2">
                <span className="text-medium">Order Date:</span>{" "}
                {order.created_at}
              </div>
            </div>
            <div className="card-body ">
              <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x ">
                {data?.map((itemMap, i) => {
                  return (
                    <div
                      className={`step ${
                        order.status_id == 7
                          ? "canceled"
                          : i + 1 <= order.status_id
                          ? "completed"
                          : ""
                      }`}
                      key={itemMap.id}
                    >
                      <div className="step-icon-wrap">
                        <div className="step-icon">
                          <i
                            className={`pe-7s-${
                              itemMap.id === 1
                                ? "cart"
                                : itemMap.id === 2
                                ? "look"
                                : itemMap.id === 3
                                ? "folder"
                                : itemMap.id === 4
                                ? "next"
                                : itemMap.id === 5
                                ? "car"
                                : itemMap.id === 6
                                ? "home"
                                : "close-circle"
                            }`}
                          ></i>
                        </div>
                      </div>
                      <h4 className="step-title text-white">{itemMap.label}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {showDetails ? (
            order.length != 0 ? (
              <CardOrder id={order.id} setOrder={setOrder} order={order} />
            ) : (
              ""
            )
          ) : (
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-center justify-content-sm-between align-items-center">
              <div className="custom-control custom-checkbox mr-3"></div>
              <div className="text-left text-sm-right">
                <button
                  className="btn btn-outline-primary btn-rounded btn-sm"
                  onClick={() => setShowDetails(true)}
                >
                  View Order Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
