import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Registration from "./jsx/pages/Registration";
/// Components
import Markup from "./jsx";
import Login from "./jsx/pages/Login";
/// Style
import "./css/style.css";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
// import PrivateRoute from './jsx/components/PrivateRoute';
import PublicRoute from "./jsx/components/PublicRoute";
import axios from "axios";
import StandardTemplate from "./jsx/components/Public Link/BranchDetails";
// import Variants from "./jsx/components/Variants/Variants";
import VariantDetails from "./jsx/components/Public Link/VariantDetails";
import ShowProducts from "./jsx/components/Public Link/ShowProducts";
import { base_url, port } from "./Consts";
import Main from "./jsx/components/Design/Templates/First/Main";
import DarkTemplate from "./jsx/components/Design/Templates/Dark/Main";
import Thrid from "./jsx/components/Design/Templates/Thrid/Main";
import ProductDetails from "./jsx/components/Design/Templates/Dark/ProductDetails";
import OrderDetails from "./jsx/components/Design/Templates/Dark/OrderDetails";
import SecondTemplate from "./jsx/components/Design/Templates/Second/Main";
import CreateRoute from "./jsx/components/Branches/CreateRoute]";

axios.defaults.baseURL = "http://" + base_url + ":" + port;
// axios.defaults.baseURL="http://192.168.1.103/yesilik1/public/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.headers.get["Accept"] = "application/json";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.post["Access-control-Allow-Origin"] = "*";
axios.defaults.withcredentials = true;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("auth_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
//rember if there no user redriect them to login page

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_name");
      localStorage.removeItem("auth_id");
      window.location = "/";

      return error.response;
    }
  }
);

const App = () => {
  return (
    <Router>
      <Switch>
      <Route exact path="/">
          <Redirect to="/page-login" />
        </Route>
        <PublicRoute
          restricted={true}
          component={Login}
          path="/page-login"
          exact
        />

        <PublicRoute
          restricted={false}
          component={Registration}
          path="/user-register"
          exact
        />
        <PublicRoute
          exact
          component={StandardTemplate}
          path="/standard-template/:id"
        />
        <PublicRoute component={DarkTemplate} path="/dark-template/:id" exact />
        <PublicRoute component={SecondTemplate} path="/second-template/:id" exact />

        <PublicRoute
          exact
          component={VariantDetails}
          path="/variant-details/:id"
        />
        <PublicRoute
          exact
          component={OrderDetails}
          path="/order-details/:id"
        />
        <PublicRoute exact component={ShowProducts} path="/product/:id" />
        <PublicRoute exact component={ProductDetails} path="/product-details/:id" />
        <PublicRoute component={Main} path="/template-first" exact />
        <PublicRoute component={Thrid} path="/template-thrid" exact />
        <Markup />
        {/* <CreateRoute /> */}

      </Switch>
    </Router>
  );
};

export default App;
