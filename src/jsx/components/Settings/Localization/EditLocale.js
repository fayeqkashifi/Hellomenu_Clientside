import React, { useState, useEffect } from "react";

import axios from "axios";
import CustomAlert from "../../CustomAlert";
import { Button } from "react-bootstrap";
import { localization as t } from "../../Localization";

const EditLocale = (props) => {
  const id = props.history.location.state.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const dataLoad = async () => {
    try {
      axios
        .put(`/api/editLocale/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setData(JSON.parse(res.data.data.locale));
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setLoading(true);
    };
  }, []);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const changeHandle = (e) => {
    data[e.target.name] = e.target.value;
  };
  const save = () => {
    const formData = new FormData();
    formData.append("locale", JSON.stringify(data));
    formData.append("id", id);
    axios
      .post(`/api/updateLocale`, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.data.status) {
            localStorage.setItem("locale", JSON.stringify(data));
          }
          setAlerts(true, "success", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="spinner-border "
          role="status"
          style={{ color: "#5373e3" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {alert.open ? (
          <CustomAlert
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            setAlert={setAlert}
          />
        ) : (
          ""
        )}
        <div className="table-responsive ">
          <div className="text-right">
            <Button variant="success" onClick={save}>
              {t("save")}{" "}
            </Button>
          </div>
          <table className="table text-center ">
            <thead>
              <tr className="card-title">
                <th>{t("key")}</th>
                <th>{t("value")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, value]) => {
                return (
                  <tr key={key}>
                    <td width="20%">{key}</td>
                    <td width="80%">
                      <input
                        type="text"
                        name={key}
                        placeholder={value}
                        className="form-control"
                        onChange={(e) => changeHandle(e)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default EditLocale;
