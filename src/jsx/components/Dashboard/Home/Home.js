import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Home = () => {
	const { t } = useTranslation();
   return (
      <Fragment>
         <div className="row">
			<div className="col-xl-4 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body ">
							<h4 className="text-success">{t('branches')}</h4>
						</div>
					</div>
					<div className="card-body">
						<p>Create new branches, add or edit your categories, subCategories and inventory.</p>
						<Link to="branches" className="btn btn-outline-success">{t('branches')}</Link>
					</div>
				</div>
			</div>
			<div className="col-xl-4 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body">
							<h4 className="text-primary">{t('orders')}</h4>
						</div>
					</div>
					<div className="card-body">
						<p>Design your menu to reflect your business and your brand</p>
						<Link to="orders" className="btn btn-outline-primary">{t('orders')}</Link>

					</div>
				</div>
			</div><div className="col-xl-4 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body">
							<h4 className="text-info">{t('products')}</h4>
						</div>
						
					</div>
					<div className="card-body ">
						<p>Add and delete products as well as variants</p>
						<Link to="products" className="btn btn-outline-info">{t('products')}</Link>
					</div>
				</div>
			</div>
        </div>    
            
         
      </Fragment>
   );
};

export default Home;
