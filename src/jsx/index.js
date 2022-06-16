import React from "react";
/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
/// Css
import "./index.css";
/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Deshboard
import Home from "./components/Dashboard/Home/Home";
import Branches from "./components/Branches/Branches";
import BranchShow from "./components/Branches/Show";

import Company from "./components/Companies/Company";
import Profile from "./components/Dashboard/Profile/Profile";
import Order from "./components/Orders/Order";
import Attributes from "./components/Attributes/Attributes";
// import Error404 from "./pages/Error404";
import Ingredients from "./components/Products/Ingredients/Ingredients";
import Area from "./components/Areas/Area";
import OrderDetails from "./components/Orders/OrderDetails";
import AddBranch from "./components/Branches/AddBranch";
import EditBranch from "./components/Branches/EditBranch";
import SettingsShow from "./components/Settings/Show";
import Storybranch from "./components/Branches/Stories/StoryBranch";
import EditStories from "./components/Branches/Stories/EditStories";
import { checkPermission } from "./components/Permissions";

const Markup = () => {
  const routes = [
    /// Login
    // checkPermission("dashboard-view")
    // ?
    { url: "dashboard", component: Home },
    // : { url: "", component: "" },

    checkPermission("branches-view")
      ? { url: "branches", component: Branches }
      : { url: "", component: "" },
    checkPermission("branches-create")
      ? { url: "branches/add-branch", component: AddBranch }
      : { url: "", component: "" },
    checkPermission("branches-edit")
      ? { url: "branches/edit-branch", component: EditBranch }
      : { url: "", component: "" },
    checkPermission("branches-view")
      ? { url: "branches/story-branch", component: Storybranch }
      : { url: "", component: "" },
    checkPermission("branches-view")
      ? { url: "branches/edit-stories", component: EditStories }
      : { url: "", component: "" },
    checkPermission("ingredients-view")
      ? { url: "ingredients", component: Ingredients }
      : { url: "", component: "" },
    checkPermission("company-view")
      ? { url: "company", component: Company }
      : { url: "", component: "" },
    checkPermission("orders-view")
      ? { url: "orders", component: Order }
      : { url: "", component: "" },
    checkPermission("orders-view")
      ? { url: "orders/orders-details", component: OrderDetails }
      : { url: "", component: "" },
    checkPermission("attributes-view")
      ? { url: "attributes", component: Attributes }
      : { url: "", component: "" },
    checkPermission("areas-view")
      ? { url: "areas", component: Area }
      : { url: "", component: "" },
    { url: "profile", component: Profile },
  ];

  return (
    <Router>
      <div id="main-wrapper" className="show">
        {localStorage.getItem("auth_token") ? <Nav /> : <Redirect to="/" />}

        <div className="content-body" style={{ marginBottom: "50px" }}>
          <div className="container-fluid">
            <Switch>
              {routes.map((data, i) => (
                <PrivateRoute
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                />
              ))}
              {checkPermission("branches-view") && (
                <PrivateRoute path={`/branches/show`} component={BranchShow} />
              )}
              {checkPermission("settings-view") && (
                <PrivateRoute path={`/settings`} component={SettingsShow} />
              )}
              {/* <Route component={Error404} /> */}
            </Switch>
          </div>
        </div>
        {localStorage.getItem("auth_token") ? <Footer /> : <Redirect to="/" />}
      </div>
    </Router>
  );
};

export default Markup;
