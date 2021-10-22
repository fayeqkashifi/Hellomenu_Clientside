import React, { Fragment } from "react";



const Menu = () => {
	
   return (
      <Fragment>
         <div className="row">
			<div className="col-xl-3 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body ">
							<h4 className="text-danger">Edit Your Menu</h4>
						</div>
					</div>
					<div className="card-body">
						<p>Create new menus, add or edit your items and sections in your menus</p>
						<button type="button" className="btn btn-outline-success">Menus</button>
					</div>
				</div>
			</div>
			<div className="col-xl-3 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body">
							<h4 className="text-primary">Change Your Theme</h4>
						</div>
					</div>
					<div className="card-body">
						<p>Design your menu to reflect your business and your brand</p>
						<button type="button" className="btn btn-outline-primary">Design</button>
					</div>
				</div>
			</div><div className="col-xl-3 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body">
							<h4 className="text-info">Menu Settings</h4>
						</div>
						
					</div>
					<div className="card-body ">
						<p>Set up all the details of your menu to fit it in your business</p>
						<button type="button" className="btn btn-outline-warning">settings</button>
					</div>
				</div>
			</div><div className="col-xl-3 col-lg-6 col-sm-6">
				<div className="card overflow-hidden">
					<div className="card-header media border-0 pb-0">
						<div className="media-body">
							<h4 className="text-success">Integrations</h4>
						</div>
					</div>
					<div className="card-body ">
						<p>Set up all the details of your menu to fit it in your business</p>
						<button type="button" className="btn btn-outline-success">Integrations</button>
					</div>
				</div>
			</div>

        </div>    
            
         
      </Fragment>
   );
};

export default Menu;
