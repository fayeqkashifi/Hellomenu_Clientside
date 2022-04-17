import React, { useRef, useState, useEffect } from "react";
import profile from "../../../images/hellomenu/logo.svg";
import axios from "axios";
import "flag-icon-css/css/flag-icons.min.css";
import IdleTimer from "react-idle-timer";
import { base_url, port } from "../../../Consts";
import { localization as t } from "../../components/Localization";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
const Header = ({ toggle, onProfile, onNotification, setCheck, check }) => {
  const idleTimerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logoutUser = () => {
    axios
      .post("/api/logout")
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_name");
          localStorage.removeItem("auth_company_id");
          localStorage.removeItem("auth_id");
          localStorage.removeItem("role");
          localStorage.removeItem("locale");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [languages, setLanguages] = useState([]);
  const [activeLang, setActivLang] = useState([]);

  const [user, setUser] = useState([]);
  const dataLoad = async () => {
    try {
      const result = await axios.get(
        `/api/getUser/${atob(localStorage.getItem("auth_id"))}`
      );
      if (result.data.status === 200) {
        setUser(result.data.data);
      }
      axios
        .get("/api/getlocales")
        .then((res) => {
          res.data.filter((item) => {
            if (item.status == 1) {
              return setActivLang(item);
            }
          });
          setLanguages(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setUser([]);
    };
  }, [check]);
  const changeLocaleStatus = (id) => {
    axios
      .get(`/api/changeLocaleStatus/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("locale", res.data.data.locale);
          setCheck(!check);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
              <div className="nav-item">
                <IconButton onClick={handleClick}>
                  <span
                    className={`flag-icon flag-icon-${activeLang.country_code?.toLowerCase()} `}
                  ></span>
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <ul>
                    {languages.map((item, i) => (
                      <li
                        key={i}
                        className={`dropdown-item ${
                          item.status ? "active" : ""
                        }`}
                        onClick={() => changeLocaleStatus(item.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={`flag-icon flag-icon-${item.country_code?.toLowerCase()} mr-2`}
                        ></span>
                        {item.Language_name}
                      </li>
                    ))}
                  </ul>
                </Menu>
              </div>
              <li
                className={`nav-item dropdown header-profile ${
                  toggle === "profile" ? "show" : ""
                }`}
                onClick={() => onProfile()}
              >
                <a
                  // to={"/#"}
                  className="nav-link"
                  role="button"
                  data-toggle="dropdown"
                >
                  <div className="header-info">
                    <small>{t("hello_menu")}</small>
                    <span> {atob(localStorage.getItem("auth_name"))} </span>
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
                  <div onClick={logoutUser} className="ml-2">
                    <svg
                      id="icon-logout"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-danger"
                      width="32"
                      height="32"
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
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
