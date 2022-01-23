import React from "react";
/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
/// Css
import "./index.css";
import "./chart.css";
/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Deshboard
import Home from "./components/Dashboard/Home/Home";
import Branches from "./components/Branches/Branches";
import BranchShow from "./components/Branches/Show";

import Company from "./components/Companies/Company";
import ServiceArea from "./components/Services/ServiceArea";
import Inventory from "./components/Inventories/Inventory";
import Profile from "./components/Dashboard/Profile/Profile";
import Order from "./components/Orders/Order";
import Basket from "./components/Orders/Basket";
import Tables from "./components/Branches/Tables";
import Attributes from "./components/Attributes/Attributes";
import Error404 from "./pages/Error404";
import Ingredients from "./components/Products/Ingredients";
import Extra from "./components/Products/Extra";
import Area from "./components/Areas/Area";
import OrderDetails from "./components/Orders/OrderDetails";

const Markup = () => {
  const routes = [
    /// Login
    { url: "dashboard", component: Home },
    { url: "branches", component: Branches },
    { url: "ingredients", component: Ingredients },
    { url: "extras", component: Extra },
    { url: "company", component: Company },
    { url: "branches/service-area", component: ServiceArea },
    { url: "branches/inventory", component: Inventory },
    { url: "profile", component: Profile },
    { url: "orders", component: Order },
    { url: "orders/orders-details", component: OrderDetails },
    { url: "baskets", component: Basket },
    { url: "branches/tables", component: Tables },
    { url: "attributes", component: Attributes },
    { url: "areas", component: Area },
  ];

  return (
    <Router>
      <div id="main-wrapper" className="show">
        {localStorage.getItem("auth_token") ? (
          <Nav />
        ) : (
          <Redirect to="/page-login" />
        )}
        <div className="content-body">
          <div className="container-fluid">
            <Switch>
              {routes.map((data, i) => (
                <PrivateRoute
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                />
              ))}
              <PrivateRoute path={`/branches/show`} component={BranchShow} />

              <Route component={Error404} />
            </Switch>

            {/* <CreateRoute /> */}
          </div>
        </div>
        {localStorage.getItem("auth_token") ? <Footer /> : <Redirect to="/" />}
      </div>
    </Router>
  );
};

export default Markup;
