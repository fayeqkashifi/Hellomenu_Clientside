import React from "react";

import AddRole from "./AddRole";
import { Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../../PrivateRoute";
import EditRole from "./EditRole";
import { checkPermission } from "../../Permissions";

const Role = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <div className="alert alert-info">
        You must log out of the system after making changes to your role.
      </div>
      <Switch>
        {checkPermission("roles-view") && (
          <PrivateRoute exact path={`${path}`} component={AddRole} />
        )}
        {checkPermission("roles-edit") && (
          <PrivateRoute path={`${path}/edit-role`} component={EditRole} />
        )}
      </Switch>
      {/* */}
    </>
  );
};

export default Role;
