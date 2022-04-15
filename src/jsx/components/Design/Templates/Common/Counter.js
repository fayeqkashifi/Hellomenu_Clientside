import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CustomAlert from "../../../CustomAlert";
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
} from "../Functionality";
const Counter = (props) => {
  const { style, products, item, cart, setCart } = props;
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const handleDecrement = (qty, id) => {
    handleDecrementQuantity(qty, id, cart).then((data) => {
      setCart((cart) => data);
      item.qty = qty - 1;
    });
  };
  const handelIncrement = (qty, id, stock) => {
    handelIncrementQuantity(qty, id, stock, cart).then((data) => {
      if (data !== null) {
        setCart((cart) => data);
        item.qty = qty + 1;
      } else {
        setAlerts(
          true,
          "warning",
          "More than that isn't available because it's out of stock."
        );
      }
    });
  };

  const addItem = (id) => {
    addItemWithdoutDetails(id, cart, products).then((data) => {
      setCart(data);
    });
  };
  const remItem = (id) => {
    remCartItem(id, cart).then((data) => {
      setCart(data);
    });
  };
  var cartItem = [];
  const getvalue = JSON.parse(localStorage.getItem("cart")) || [];
  if (getvalue) {
    cartItem = getvalue.filter((cart) => {
      return cart.id === item.id;
    });
  }

  return (
    <div style={style?.divCounter}>
      {alert.open ? (
        <CustomAlert
          vertical="top"
          horizontal="right"
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}
      <div
        className={`row justify-content-center ${
          cartItem.length === 0 ? " " : "d-none"
        } `}
      >
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4">
          <IconButton onClick={(e) => [addItem(item.id)]}>
            {style?.template === "second" ? (
              <AddBoxIcon style={style?.addToCartIcon} />
            ) : (
              <AddBoxOutlinedIcon style={style?.addToCartIcon} />
            )}
          </IconButton>
        </div>
      </div>
      <div
        className={`row justify-content-center ${
          cartItem.length !== 0 ? " " : "d-none"
        }`}
      >
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 ">
          {(cartItem.length !== 0 ? cartItem[0].qty : item.qty) === 1 ? (
            <IconButton onClick={() => remItem(item.id)}>
              <Typography style={style?.counterRemovIcon}>
                <DeleteRoundedIcon fontSize="small" />
              </Typography>
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
              <Typography style={style?.counterDecrementIcon}>
                <RemoveRoundedIcon fontSize="small" />
              </Typography>
            </IconButton>
          )}
        </div>
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4">
          <IconButton>
            <Typography style={style?.counterValue}>
              {cartItem.length !== 0 ? cartItem[0].qty : item.qty}
            </Typography>
          </IconButton>
        </div>

        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4">
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
            <Typography style={style?.counterIncrementIcon}>
              <AddRoundedIcon fontSize="small" />
            </Typography>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Counter;
