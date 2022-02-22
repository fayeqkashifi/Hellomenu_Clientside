import React from "react";

import "react-phone-input-2/lib/style.css";
import AddRole from "./AddRole";
import { Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../../PrivateRoute";
import EditRole from "./EditRole";
const Role = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={AddRole} />
        <PrivateRoute path={`${path}/edit-role`} component={EditRole} />
      </Switch>
      {/* */}
    </>
  );
};

export default Role;
