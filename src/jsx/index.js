import React from "react";

/// React router dom
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Deshboard
import Home from "./components/Dashboard/Home/Home";

import Branches from "./components/Branches/branches";
import Menu from "./components/Menus/menu";
import Company from "./components/Companies/company";
import Product from "./components/Products/product";

const Markup = () => {
   const routes = [
		/// Login
		{ url: "dashboard", component: Home },
		{ url: "branches", component: Branches },
		{ url: "menu", component: Menu },
		{ url: "companies", component: Company },
		{ url: "products", component: Product },
   ];

   return (
		
			<Router basename="/">
				<div id="main-wrapper" className="show">
					<Nav />
					<div className="content-body">
						<div className="container-fluid">
							<Switch>
								{routes.map((data, i) => (
									localStorage.getItem('auth_token')?
									<Route
										key={i}
										exact
										path={`/${data.url}`}
										component={data.component}
									/>: <Redirect to="/page-login" />
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
