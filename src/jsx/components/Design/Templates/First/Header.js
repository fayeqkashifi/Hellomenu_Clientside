import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
function Header(props) {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    title,
    subcategories,
    activeSubCategory,
    setProducts,
    setActiveSubCategory,
  } = props;
  // console.log(subcategories);

  const filterProducts = (subCateID) => {
    axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
      }
    });
    setActiveSubCategory(subCateID);
  };
  return (
    <React.Fragment>
      <Toolbar
        sx={{ borderBottom: 1, borderColor: "divider", position: "sticky" }}
        className="top-0 "
      >
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography
          component="h2"
          variant="h6"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Toolbar>

      {subcategories === 0 ? (
        " "
      ) : (
        <div>
          <Toolbar
            component="nav"
            variant="dense"
            className="border mb-2"
            sx={{ justifyContent: "space-between", overflowX: "auto" }}
          >
            {subcategories?.map((section, i) => (
              <div
                style={
                  activeSubCategory === section.sub_id
                    ? {
                        cursor: "pointer",
                        background: "black",
                        margin: "2px",
                        padding: "5px",
                        border: "1px solid",
                        textAlign: "center",
                        borderRadius: "10px",
                        color: "#fff",
                      }
                    : {
                        cursor: "pointer",
                        color: "black",
                        margin: "2px",
                        padding: "5px",
                        textAlign: "center",
                        borderRadius: "10px",
                      }
                }
                key={i}
                underline="hover"
                variant="body2"
                sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
                onClick={() => filterProducts(section.sub_id)}
              >
                {section.SubCategoryName}
              </div>
            ))}
          </Toolbar>
        </div>
      )}
    </React.Fragment>
  );
}

export default Header;
