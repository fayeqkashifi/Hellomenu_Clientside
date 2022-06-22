import React, { useState, useEffect, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { TemplateContext } from "../TemplateContext";
import { LanguagesContext } from "../LanguagesContext";

export default function LanguageLocalization() {
  const { languages, selectedLang, setSelectedLang, setLocale, style, branch } =
    useContext(TemplateContext);
  const { dataLoad } = useContext(LanguagesContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (event, option) => {
    sessionStorage.setItem(
      btoa("selectedLang" + branch.id),
      JSON.stringify(option)
    );
    sessionStorage.setItem(btoa("locale" + branch.id), option.locale);
    setSelectedLang(option);
    setLocale(JSON.parse(option.locale));
    dataLoad(option);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [first, setFirst] = useState(
    JSON.parse(sessionStorage.getItem(btoa("selectedLang" + branch.id))) || []
  );
  useEffect(() => {
    if (first.length === 0) {
      let defaultLang = languages.filter((item) => {
        if (item.default == 1) {
          sessionStorage.setItem(
            btoa("selectedLang" + branch.id),
            JSON.stringify(item)
          );
          setSelectedLang(item);
          return item;
        }
      });
      setFirst(defaultLang[0]);
    }
  }, []);

  return (
    <div>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          sx={style?.localeBackground}
        >
          <ListItemText
            primary={
              selectedLang?.label == undefined
                ? first.label?.toUpperCase()
                : selectedLang.label?.toUpperCase()
            }
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
        style={{ zIndex: 99999999 }}
      >
        {languages?.map((option, index) => (
          <MenuItem
            key={index}
            // disabled={index === 0}
            selected={option.label == selectedLang.label ? true : false}
            onClick={(event) => handleMenuItemClick(event, option)}
            // style={style?.localeBackground}
          >
            {option.label.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
