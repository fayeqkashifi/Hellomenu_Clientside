import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
function Header(props) {
  const history = useHistory();

  const {
    subcategories,
    activeSubCategory,
    setProducts,
    setActiveSubCategory,
  } = props;

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
      <Toolbar sx={{ position: "sticky" }} className="top-0">
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon fontSize="small" />
        </IconButton>
        <Typography
          // component="h2"
          // variant="h6"
          align="center"
          sx={{ flex: 1 }}
        ></Typography>
        <IconButton>
          <AddShoppingCartIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      {subcategories === 0 ? (
        " "
      ) : (
        <div>
          <Toolbar
            component="nav"
            variant="dense"
            sx={{
              // justifyContent: "space-between",
              overflowX: "auto",
              marginTop: "-25px",
            }}
          >
            {subcategories?.map((section, i) => (
              <Typography
                className="px-3"
                style={
                  activeSubCategory === section.sub_id
                    ? {
                        cursor: "pointer",
                        borderBottomStyle: "solid",
                        borderottomWidth: "2px",
                        width: "fit-content",
                        borderColor: "#f27d1e",
                        color: "#f27d1e",
                      }
                    : {
                        cursor: "pointer",
                      }
                }
                key={i}
                variant="h6"
                sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
                onClick={() => filterProducts(section.sub_id)}
              >
                {section.SubCategoryName}
              </Typography>
            ))}
          </Toolbar>
        </div>
      )}
    </React.Fragment>
  );
}

export default Header;
