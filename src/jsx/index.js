import React from "react";
/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
// import PublicRoute from './components/PublicRoute';
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

// import Category from "./components/Categories/Category";
import Company from "./components/Companies/Company";
// import Product from "./components/Products/Product";
// import SubMenu from "./components/Categories/SubCategory";
import ServiceArea from "./components/Services/ServiceArea";
import Unit from "./components/Units/Unit";
import Inventory from "./components/Inventories/Inventory";
import Profile from "./components/Dashboard/Profile/Profile";
import Order from "./components/Orders/Order";
import Gallery from "./components/Variants/Gallary";
import Basket from "./components/Orders/Basket";
// import VariantDetails from "./components/Variants/VariantDetails";
// import ShowBranchDetails from "./components/Public Link/ShowBranchDetails";
import VariantDetails from "./components/Variants/VariantDetails";
import Tables from "./components/Branches/Tables";
import Attributes from "./components/Attributes/Attributes";
// import AddProduct from "./components/Products/AddProduct";
import Options from "./components/Attributes/Options";
// import Design from "./components/Design/Design";
import Theme from "./components/Design/Theme";
import EditTheme from "./components/Design/EditTheme";
// import Customization from "./components/Design/Templates/Dark/Customization";
// import CreateRoute from "./components/Branches/CreateRoute]";
import Error404 from "./pages/Error404";
import Ingredients from "./components/Products/Ingredients";
import Extra from "./components/Products/Extra";

const Markup = () => {
  const routes = [
    /// Login
    { url: "dashboard", component: Home },
    { url: "branches", component: Branches },
    { url: "ingredients", component: Ingredients },
    { url: "extras", component: Extra },
    { url: "companies", component: Company },
    { url: "branches/service-area", component: ServiceArea },
    { url: "branches/unit", component: Unit },
    { url: "branches/inventory", component: Inventory },
    { url: "profile", component: Profile },
    { url: "orders", component: Order },
    { url: "baskets", component: Basket },
    { url: "gallery/:id", component: Gallery },
    { url: "show_variant_detials/:id", component: VariantDetails },
    { url: "branches/tables", component: Tables },
    { url: "attributes", component: Attributes },
    { url: "add-option/:id", component: Options },
    // { url: "branches/design/edit-theme/:id", component: EditTheme },
    // { url: "branches/design/add-theme/:id", component: Theme },
  ];

  return (
    <Router>
      <div id="main-wrapper" className="show">
        {localStorage.getItem("auth_token") ? (
          <Nav />
        ) : (
          <Redirect to="/page-login" />
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

              <Route component={Error404} />
            </Switch>

            {/* <CreateRoute /> */}
          </div>
        </div>
        {localStorage.getItem("auth_token") ? <Footer /> : <Redirect to="/" />}
      </div>
    </Router>
  );
};

export default Markup;
