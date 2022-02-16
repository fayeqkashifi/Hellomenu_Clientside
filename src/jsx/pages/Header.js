import React from "react";
import logo from "../../images/hellomenu/logo.svg";
import { Link } from "react-router-dom";
const Header = (props) => {
  const { route, linkName } = props;
  return (
    <div className="row m-3">
      <div className="d-flex justify-content-between">
        <label className="">
          <strong>
            <img src={logo} width="100" alt="Logo" />
          </strong>
        </label>
        {route && <Link to={route}>{linkName}</Link>}
      </div>
    </div>
  );
};

export default Header;
