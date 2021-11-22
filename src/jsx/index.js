import React from "react";

/// React router dom
import { BrowserRouter as Router, Switch, Redirect} from "react-router-dom";
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
import Branches from "./components/Branches/Branches";
import Menu from "./components/Categories/Category";
import Company from "./components/Companies/Company";
import Product from "./components/Products/Product";
import SubMenu from "./components/Categories/SubCategory";
import ServiceArea from "./components/Services/ServiceArea"
import Unit from "./components/Units/Unit";
import Inventory from "./components/Inventories/Inventory";
import Profile from "./components/Dashboard/Profile/Profile";
import Order from "./components/Orders/Order";
import Variants from "./components/Variants/Variants";
import Gallery from "./components/Variants/Gallary";
import Basket from "./components/Orders/Basket";
// import VariantDetails from "./components/Variants/VariantDetails";
import ShowBranchDetails from "./components/Branches/ShowBranchDetails";
import ShowVariantDetails from "./components/Variants/VariantDetails";
import Tables from "./components/Branches/Tables";
import Attributes from "./components/Attributes/Attributes";
import AddProduct from "./components/Products/AddProduct";
import Options from "./components/Attributes/Options";

const Markup = () => {
   const routes = [
		/// Login
		{ url: "dashboard", component: Home },
		{ url: "branches", component: Branches },
		{ url: "category/:id", component: Menu },
		{ url: "companies", component: Company },
		{ url: "products/:id", component: Product },
		{ url: "sub-category/:id", component: SubMenu },
		{ url: "service-area/:id", component: ServiceArea },
		{ url: "unit/:id", component: Unit },
		{ url: "inventory/:id", component: Inventory },
		{ url: "profile", component: Profile },
		{ url: "orders", component: Order },
		{ url: "baskets", component: Basket },
		{ url: "variants/:id", component: Variants },
		{ url: "gallery/:id", component: Gallery },
		// { url: "variant-details/:id", component: VariantDetails },
		{ url: "show-branch-details/:id", component: ShowBranchDetails },
		{ url: "show_variant_detials/:id", component: ShowVariantDetails },
		{ url: "tables/:id", component: Tables },
		{ url: "attributes", component: Attributes },
		{ url: "add-product/:id", component: AddProduct },
		{ url: "add-option/:id", component: Options },


   ];

   return (
		
			<Router>
				
				<div id="main-wrapper" className="show">
				{localStorage.getItem('auth_token') ? <Nav /> : <Redirect to="/page-login" />}
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
				{localStorage.getItem('auth_token') ? <Footer /> : <Redirect to="/page-login" />}

				</div>
				
			</Router>
				
    );
};

export default Markup;
