import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../utils";
// import { checkPermission } from "./Permissions";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page

    <Route
      {...rest}
      render={(props) =>
        isLogin() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
      // onEnter={checkPermission("company-view")}
    />
  );
};

export default PrivateRoute;
