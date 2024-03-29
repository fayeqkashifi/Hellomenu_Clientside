import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { TemplateContext } from "../../TemplateContext";

export default function Info() {
  const { style, branch } = useContext(TemplateContext);

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async () => {
    try {
      const data = atob(localStorage.getItem(btoa("uniqueId" + branch.id)));
      if (data !== null) {
        const result = await axios.get(`/api/getOrderBasedOnBroswerId/${data}`);
        if (result.data.status === 200) {
          if (result.data.fetchData.length !== 0) {
            setFetchData(result.data.fetchData[0]);
          }
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
        <div className="spinner-border " role="status" style={style?.spinner}>
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {fetchData.length !== 0 ? (
          <table
            className={`table table-hover table-bordered ${
              style.template === "dark" && "table-dark"
            }`}
          >
            <tbody>
              <tr>
                <th scope="row">Phone Number</th>
                <td>{fetchData.phoneNumber}</td>
              </tr>
              <tr>
                <th scope="row">Full Address</th>
                <td>{fetchData.fullAddress}</td>
              </tr>
              <tr>
                <th scope="row">Address Details</th>
                <td>
                  {(() => {
                    const rows = [];
                    for (const [key, value] of Object.entries(
                      JSON.parse(fetchData.otherAddressFields)
                    )) {
                      rows.push(
                        <Typography variant="body1" gutterBottom key={key}>
                          {key}: {value}
                        </Typography>
                      );
                    }
                    return rows;
                  })()}
                </td>
              </tr>
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
