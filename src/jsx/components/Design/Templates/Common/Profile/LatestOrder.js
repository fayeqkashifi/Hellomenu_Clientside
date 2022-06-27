import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import { TemplateContext } from "../../TemplateContext";

export default function LatestOrder() {
  const { style, branch } = useContext(TemplateContext);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async () => {
    try {
      const data = atob(localStorage.getItem(btoa("uniqueId" + branch.id)));
      if (data !== null) {
        const result = await axios.get(`/api/getOrderBasedOnBroswerId/${data}`);
        if (result.data.status === 200) {
          setFetchData(result.data.fetchData);
          setLoading(false);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      } else {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status" style={style?.spinner}>
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {fetchData.length !== 0 ? (
          <table
            className={`table table-hover ${
              style.template === "dark" && "table-dark"
            }`}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Order Id</th>
                <th scope="col">Status</th>
                <th scope="col">Ordering Method</th>
              </tr>
            </thead>
            <tbody>
              {fetchData.map((item, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{item.orderId}</td>
                    <td>{item.label}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div
            className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center"
            style={style?.cartDescription}
          >
            No Item Found
          </div>
        )}{" "}
      </div>
    );
  }
}
