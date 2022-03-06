import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useHistory } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Drawer from "./Drawer";
import getSymbolFromCurrency from "currency-symbol-map";

function Header(props) {
  const history = useHistory();
  const [modalCentered, setModalCentered] = useState(false);
  const {
    categories,
    activeCategory,
    setProducts,
    setActiveCategory,
    style,
    cart,
    branchId,
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
  let [sum, setSum] = useState(0);
  const dataLoad = () => {
    let count = 0;
    cart.map(
      (item) =>
        (count +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(count);
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setSum(0);
    };
  }, [cart]);
  return (
    <React.Fragment>
      <Toolbar sx={{ position: "sticky" }} className="top-0">
        <IconButton onClick={() => history.goBack()} sx={style?.backIcon}>
          <KeyboardBackspaceIcon fontSize="small" />
        </IconButton>
        <Typography align="left" style={style?.title} noWrap>
          {activeCategory?.split("-")[0]}
        </Typography>
        <Typography sx={{ flex: 1 }} style={style?.searchFields}>
          <input
            name="dateAndTime"
            type="text"
            className={`form-control`}
            placeholder="Search By Categories"
            style={style?.inputfield}
          />
        </Typography>
        <IconButton sx={style?.searchIcon}>
          <SearchOutlinedIcon fontSize="small" />
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
        <div style={style?.headerTotalDiv}>
          {" "}
          <IconButton sx={style?.totalPriceIcon}>
            <FunctionsIcon fontSize="small" />
          </IconButton>
          {sum.toFixed(2) +
            "  " +
            (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
              ? " "
              : getSymbolFromCurrency(cart[0]?.currency_code))}{" "}
          &nbsp;
        </div>
      </Toolbar>
      {style?.template === "dark" && (
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
                sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
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
        branchId={branchId}
        cart={cart}
        setCart={setCart}
        deliveryFees={deliveryFees}
      />
    </React.Fragment>
  );
}

export default Header;
