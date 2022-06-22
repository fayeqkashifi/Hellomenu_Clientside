import React, { useState, useContext } from "react";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PublicRoute from "../../../../PublicRoute";
import Info from "./Info";
import LatestOrder from "./LatestOrder";
import Wishlist from "./Wishlist";

import { TemplateContext } from "../../TemplateContext";
const Profile = () => {
  const { style } = useContext(TemplateContext);
  const { path, url } = useRouteMatch();
  const geturl = document.location.href.split("/");
  const [urlCheck, setUrlCheck] = useState(
    geturl[6] !== undefined ? geturl[6] : "settings"
  );

  return (
    <div className="p-5">
      <Router>
        <div className="card" style={style?.card}>
          <div className="card-body">
            <div className="row mb-4">
              <Link
                to={`${url}`}
                className="col d-flex justify-content-center align-items-center"
                style={
                  urlCheck === "settings"
                    ? style?.activeMenu
                    : style?.DeActiveMenu
                }
                onClick={() => setUrlCheck("settings")}
              >
                Wishlist
              </Link>
              <Link
                to={`${url}/latest-order`}
                className="col d-flex justify-content-center align-items-center"
                style={
                  urlCheck === "latest-order"
                    ? style?.activeMenu
                    : style?.DeActiveMenu
                }
                onClick={() => setUrlCheck("latest-order")}
              >
                Latest Order
              </Link>
              <Link
                to={`${url}/info`}
                className="col d-flex justify-content-center align-items-center"
                style={
                  urlCheck === "info" ? style?.activeMenu : style?.DeActiveMenu
                }
                onClick={() => setUrlCheck("info")}
              >
                Information
              </Link>
            </div>
            <Switch>
              <PublicRoute exact path={`${path}`} component={Wishlist} />
              <PublicRoute
                path={`${path}/latest-order`}
                component={LatestOrder}
              />
              <PublicRoute path={`${path}/info`} component={Info} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default Profile;
