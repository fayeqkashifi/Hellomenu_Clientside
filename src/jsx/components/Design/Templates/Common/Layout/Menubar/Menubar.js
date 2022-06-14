import React, { useContext } from "react";
import { TemplateContext } from "../../../TemplateContext";

import PublicRoute from "../../../../../PublicRoute";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import TrackOrder from "../../Orders/TrackOrder";
const Menubar = () => {
  const { style } = useContext(TemplateContext);
  const { path, url } = useRouteMatch();

  return (
    <>
        
    </>
  );
};

export default Menubar;
