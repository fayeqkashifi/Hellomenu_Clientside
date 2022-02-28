import React, { Fragment, useState } from "react";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

import { useTranslation } from "react-i18next";
import General from "./General";
import User from "./User";
import Locale from "./Localization";
import { checkPermission } from "../Permissions";
import EditLocale from "./Localization/EditLocale";

const Show = () => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const geturl = document.location.href.split("/");
  const [urlCheck, setUrlCheck] = useState(
    geturl[4] !== undefined ? geturl[4] : "settings"
  );
  const active = {
    cursor: "pointer",
    border: "1px solid",
    margin: "10px",
    borderRadius: "10px",
    borderColor: "#5373e3",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    backgroundColor: "#5373e3",
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
    color: "#5373e3",
  };
  return (
    <Fragment>
      <Router>
        <div className="card">
          <div className="card-header">
            <label className="card-title"> {t("settings_management")}</label>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f6fafc" }}>
            <div className="row mb-4">
              {checkPermission("general-info-view") && (
                <Link
                  to={`${url}`}
                  className="col d-flex justify-content-center align-items-center"
                  style={urlCheck === "settings" ? active : DeActive}
                  onClick={() => setUrlCheck("settings")}
                >
                  General Information
                </Link>
              )}
              {checkPermission("users-management-view") && (
                <Link
                  to={`${url}/user`}
                  className="col d-flex justify-content-center align-items-center"
                  style={urlCheck === "user" ? active : DeActive}
                  onClick={() => setUrlCheck("user")}
                >
                  User Management
                </Link>
              )}
              {checkPermission("localization-view") && (
                <Link
                  to={`${url}/localization`}
                  className="col d-flex justify-content-center align-items-center"
                  style={urlCheck === "localization" ? active : DeActive}
                  onClick={() => setUrlCheck("localization")}
                >
                  Localization
                </Link>
              )}
            </div>
            <Switch>
              <PrivateRoute exact path={`${path}`} component={General} />
              <PrivateRoute path={`${path}/user`} component={User} />
              <PrivateRoute path={`${path}/localization`} component={Locale} />
             
            </Switch>
          </div>
        </div>
      </Router>
    </Fragment>
  );
};

export default Show;
