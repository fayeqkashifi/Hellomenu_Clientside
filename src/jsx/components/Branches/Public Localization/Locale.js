import React, { useState, useEffect } from "react";

import axios from "axios";
import CustomAlert from "../../CustomAlert";
import { Button } from "react-bootstrap";
import { localization as t } from "../../Localization";

const PublicLocale = (props) => {
  const langId = props.langId;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [publicId, setPublicId] = useState([]);

  const dataLoad = () => {
    try {
      axios
        .get(`/api/editLocalePublic/${langId}`)
        .then((res) => {
          if (res.status === 200) {
            setPublicId(res.data.data.id);
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
  }, [langId]);
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
    formData.append("id", publicId);
    axios
      .post(`/api/updateLocalePublic`, formData)
      .then((res) => {
        if (res.status === 200) {
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
          style={{ color: "#f50b65" }}
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
          <table className="table text-left">
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
          <div className="text-right">
            <Button variant="primary" onClick={save}>
              {t("save")}{" "}
            </Button>
          </div>
        </div>
      </>
    );
  }
};

export default PublicLocale;
