import React from "react";

import "react-phone-input-2/lib/style.css";
import EditNewUser from "./EditNewUser";
import { Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../../PrivateRoute";
import CreateUser from "./CreateUser";
const UsersShow = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <div className="alert alert-info">
        You must log out of the system after making changes to your role.
      </div>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={CreateUser} />
        <PrivateRoute path={`${path}/edit-user`} component={EditNewUser} />
      </Switch>
      {/* */}
    </>
  );
};

export default UsersShow;
