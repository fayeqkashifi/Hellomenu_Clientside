import React from "react";
import { Link } from "react-router-dom";
import { localization as t } from "../components/Localization";

const PageTitle = ({ headingPara, motherMenu, activeMenu }) => {
  // for localization
  return (
    <div className="row page-titles mx-0">
      <div className="col-sm-6 p-md-0">
        <div className="welcome-text">
          <h4>{t("welcome_msg")}</h4>
          <p className="mb-0">{headingPara}</p>
        </div>
      </div>
      <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={"#"}>{motherMenu}</Link>
          </li>
          <li className="breadcrumb-item active">
            <Link to={"#"}>{activeMenu}</Link>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PageTitle;
