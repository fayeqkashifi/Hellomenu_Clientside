import React from "react";
import Category from "../Categories/Category";
import Design from "../Design/Design";
import Inventory from "../Inventories/Inventory";
import PrivateRoute from "../PrivateRoute";
import ServiceArea from "../Services/ServiceArea";
import Unit from "../Units/Unit";
import Tables from "./Tables";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import Customization from "../Design/Templates/Dark/Customization";
import SubCategory from "../Categories/SubCategory";
import Product from "../Products/Product";

const CreateRoute = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <PrivateRoute path="/" component={Category} />
      <PrivateRoute path={`${path}/category`} component={Category} />
      <PrivateRoute path={`${path}/sub-category`} component={SubCategory} />
      <PrivateRoute
        path="/branches/category/sub-category/products"
        component={Product}
      />
      <PrivateRoute
        path="/branches/category/sub-category/products/variants"
        component={Product}
      />
      <PrivateRoute path="/branches/service-area" component={ServiceArea} />
      <PrivateRoute path="/branches/unit" component={Unit} />
      <PrivateRoute path="/branches/inventory" component={Inventory} />
      <PrivateRoute path={`${path}/design`} component={Design} />
      <PrivateRoute path="/branches/tables" component={Tables} />
      <PrivateRoute
        path="/branches/design/dark-template-customization"
        component={Customization}
      />
    </Switch>
  );
};

export default CreateRoute;
