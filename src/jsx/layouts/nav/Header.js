import React from "react";
import { Link ,useHistory} from "react-router-dom";
/// Scroll

/// Image
import profile from "../../../images/hellomenu/logo.svg";
import axios from "axios";

const Header = ({ toggle, onProfile}) => {
   const history = useHistory();
   const logoutUser =  (e) => {
      e.preventDefault();
         axios.post("/api/logout").then(res=>{
            if(res.data.status === 200){
               localStorage.removeItem('auth_token');
               localStorage.removeItem('auth_name');
               history.push("/page-login");
               window.location.reload();
            }
        });
   };  
   return (
      <div className="header">
         
         <div className="header-content" >
            <nav className="navbar navbar-expand">
               <div className="collapse navbar-collapse justify-content-between">
                  <div className="header-left">
                   
                  </div>

                  <ul className="navbar-nav header-right">
                    <li
                        className={`nav-item dropdown header-profile ${
                           toggle === "profile" ? "show" : ""
                        }`}
                        onClick={() => onProfile()}
                     >
                        <Link to={"#"}
                           className="nav-link"
                           role="button"
                           data-toggle="dropdown"
                        >
                           <div className="header-info">
								<small>HELLO MENU</small>
								<span>{localStorage.getItem('auth_name')}</span>
                           </div>
                           <img src={profile} width="10"  alt="" />
                        </Link>
                        <div
                           className={`dropdown-menu dropdown-menu-right ${
                              toggle === "profile" ? "show" : ""
                           }`}
                        >
                           <Link
                              to="/profile"
                              className="dropdown-item ai-icon"
                           >
                              <svg
                                 id="icon-user1"
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="text-success"
                                 width="18"
                                 height="18"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                 <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              <span className="ml-2">Profile </span>
                           </Link>
                           
                           <button
                             
                              className="dropdown-item ai-icon"
                              onClick={logoutUser}
                           >
                              <svg
                                 id="icon-logout"
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="text-danger"
                                 width="18"
                                 height="18"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                 <polyline points="16 17 21 12 16 7"></polyline>
                                 <line x1="21" y1="12" x2="9" y2="12"></line>
                              </svg>
                              <span className="ml-2">Logout </span>
                           </button>
                        </div>
                     </li>
					 
                  </ul>
               </div>
            </nav>
         </div>
      </div>
   );
};

export default Header;
