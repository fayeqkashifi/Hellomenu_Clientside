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
      <div className="alert alert-info">
        You must log out of the system after making changes to your role.
      </div>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={AddRole} />
        <PrivateRoute path={`${path}/edit-role`} component={EditRole} />
      </Switch>
      {/* */}
    </>
  );
};

export default Role;
