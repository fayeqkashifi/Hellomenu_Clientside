import React, { useContext, useState } from "react";

import Footer from "../Common/Layout/Footer";

import { TemplateContext } from "../TemplateContext";
import Menubar from "../Common/Layout/Menubar/Menubar";
import "./style.css";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import TrackOrder from "../Common/Orders/TrackOrder";
import PublicRoute from "../../../PublicRoute";
import Home from "./Home";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PageviewIcon from "@mui/icons-material/Pageview";
import Cart from "../Common/Orders/Cart";
import Profile from "../Common/Profile/Profile";
export default function Main() {
  const { path, url } = useRouteMatch();
  const { style, locale, branch } = useContext(TemplateContext);
  const geturl = document.location.href.split("/");

  const [urlCheck, setUrlCheck] = useState(
    geturl[5] !== undefined ? geturl[5] : "home"
  );
  return (
    <Router>
      <div style={style?.sidebar}>
        <div style={style?.logoText}>{branch.BrancheName}</div>
        <Link
          to={`${url}`}
          style={
            urlCheck === "home" ? style?.sidebarActiveLink : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("home")}
        >
          <HomeIcon className="my-2" />
          <br></br>
          Home
        </Link>
        <Link
          to={`${url}/profile`}
          // style={style?.sidebarLinks}
          style={
            urlCheck === "profile"
              ? style?.sidebarActiveLink
              : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("profile")}
        >
          <PersonIcon className="my-2" />
          <br></br>
          Profile
        </Link>
        <Link
          to={`${url}/cart`}
          style={
            urlCheck === "cart" ? style?.sidebarActiveLink : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("cart")}
        >
          <ShoppingCartIcon className="my-2" />
          <br></br>
          Cart
        </Link>
        <Link
          to={`${url}/track-order`}
          style={
            urlCheck === "track-order"
              ? style?.sidebarActiveLink
              : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("track-order")}
        >
          <PageviewIcon className="my-2" />
          <br></br>
          Track Order
        </Link>
      </div>
      <div style={style?.content}>
        <div style={style?.background}>
          <Switch>
            <PublicRoute exact path={`${path}`} component={Home} />
            <PublicRoute path={`${path}/track-order`} component={TrackOrder} />
            <PublicRoute path={`${path}/cart`} component={Cart} />
            <PublicRoute path={`${path}/profile`} component={Profile} />
          </Switch>
        </div>
      </div>
      <Footer title={locale?.checkout_order} />
    </Router>
  );
}
