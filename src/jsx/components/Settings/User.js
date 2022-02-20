import React, { useState } from "react";

import "react-phone-input-2/lib/style.css";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import Role from "./Role";

import { Link, Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
const User = (props) => {
  const { path, url } = useRouteMatch();
  const geturl = document.location.href.split("/");
  const [urlCheck, setUrlCheck] = useState(
    geturl[5] !== undefined ? geturl[5] : "settings"
  );
  const active = {
    cursor: "pointer",
    border: "1px solid",
    margin: "10px",
    borderRadius: "10px",
    borderColor: "#5373e3",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    backgroundColor: "#5373e3",
    color: "#fff",
  };
  const DeActive = {
    height: "50px",
    cursor: "pointer",
    border: "1px solid",
    borderRadius: "10px",
    margin: "10px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    color: "#5373e3",
  };

  return (
    <>
      <div className="row mb-4">
        <Link
          to={`${url}`}
          className="col d-flex justify-content-center align-items-center"
          style={urlCheck === "settings" ? active : DeActive}
          onClick={() => setUrlCheck("settings")}
        >
          Edit Profile
        </Link>
        <Link
          to={`${url}/create-user`}
          className="col d-flex justify-content-center align-items-center"
          style={urlCheck === "create-user" ? active : DeActive}
          onClick={() => setUrlCheck("create-user")}
        >
          Users
        </Link>
        <Link
          to={`${url}/role`}
          className="col d-flex justify-content-center align-items-center"
          style={urlCheck === "role" ? active : DeActive}
          onClick={() => setUrlCheck("role")}
        >
          Role
        </Link>
      </div>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={EditUser} />
        <PrivateRoute path={`${path}/create-user`} component={CreateUser} />
        <PrivateRoute path={`${path}/role`} component={Role} />
      </Switch>
    </>
  );
};

export default User;
