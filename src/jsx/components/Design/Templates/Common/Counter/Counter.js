import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  addItemWithdoutDetails,
  remCartItem,
  handleDecrementQuantity,
  handelIncrementQuantity,
} from "../../Functionality";
import { TemplateContext } from "../../TemplateContext";
import Tooltip from "@mui/material/Tooltip";

const Counter = (props) => {
  const {
    branch,
    style,
    products,
    cart,
    wishlist,
    setWishList,
    setCart,
    locale,
    setAlerts,
  } = useContext(TemplateContext);
  const { item, setFetchData, fetchData } = props;
  const handleDecrement = (qty, id) => {
    handleDecrementQuantity(qty, id, cart, branch).then((data) => {
      setCart((cart) => data);
      item.qty = qty - 1;
    });
  };
  const handelIncrement = (qty, id, stock) => {
    handelIncrementQuantity(qty, id, stock, cart, branch).then((data) => {
      if (data !== null) {
        setCart((cart) => data);
        item.qty = qty + 1;
      } else {
        setAlerts(
          true,
          "warning",
          locale?.more_than_that_isnot_available_because_itis_out_of_stock
        );
      }
    });
  };

  const addItem = (id) => {
    addItemWithdoutDetails(id, cart, products, btoa("cart" + branch.id)).then(
      (data) => {
        if (data === "") {
          setAlerts(true, "warning", locale?.please_select_product_variantion);
        } else {
          setCart(data);
        }
      }
    );
    const wishCheck = wishlist.every((item) => {
      return item.id !== id;
    });
    if (!wishCheck) {
      const filterData = wishlist.filter((item) => item.id !== id);
      setWishList(filterData);
      localStorage.setItem(
        btoa("wishlist" + branch.id),
        JSON.stringify(filterData)
      );
    }
  };
  const remItem = (id) => {
    remCartItem(id, cart, branch).then((data) => {
      setCart(data);
      if (fetchData) {
        setFetchData(fetchData.filter((item) => item.id !== id));
      }
    });
  };
  var cartItem = [];
  const getvalue =
    JSON.parse(localStorage.getItem(btoa("cart" + branch.id))) || [];
  if (getvalue) {
    cartItem = getvalue.filter((cart) => {
      return cart.id === item.id;
    });
  }

  return (
    <div style={style?.divCounter}>
      <div
        className={`row justify-content-center ${
          cartItem.length === 0 ? " " : "d-none"
        } `}
      >
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 ">
          <Tooltip title={locale?.add_to_cart}>
            <IconButton onClick={(e) => [addItem(item.id)]}>
              {style?.template === "second" ? (
                <AddBoxIcon style={style?.addToCartIcon} />
              ) : (
                <AddBoxOutlinedIcon style={style?.addToCartIcon} />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div
        className={`row justify-content-center ${
          cartItem.length !== 0 ? " " : "d-none"
        }`}
      >
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 d-flex align-items-center justify-content-center">
          {(cartItem.length !== 0 ? cartItem[0].qty : item.qty) === 1 ? (
            <IconButton onClick={() => remItem(item.id)}>
              <DeleteRoundedIcon style={style?.counterRemovIcon} />
            </IconButton>
          ) : (
            <IconButton
              onClick={() =>
                handleDecrement(
                  cartItem.length !== 0 ? cartItem[0].qty : item.qty,
                  item.id,
                  item.price
                )
              }
            >
              <RemoveRoundedIcon style={style?.counterDecrementIcon} />
            </IconButton>
          )}
        </div>
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 d-flex align-items-center justify-content-center">
          <IconButton>
            <Typography style={style?.counterValue}>
              {cartItem.length !== 0 ? cartItem[0].qty : item.qty}
            </Typography>
          </IconButton>
        </div>
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 d-flex align-items-center justify-content-center">
          <IconButton
            onClick={() =>
              handelIncrement(
                cartItem.length !== 0 ? cartItem[0].qty : item.qty,
                item.id,
                // item.price,
                item.stock
              )
            }
          >
            <AddRoundedIcon style={style?.counterIncrementIcon} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Counter;
