import React, { Fragment } from "react";

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
