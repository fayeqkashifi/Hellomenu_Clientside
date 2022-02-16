import React, { Fragment } from "react";

import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Header from "../Header";
import OnBoarding from "./OnBoarding";
import Venue from "./Venue";
import Solutions from "./Solutions";
import Menu from "./Menu";
import Error404 from "../Error404";

const Show = (props) => {
  const route = props.match.params.id;
  return (
    <Fragment>
      <Header />
      {route === "user" ? (
        <OnBoarding />
      ) : route === "venue" ? (
        <Venue />
      ) : route === "solutions" ? (
        <Solutions />
      ) : route === "menu" ? (
        <Menu />
      ) : (
        <Error404 />
      )}
    </Fragment>
  );
};

export default Show;
