import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useHistory } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import { useTranslation } from "react-i18next";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Drawer from "./Drawer";
function Header(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [modalCentered, setModalCentered] = useState(false);
  const {
    categories,
    activeCategory,
    setProducts,
    setActiveCategory,
    style,
    cart,
    branch,
    setCart,
    deliveryFees,
  } = props;

  const filterProducts = (menu) => {
    if (menu.sub_category_id === null) {
      setActiveCategory(menu.CategoryName + "-" + menu.category_id);
      getProductBasedOnCategory(menu.category_id).then((data) => {
        setProducts(data);
      });
    } else {
      setActiveCategory(menu.SubCategoryName + "-" + menu.sub_category_id);
      getProductBasedOnSubCategory(menu.sub_category_id).then((res) => {
        setProducts(res);
      });
    }
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ position: "sticky" }} className="top-0">
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon fontSize="small" sx={style?.backIcon} />
        </IconButton>
        <Typography
          // sx={{ flex: 1 }}
          // component="h2"
          // variant="h3"
          align="left"
          style={style?.title}
          noWrap
        >
          {activeCategory?.split("-")[0]}
        </Typography>
        <Typography sx={{ flex: 1 }}></Typography>
        <IconButton onClick={() => setModalCentered(true)}>
          <SearchOutlinedIcon fontSize="small" sx={style?.searchIcon} />
        </IconButton>
        <IconButton onClick={() => setModalCentered(true)}>
          <Badge
            badgeContent={cart.length}
            sx={style?.BadgeStyle}
            overlap="circular"
          >
            <AddShoppingCartIcon fontSize="small" sx={style?.cartIcon} />
          </Badge>
        </IconButton>
      </Toolbar>
      {style?.template !== "dark" ? (
        " "
      ) : (
        <div>
          <Toolbar component="nav" variant="dense" sx={style?.headerToolbar}>
            {categories?.map((section, i) => (
              <Typography
                style={
                  activeCategory ===
                  (section.sub_category_id === null
                    ? section.CategoryName + "-" + section.category_id
                    : section.SubCategoryName + "-" + section.sub_category_id)
                    ? style?.cateActive
                    : style?.cateDeActive
                }
                key={i}
                // sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
                onClick={() => filterProducts(section)}
              >
                {section.SubCategoryName === null
                  ? section.CategoryName
                  : section.SubCategoryName}
              </Typography>
            ))}
          </Toolbar>
        </div>
      )}
      <Drawer
        modalCentered={modalCentered}
        setModalCentered={setModalCentered}
        style={style}
        checkBit={true}
        branch={branch}
        cart={cart}
        setCart={setCart}
        deliveryFees={deliveryFees}
      />
    </React.Fragment>
  );
}

export default Header;
