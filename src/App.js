import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
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
            <PublicRoute restricted={true} component={Login} path="/page-login" exact />
            <PublicRoute restricted={false} component={Registration} path="/user-register" exact />
            {/* {localStorage.getItem('auth_token') ? <Markup /> : <Redirect to="/page-login" />} */}
            <Markup />
         </Switch>
       </Router>
   );
};

export default App;
