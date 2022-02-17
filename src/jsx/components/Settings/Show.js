import React, { Fragment, useState } from "react";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

const Show = (props) => {
  const { t } = useTranslation();
 
  return (
    <Fragment>
      <Router>
        <div className="row">
          <div className="card">
            <div className="card-header">
            { t('settings_ t') }
            </div>
            <div className="card-body">
            
            </div>
          </div>
        </div>
     
        {/* <Switch>
          <PrivateRoute exact path={`${path}`} component={Category} />
          <PrivateRoute path={`${path}/sub-category`} component={SubCategory} />

        </Switch> */}
      </Router>
    </Fragment>
  );
};

export default Show;
