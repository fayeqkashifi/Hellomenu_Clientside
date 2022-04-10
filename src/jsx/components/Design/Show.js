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
import { checkPermission } from "../Permissions";

const DesignShow = (props) => {
  const { path } = useRouteMatch();

  return (
    <Fragment>
      {checkPermission("desgin-view") && (
        <Router>
          <Switch>
            <PrivateRoute exact path={`${path}`} component={Design} />
            <PrivateRoute
              path={`${path}/customization`}
              component={Customization}
            />
            <PrivateRoute path={`${path}/add-theme`} component={Theme} />
            <PrivateRoute path={`${path}/edit-theme`} component={EditTheme} />
          </Switch>
        </Router>
      )}
    </Fragment>
  );
};

export default DesignShow;
