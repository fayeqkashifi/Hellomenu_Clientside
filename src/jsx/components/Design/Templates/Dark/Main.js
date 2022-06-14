import React, { useContext } from "react";

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
export default function Main() {
  const { path, url } = useRouteMatch();
  const { style, locale } = useContext(TemplateContext);
  return (
    <Router>
      <div style={style?.sidebar}>
        <div className="border-bottom m-3">LOGO</div>

        <Link style={style?.sidebarActiveLink} to={`${url}`}>
          <HomeIcon className="my-2" />
          <br></br>
          Home
        </Link>
        <Link to="#news" style={style?.sidebarLinks}>
          <PersonIcon className="my-2" />
          <br></br>
          Profile
        </Link>
        <Link to="#contact" style={style?.sidebarLinks}>
          <ShoppingCartIcon className="my-2" />
          <br></br>
          Cart
        </Link>
        <Link to={`${url}/track-order`} style={style?.sidebarLinks}>
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
          </Switch>
        </div>
      </div>
      <Footer title={locale?.checkout_order} />
    </Router>
  );
}
