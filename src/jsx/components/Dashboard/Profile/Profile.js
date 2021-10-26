import React, { Fragment } from "react";
import { Link } from "react-router-dom";
//** Import Profile Img */
// import profileImg from "../../../../images/avatar/1.jpg";
const Profile = () => {
   return (
      <Fragment>
         <div className="row">
            <div className="col-xl-9 col-xxl-8 col-lg-8">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card profile-card">
                        <div className="card-header flex-wrap border-0 pb-0">
                           <h3 className="fs-24 text-black font-w600 mr-auto mb-2 pr-3">
                              Edit Profile
                           </h3>
                           <div className="d-flex mr-5 align-items-center mb-2">
                              <div className="custom-control custom-switch toggle-switch text-right">
                                 <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customSwitch1"
                                 />
                                 <label
                                    className="custom-control-label"
                                    htmlFor="customSwitch1"
                                 >
                                    Available for hire?
                                 </label>
                              </div>
                           </div>
                           <Link
                              to="#"
                              className="btn btn-dark light btn-rounded mr-3 mb-2"
                           >
                              Cancel
                           </Link>
                           <Link
                              className="btn btn-primary btn-rounded mb-2"
                              to="#"
                           >
                              Save Changes
                           </Link>
                        </div>
                        <div className="card-body">
                           <form>
                              <div className="mb-5">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       Generals
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>First Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             placeholder="Enter name"
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Middle Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             placeholder="Type here"
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Last Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             placeholder="Last name"
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Username</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             placeholder="User name"
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Password</label>
                                          <input
                                             type="password"
                                             className="form-control"
                                             placeholder="Enter password"
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Re-Type Password</label>
                                          <input
                                             type="password"
                                             className="form-control"
                                             placeholder="Enter password"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="mb-5">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       CONTACT
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>MobilePhone</label>
                                          <div className="input-group input-icon mb-3">
                                             <div className="input-group-prepend">
                                                <span
                                                   className="input-group-text"
                                                   id="basic-addon1"
                                                >
                                                   <i
                                                      className="fa fa-phone"
                                                      aria-hidden="true"
                                                   ></i>
                                                </span>
                                             </div>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone no."
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Whatsapp</label>
                                          <div className="input-group input-icon mb-3">
                                             <div className="input-group-prepend">
                                                <span
                                                   className="input-group-text"
                                                   id="basic-addon2"
                                                >
                                                   <i
                                                      className="fa fa-whatsapp"
                                                      aria-hidden="true"
                                                   ></i>
                                                </span>
                                             </div>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone no."
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Email</label>
                                          <div className="input-group input-icon mb-3">
                                             <div className="input-group-prepend">
                                                <span
                                                   className="input-group-text"
                                                   id="basic-addon3"
                                                >
                                                   <i className="las la-envelope"></i>
                                                </span>
                                             </div>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter email"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Address</label>
                                          <div className="input-group">
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter adress"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>City</label>
                                          <select className="form-control">
                                             <option>London</option>
                                             <option>United State</option>
                                             <option>United Kingdom</option>
                                             <option>Germany</option>
                                             <option>Netherland</option>
                                          </select>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Country</label>
                                          <select className="form-control">
                                             <option>England</option>
                                             <option>United State</option>
                                             <option>United Kingdom</option>
                                             <option>Germany</option>
                                             <option>Netherland</option>
                                          </select>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="mb-5">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       About me
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-12">
                                       <div className="form-group">
                                          <label>Tell About You</label>
                                          <textarea
                                             className="form-control"
                                             rows="6"
                                             defaultValue="Lorem ipsum dolor sit amet,
                                             consectetur adipiscing elit, sed do
                                             eiusmod tempor incididunt ut labore
                                             et dolore magna aliqua. Ut enim ad
                                             minim veniam, quis nostrud
                                             exercitation ullamco laboris nisi
                                             ut aliquip ex ea commodo consequat.
                                             Duis aute irure dolor in
                                             reprehenderit in voluptate velit
                                             esse cillum dolore eu fugiat nulla
                                             pariatur. Excepteur sint occaecat
                                             cupidatat non proident, sunt in
                                             culpa qui officia deserunt mollit
                                             anim id est laborum que laudantium,
                                             totam rem aperiam, eaque ipsa quae
                                             ab illo inventore veritatis et
                                             quasi architecto beatae vitae dicta
                                             su"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       Skils
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-6">
                                       <div className="media mb-4">
                                          <span className="text-primary progress-icon mr-3">
                                             78%
                                          </span>
                                          <div className="media-body">
                                             <p className="font-w500">
                                                Programming
                                             </p>
                                             <div
                                                className="progress skill-progress"
                                                style={{ height: "10px" }}
                                             >
                                                <div
                                                   className="progress-bar bg-primary progress-animated"
                                                   style={{
                                                      width: "78%",
                                                      height: "10px",
                                                   }}
                                                   role="progressbar"
                                                >
                                                   <span className="sr-only">
                                                      78% Complete
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-6">
                                       <div className="media mb-4">
                                          <span className="text-primary progress-icon mr-3">
                                             65%
                                          </span>
                                          <div className="media-body">
                                             <p className="font-w500">
                                                Prototyping
                                             </p>
                                             <div
                                                className="progress skill-progress"
                                                style={{ height: "10px" }}
                                             >
                                                <div
                                                   className="progress-bar bg-primary progress-animated"
                                                   style={{
                                                      width: "65%",
                                                      height: "10px;",
                                                   }}
                                                   role="progressbar"
                                                >
                                                   <span className="sr-only">
                                                      65% Complete
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-6">
                                       <div className="media mb-4">
                                          <span className="text-primary progress-icon mr-3">
                                             89%
                                          </span>
                                          <div className="media-body">
                                             <p className="font-w500">
                                                UI Design
                                             </p>
                                             <div
                                                className="progress skill-progress"
                                                style={{ height: "10px" }}
                                             >
                                                <div
                                                   className="progress-bar bg-primary progress-animated"
                                                   style={{
                                                      width: "89%",
                                                      height: "10px",
                                                   }}
                                                   role="progressbar"
                                                >
                                                   <span className="sr-only">
                                                      89% Complete
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-6">
                                       <div className="media mb-4">
                                          <span className="text-primary progress-icon mr-3">
                                             94%
                                          </span>
                                          <div className="media-body">
                                             <p className="font-w500">
                                                Researching
                                             </p>
                                             <div
                                                className="progress skill-progress"
                                                style={{ height: "10px" }}
                                             >
                                                <div
                                                   className="progress-bar bg-primary progress-animated"
                                                   style={{
                                                      width: "94%",
                                                      height: "10px;",
                                                   }}
                                                   role="progressbar"
                                                >
                                                   <span className="sr-only">
                                                      94% Complete
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   );
};

export default Profile;
