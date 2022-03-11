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
import "./chart.css";
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
import Error404 from "./pages/Error404";
import Ingredients from "./components/Products/Ingredients";
import Area from "./components/Areas/Area";
import OrderDetails from "./components/Orders/OrderDetails";
import AddBranch from "./components/Branches/AddBranch";
import EditBranch from "./components/Branches/EditBranch";
import SettingsShow from "./components/Settings/Show";
import Storybranch from "./components/Branches/Stories/StoryBranch";
import ShowStories from "./components/Branches/Stories/ShowStories";

const Markup = () => {
  const routes = [
    /// Login
    { url: "dashboard", component: Home },
    { url: "branches", component: Branches },
    { url: "branches/add-branch", component: AddBranch },
    { url: "branches/edit-branch", component: EditBranch },
    { url: "branches/story-branch", component: Storybranch },
    { url: "branches/show-stories", component: ShowStories },
    { url: "ingredients", component: Ingredients },
    { url: "company", component: Company },
    { url: "profile", component: Profile },
    { url: "orders", component: Order },
    { url: "orders/orders-details", component: OrderDetails },
    { url: "attributes", component: Attributes },
    { url: "areas", component: Area },
  ];

  return (
    <Router>
      <div id="main-wrapper" className="show">
        {localStorage.getItem("auth_token") ? (
          <Nav />
        ) : (
          <Redirect to="/login" />
        )}
        <div className="content-body">
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
              <PrivateRoute path={`/branches/show`} component={BranchShow} />
              <PrivateRoute path={`/settings`} component={SettingsShow} />

              <Route component={Error404} />
            </Switch>
          </div>
        </div>
        {localStorage.getItem("auth_token") ? <Footer /> : <Redirect to="/" />}
      </div>
    </Router>
  );
};

export default Markup;
