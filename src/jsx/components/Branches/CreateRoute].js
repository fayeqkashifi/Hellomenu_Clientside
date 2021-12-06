import React from "react";
import Category from "../Categories/Category";
import Design from "../Design/Design";
import Inventory from "../Inventories/Inventory";
import PrivateRoute from "../PrivateRoute";
import ServiceArea from "../Services/ServiceArea";
import Unit from "../Units/Unit";
import Tables from "./Tables";
import { BrowserRouter as Router, Switch } from "react-router-dom"
import Customization from "../Design/Templates/Dark/Customization";

const CreateRoute = () => {
  return (
   
      <Switch>
        {/* <PrivateRoute exact path="/branches/show" component={Category} /> */}
        <PrivateRoute exact path="/branches/category" component={Category} />
        <PrivateRoute
          exact
          path="/branches/service-area"
          component={ServiceArea}
        />
        <PrivateRoute exact path="/branches/unit" component={Unit} />
        <PrivateRoute exact path="/branches/inventory" component={Inventory} />
        <PrivateRoute exact path="/branches/design" component={Design} />
        <PrivateRoute exact path="/branches/tables" component={Tables} />
        <PrivateRoute exact path="/branches/design/dark-template-customization" component={Customization} />
      </Switch>
  );
};

export default CreateRoute;
