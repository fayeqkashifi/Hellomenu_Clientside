import React, { useState } from "react";
import logo from "../../images/hellomenu/logo.svg";
import { Link } from "react-router-dom";
import i18next from "i18next";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import PublicIcon from "@mui/icons-material/Public";
const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const languages = [
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },
    {
      code: "tr",
      name: "Turkish",
      country_code: "tr",
    },
  ];
  const { route, linkName } = props;
  return (
    <div className="row m-2">
      <div className="d-flex justify-content-between">
        <img src={logo} width="100" alt="Logo" />
        <div className="row">
          <div className="col d-flex align-items-center justify-content-center">
            <div>
              <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <PublicIcon />
              </Button>
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
                  {languages.map(({ country_code, code, name }) => (
                    <li key={country_code}>
                      <div className="success"></div>
                      <button
                        className="dropdown-item"
                        onClick={() => i18next.changeLanguage(code)}
                      >
                        <span
                          className={`flag-icon flag-icon-${country_code} mx-2`}
                        ></span>
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Menu>
            </div>
          </div>
          <div className="col d-flex align-items-center justify-content-center">
            {route && <Link to={route}>{linkName}</Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
