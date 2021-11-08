import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Registration from "./jsx/pages/Registration";
/// Components
import Markup from "./jsx";
import Login from "./jsx/pages/Login";
/// Style
import "./css/style.css";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
// import PrivateRoute from './jsx/components/PrivateRoute';
import PublicRoute from './jsx/components/PublicRoute';
import axios from "axios"
import ShowBranchDetails from "./jsx/components/Branches/ShowBranchDetails";
// import Variants from "./jsx/components/Variants/Variants";
import VariantDetails from "./jsx/components/Variants/VariantDetails";


axios.defaults.baseURL="http://127.0.0.1:8000";
axios.defaults.headers.post['Content-Type']='application/json'
axios.defaults.headers.post['Accept']='application/json'
axios.defaults.withcredentials= true;
axios.interceptors.request.use(function(config){
   const token=localStorage.getItem('auth_token');
   config.headers.Authorization = token ? `Bearer ${token}` : '';
   return config;
});
const App = () => {
   return (
      <Router>
         <Switch>
            <Route exact path="/">
               <Redirect to="/page-login" />
            </Route>
            <PublicRoute restricted={true} component={Login} path="/page-login" exact />
            <PublicRoute restricted={false} component={Registration} path="/user-register" exact />
            <PublicRoute exact component={ShowBranchDetails} path="/show-branch-details/:id" />
            <PublicRoute exact component={VariantDetails} path="/variant-details/:id" />
            {/* {localStorage.getItem('auth_token') ? <Markup /> : <Redirect to="/page-login" />} */}
            <Markup />
         </Switch>
       </Router>
   );
};

export default App;
