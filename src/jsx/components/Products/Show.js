import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import Product from "../Products/Product";
import PrivateRoute from "../PrivateRoute";
import Variants from "../Variants/Variants";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { checkPermission } from "../Permissions";

const ProductShow = () => {
  const { path } = useRouteMatch();
  return (
    <Fragment>
      <Router>
        <Switch>
          {checkPermission("products-view") && (
            <PrivateRoute exact path={`${path}`} component={Product} />
          )}
          {checkPermission("variants-view") && (
            <PrivateRoute path={`${path}/variants`} component={Variants} />
          )}
          {checkPermission("products-create") && (
            <PrivateRoute path={`${path}/add-product`} component={AddProduct} />
          )}
          {checkPermission("products-edit") && (
            <PrivateRoute
              path={`${path}/edit-product`}
              component={EditProduct}
            />
          )}
        </Switch>
      </Router>
    </Fragment>
  );
};

export default ProductShow;
