import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import Product from "../Products/Product";
import PrivateRoute from "../PrivateRoute";
import Variants from "../Variants/Variants";
// import { useTranslation } from "react-i18next";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

const ProductShow = (props) => {
  const { path } = useRouteMatch();
  return (
    <Fragment>
      <Router>
        <Switch>
          <PrivateRoute exact path={`${path}`} component={Product} />
          <PrivateRoute path={`${path}/variants`} component={Variants} />
          <PrivateRoute path={`${path}/add-product`} component={AddProduct} />
          <PrivateRoute path={`${path}/edit-product`} component={EditProduct} />
        </Switch>
      </Router>
    </Fragment>
  );
};

export default ProductShow;
