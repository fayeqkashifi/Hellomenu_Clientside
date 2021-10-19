import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {Dropdown} from 'react-bootstrap';


const Home = () => {
	
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
						<button type="button" class="btn btn-outline-success">Menus</button>
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
						<button type="button" class="btn btn-outline-primary">Design</button>
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
						<button type="button" class="btn btn-outline-warning">settings</button>
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
						<button type="button" class="btn btn-outline-success">Integrations</button>
					</div>
				</div>
			</div>

			
			<div className="col-xl-9 col-xxl-8 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">Recent Order Request</h4>
						</div>
						<div className="dropdown">
							<button type="button" className="btn border btn-rounded text-black dropdown-toggle" data-toggle="dropdown">
								Newest
							</button>
							<div className="dropdown-menu">
								<Link to={"#"} className="dropdown-item" >2020</Link>
								<Link to={"#"} className="dropdown-item" >2019</Link>
								<Link to={"#"} className="dropdown-item" >2018</Link>
							</div>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table order-request ">
								<tbody>
								
								
								<tr>
									<td>
										<div className="media align-items-center">
											<Link to={"/ecom-product-detail"}>	
												<img className="mr-3 img-fluid rounded-circle" width="75" src={require("./../../../../images/card/pic7.jpg").default} alt="DexignZone" />
											</Link>	
											<div className="media-body">
												<h5 className="mt-0 mb-2"><Link to={"/ecom-product-detail"}  className="text-black">Mozarella Pizza With Random Topping</Link></h5>
												<p className="mb-0 text-primary">#0010299</p>
											</div>
										</div>
									</td>
									<td>
										<h5 className="mb-2 text-black wspace-no">Cindy Alexa</h5>
										<p className="mb-0">Blue Ocean St.41551 London</p>
									</td>
									<td>
										<div className="d-flex align-items-center justify-content-center">
											<h4 className="mb-0 mr-3 fs-20 text-black d-inline-block">$8.2</h4>
											<p className="mb-0 fs-20 d-inline-block">x1</p>
										</div>
									</td>
									<td>
										<div className="d-flex align-items-center">
											<Link to={"#"} className="btn bgl-light" >CANCELED</Link>
											<Dropdown>
												<Dropdown.Toggle   variant	className="table-dropdown icon-false " >
													<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="12" cy="5" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="19" r="2"></circle></g></svg>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item  > 
														<Link to ={"#"} className="text-black" >
															<svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#209F84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
																<path d="M22 4L12 14.01L9 11.01" stroke="#209F84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
															</svg>
															Accept order
														</Link>
													</Dropdown.Item>
													<Dropdown.Item > 
														<Link to ={"#"} className="text-black" >
															<svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F24242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
																<path d="M15 9L9 15" stroke="#F24242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
																<path d="M9 9L15 15" stroke="#F24242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
															</svg>
															Reject order
														</Link>
													</Dropdown.Item>	
													<Dropdown.Item > 	
														<Link to ={"#"} className="text-black" >
															<svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6F6F6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
																<path d="M12 16V12" stroke="#6F6F6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
																<path d="M12 8H12.01" stroke="#6F6F6F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
															</svg>
															View Details
														</Link>
													</Dropdown.Item>
													
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</td>
								</tr>												
							</tbody></table>
							<div className="card-footer border-0 pt-0 text-center">
								<Link to={"/ecom-product-list"}  className="btn-link">View More &gt;&gt;</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xl-3 col-xxl-4 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">Feedback</h4>
							<p className="mb-0 fs-14">Lorem ipsum dolor</p>
						</div>
					</div>
					<div className="card-body px-0 pt-0 pb-2">
						<div className="widget-media trending-menus">
							<ul className="timeline">
								<li>
									<div className="timeline-panel">
										<div className="media mr-3">
											<Link to={"/ecom-product-detail"}>	
												<img alt="" width="90" src={require("./../../../../images/card/pic8.jpg").default} />
											</Link>	
											<div className="number">#1</div>
										</div>
										<div className="media-body">
											<h5 className="mb-3"><Link to={"/ecom-product-detail"}  className="text-black">Chicken curry special with cucumber</Link></h5>
											<div className="d-flex justify-content-between align-items-center">
												<h4 className="mb-0 text-black font-w600">$5.6</h4>
												<p className="mb-0">Order <strong className="text-black font-w500">89x</strong></p>
											</div>
										</div>
									</div>
								</li>
								
							</ul>
						</div>
					</div>
				</div>
			</div>
            
        </div>    
            
         
      </Fragment>
   );
};

export default Home;
