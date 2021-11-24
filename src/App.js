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
import BranchDetails from "./jsx/components/Public Link/BranchDetails";
// import Variants from "./jsx/components/Variants/Variants";
import VariantDetails from "./jsx/components/Public Link/VariantDetails";
import ShowProducts from "./jsx/components/Public Link/ShowProducts";

axios.defaults.baseURL = "http://192.168.1.40:8000";
// axios.defaults.baseURL="http://192.168.1.103/yesilik1/public/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.withcredentials = true;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("auth_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
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
          component={BranchDetails}
          path="/show-branch-details/:id"
        />
        <PublicRoute
          exact
          component={VariantDetails}
          path="/variant-details/:id"
        />
        <PublicRoute exact component={ShowProducts} path="/product/:id" />
        {/* {localStorage.getItem('auth_token') ? <Markup /> : <Redirect to="/page-login" />} */}
        <Markup />
      </Switch>
    </Router>
  );
};

export default App;
