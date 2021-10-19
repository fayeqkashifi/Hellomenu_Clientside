import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Registration from "./jsx/pages/Registration";
import ForgotPassword from "./jsx/pages/ForgotPassword";
/// Components
import Markup from "./jsx";
import Login from "./jsx/pages/Login";

/// Style
import "./css/style.css";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";


const App = () => {
   
   return (
      
      // <Router>
      //       <Switch>
      //          <Route exact path='/' component={Login} />
      //          {/* <Route  path='/dashboard' component={Markup} /> */}
      //          <Route       path="/forgot-password" component={ForgotPassword} />
      //          <Route       path="/user-register"  component={Registration} />
      //       </Switch>
       <Fragment> 
          <Markup />
      </Fragment>  
      // </Router>

   );
};

export default App;
