import React, { useRef, useState, useEffect } from "react";
import profile from "../../../images/hellomenu/logo.svg";
import axios from "axios";
import "flag-icon-css/css/flag-icons.min.css";
import IdleTimer from "react-idle-timer";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { base_url, port } from "../../../Consts";
import { localization as t } from "../../components/Localization";

const Header = ({ toggle, onProfile, onNotification }) => {
  const idleTimerRef = useRef(null);

  // const history = useHistory();
  const logoutUser = () => {
    // e.preventDefault();
    axios.post("/api/logout").then((res) => {
      if (res.data.status === 200) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_name");
        localStorage.removeItem("auth_company_id");
        localStorage.removeItem("auth_id");
        localStorage.removeItem("role");
        localStorage.removeItem("locale");
        window.location = "/login";
      }
    });
  };

  const [user, setUser] = useState([]);
  const dataLoad = async () => {
    try {
      const result = await axios.get(
        `/api/getUser/${atob(localStorage.getItem("auth_id"))}`
      );

      if (result.data.status === 200) {
        setUser(result.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();

    return () => {
      setUser([]);
    };
  }, []);
  return (
    <div className="header">
      <IdleTimer
        ref={idleTimerRef}
        timeout={1000 * 60 * 15}
        onIdle={logoutUser}
      />
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left"></div>

            <ul className="navbar-nav header-right">
              <li
                className={`nav-item dropdown header-profile ${
                  toggle === "profile" ? "show" : ""
                }`}
                onClick={() => onProfile()}
              >
                <a
                  // to={"#"}
                  className="nav-link"
                  role="button"
                  data-toggle="dropdown"
                >
                  <div className="header-info">
                    <small>{t("hello_menu")}</small>
                    <span>
                      {" "}
                      {atob(localStorage.getItem("auth_name"))}{" "}
                      <MoreVertIcon sx={{ color: "#f50b65" }} />
                    </span>
                  </div>
                  <img
                    src={
                      user?.profilePic
                        ? `http://${base_url}:${port}/images/profiles/${user?.profilePic}`
                        : profile
                    }
                    width="10"
                    alt=""
                  />
                </a>
                <div
                  className={`dropdown-menu dropdown-menu-right ${
                    toggle === "profile" ? "show" : ""
                  }`}
                >
                  {/* <Link to="/profile" className="dropdown-item ai-icon">
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
                    <span className="ml-2">{t("profile")} </span>
                  </Link> */}

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
                    <span className="ml-2">{t("logout")} </span>
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
