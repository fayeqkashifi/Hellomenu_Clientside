import React from "react";

/// React router dom
import { BrowserRouter as Router, Switch} from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
// import PublicRoute from './components/PublicRoute';

/// Css
import "./index.css";
import "./chart.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Deshboard

import Home from "./components/Dashboard/Home/Home";
import Branches from "./components/Branches/branches";
import Menu from "./components/Categories/category";
import Company from "./components/Companies/company";
import Product from "./components/Products/product";
import SubMenu from "./components/Categories/subCategory";
import ServiceArea from "./components/Services/serviceArea"
import Unit from "./components/Units/unit";
import Inventory from "./components/Inventories/inventory";
import Profile from "./components/Dashboard/Profile/Profile";
import Order from "./components/Orders/order";
import Variants from "./components/Variants/variants";
import Gallery from "./components/Variants/gallary";

const Markup = () => {
   const routes = [
		/// Login
		{ url: "dashboard", component: Home },
		{ url: "branches", component: Branches },
		{ url: "category/:id", component: Menu },
		{ url: "companies", component: Company },
		{ url: "products", component: Product },
		{ url: "sub-category/:id", component: SubMenu },
		{ url: "service-area/:id", component: ServiceArea },
		{ url: "unit/:id", component: Unit },
		{ url: "inventory/:id", component: Inventory },
		{ url: "profile", component: Profile },
		{ url: "orders", component: Order },
		{ url: "variants/:id", component: Variants },
		{ url: "gallery/:id", component: Gallery },
   ];

   return (
		
			<Router>
				<div id="main-wrapper" className="show">
					<Nav />
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
							</Switch>
						</div>
					</div>
					<Footer />
				</div>
				
			</Router>
				
    );
};

export default Markup;
