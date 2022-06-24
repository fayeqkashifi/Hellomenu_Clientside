import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PublicRoute from "../../../../PublicRoute";
import Show from "./Show";
import VideoDetails from "./VideoDetails";
import MainDetails from "../../MainDetails";

function VideosShow() {
  const { path } = useRouteMatch();

  return (
    <Router>
      <Switch>
        <PublicRoute exact path={`${path}`} component={Show} />
        <PublicRoute path={`${path}/video-details`} component={VideoDetails} />
        <PublicRoute path={`${path}/details/:id`} component={MainDetails} />
      </Switch>
    </Router>
  );
}

export default VideosShow;
