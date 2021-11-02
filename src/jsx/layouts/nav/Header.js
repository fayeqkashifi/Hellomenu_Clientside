import React from "react";
import { Link ,useHistory} from "react-router-dom";
/// Image
import i18next from "i18next";
import profile from "../../../images/hellomenu/logo.svg";
import axios from "axios";
import "flag-icon-css/css/flag-icons.min.css"
import { useTranslation } from "react-i18next";

const Header = ({ toggle, onProfile,onNotification}) => {
	const { t } = useTranslation();

   const history = useHistory();
   const logoutUser =  (e) => {
      e.preventDefault();
         axios.post("/api/logout").then(res=>{
            if(res.data.status === 200){
               localStorage.removeItem('auth_token');
               localStorage.removeItem('auth_name');
               localStorage.removeItem('auth_id');
               history.push("/page-login");
               window.location.reload();
            }
        });
   };  
   const languages=[
   {
      code: 'en',
      name: 'English',
      country_code: 'gb'
   },
   {
      code: 'tr',
      name: 'Turkish',
      country_code: 'tr'
   },

]
   return (
      <div className="header">
         
         <div className="header-content" >
            <nav className="navbar navbar-expand">
               <div className="collapse navbar-collapse justify-content-between">
                  <div className="header-left">
                 
                 
                  </div>

                  <ul className="navbar-nav header-right">
                  
                     <li className="nav-item dropdown notification_dropdown">
                        <Link to={"#"}
                           className="nav-link bell bell-link"
                           onClick={() => onNotification()}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                           </svg>
                        </Link>
                        <div
                           className={`dropdown-menu ${
                              toggle === "notification" ? "show" : ""
                           }`}
                        >
                         
								<ul className="">
                           {languages.map(({name,code,country_code})=>(
                              <li key={country_code}>
                                 <div className="success"></div>
                                 <button className="dropdown-item" onClick={()=>i18next.changeLanguage(code)}>
                                    <span className={`flag-icon flag-icon-${country_code} mx-2`}></span>
                                    {name}
                                 </button>
                              </li>
                           ))}
									
								</ul>
                           
                        </div>
                     </li>
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
                              <span className="ml-2">{t('profile')} </span>
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
                              <span className="ml-2">{t('logout')} </span>
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


