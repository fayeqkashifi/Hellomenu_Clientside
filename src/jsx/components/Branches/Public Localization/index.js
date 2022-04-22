import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { localization as t } from "../../Localization";
import PublicLocale from "./Locale";
const PublicLocalization = (props) => {
  const id = props.history.location.state.id;
  const { path, url } = useRouteMatch();
  const [lang, setLang] = useState([]);
  const [langId, setLangId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/branchLangs/${id}`)
      .then((res) => {
        setLang(res.data.fetchData);
        res.data.fetchData.filter((item) => {
          if (item.default == 1) {
            setLangId(item.id);
          }
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      setLang([]);
    };
  }, []);
  const active = {
    cursor: "pointer",
    border: "1px solid",
    margin: "10px",
    borderRadius: "10px",
    borderColor: "#f50b65",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    backgroundColor: "#f50b65",
    color: "#fff",
  };
  const DeActive = {
    height: "50px",
    cursor: "pointer",
    border: "1px solid",
    borderRadius: "10px",
    margin: "10px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    color: "#f50b65",
  };
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only"></span>
      </div>
    );
  } else {
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <label className="card-title"> {t("public_loaclization")}</label>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f6fafc" }}>
            <div className="row">
              {lang.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="col d-flex justify-content-center align-items-center"
                    style={langId === item.id ? active : DeActive}
                    onClick={() => setLangId(item.id)}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
            <PublicLocale langId={langId} />
          </div>
        </div>
      </div>
    );
  }
};

export default PublicLocalization;
