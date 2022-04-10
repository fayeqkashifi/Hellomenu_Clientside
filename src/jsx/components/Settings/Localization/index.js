import React from "react";

import LanguageList from "./LanguageList";
import EditLocale from "./EditLocale";
import PrivateRoute from "../../PrivateRoute";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { checkPermission } from "../../Permissions";

const Locale = () => {
  const { path } = useRouteMatch();

  return (
    <Router>
      {/* <div className="alert alert-info">
        You must log out of the system after making changes to your
        Localisation.
      </div> */}
      <Switch>
        {checkPermission("localization-view") && (
          <PrivateRoute exact path={`${path}`} component={LanguageList} />
        )}
        {checkPermission("localization-edit") && (
          <PrivateRoute path={`${path}/edit-locale`} component={EditLocale} />
        )}
      </Switch>
    </Router>
  );
};

export default Locale;
