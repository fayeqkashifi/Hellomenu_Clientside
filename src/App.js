import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Registration from "./jsx/pages/Registration";
/// Components
import Markup from "./jsx";
import Login from "./jsx/pages/Login";

/// Style
import "./css/style.css";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
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
            <Route exact path='/page-login' component={Login} />
            <Route path="/user-register"  component={Registration} /> 
            <Route path="/dashboard"  component={Markup} /> 
            <Route path='/'>
              <Redirect to="/page-login" />
            </Route>
            {/* <Route path="/user-register">
               {localStorage.getItem('auth_token') ? <Redirect to="/user-register" /> : <Registration /> }
            </Route> */}
         </Switch>
       </Router>
   );
};

export default App;
