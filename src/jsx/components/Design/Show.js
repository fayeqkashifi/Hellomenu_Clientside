import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import Design from "./Design";
import PrivateRoute from "../PrivateRoute";
// import { useTranslation } from "react-i18next";
import Customization from "./Templates/Customization";
import Theme from "./Theme";
import EditTheme from "./EditTheme";
import DefaultCustomization from "./Templates/Default/Customization";

const DesignShow = (props) => {
  const { path } = useRouteMatch();
  // const { t } = useTranslation();
  // const id = props.history.location.state.id;

  return (
    <Fragment>
      <Router>
        <Switch>
          <PrivateRoute exact path={`${path}`} component={Design} />
          <PrivateRoute
            path={`${path}/dark-template-customization`}
            component={Customization}
          />
          <PrivateRoute
            path={`${path}/defualt-template-customization`}
            component={DefaultCustomization}
          />
          <PrivateRoute path={`${path}/add-theme`} component={Theme} />
          <PrivateRoute path={`${path}/edit-theme`} component={EditTheme} />
          {/* <PrivateRoute path={`${path}/edit-product`} component={EditProduct} /> */}
        </Switch>
      </Router>
    </Fragment>
  );
};

export default DesignShow;
