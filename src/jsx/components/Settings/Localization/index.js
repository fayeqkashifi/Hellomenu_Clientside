import React from "react";

import LanguageList from "./LanguageList";
import EditLocale from "./EditLocale";
import PrivateRoute from "../../PrivateRoute";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
const Locale = () => {
  const { path, url } = useRouteMatch();

  return (
    <Router>
      <div className="alert alert-info">
        You must log out of the system after making changes to your
        Localisation.
      </div>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={LanguageList} />
        <PrivateRoute path={`${path}/edit-locale`} component={EditLocale} />
      </Switch>
    </Router>
  );
};

export default Locale;
