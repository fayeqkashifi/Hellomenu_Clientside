import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { base_url, port } from "../../../../../Consts";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Counter from "../Common/Counter";
import IconButton from "@mui/material/IconButton";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
export default function ShowCards(props) {
  let { style, cart, setCart, products, branchId, deliveryFees } = props;
  var viewShow_HTMLTABLE = "";
  viewShow_HTMLTABLE = products?.map((item, i) => {
    return (
      <Grid
        item
        style={
          item.stock === 0
            ? {
                pointerEvents: "none",
                opacity: "0.4",
                WebkitFilter: "grayscale(1)",
              }
            : {}
        }
        xs={style?.xs}
        sm={style?.sm}
        md={style?.md}
        key={i}
      >
        <Card sx={style?.cardStyle}>
          <div className="px-2 pt-2">
            <IconButton style={style?.cardIconButton}>
              {style.template === "thrid" ? (
                <ShoppingBasketOutlinedIcon sx={style?.shoppingIcon} />
              ) : cart.every((val) => {
                  return val.id !== item.id;
                }) ? (
                <FavoriteBorderIcon sx={style?.favIconDeactive} />
              ) : (
                <FavoriteIcon sx={style?.favIconActive} />
              )}
            </IconButton>
          </div>

          <CardContent sx={{ flexGrow: 1 }}>
            <Link
              to={{
                pathname: `/public/details/${btoa(btoa(btoa(item.id)))}`,
                state: {
                  style: style,
                  deliveryFees: deliveryFees,
                  branchId: branchId,
                },
              }}
            >
              <div className="text-center">
                <img
                  style={style?.imageStyle}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                />
              </div>
            </Link>

            <div className="mt-2">
              <div className="row">
                <div style={style?.productDiv}>
                  <Typography style={style?.productName}>
                    {item.ProductName}
                  </Typography>
                </div>
                <div style={style?.unitName}>{item.UnitName}</div>
                {style.counterPosition === "last" ? null : (
                  <div style={style?.addIcon}>
                    <Counter
                      style={style}
                      item={item}
                      cart={cart}
                      setCart={setCart}
                      products={products}
                    />
                  </div>
                )}
              </div>
              <div style={style?.priceDiv}>
                <Typography style={style?.price}>
                  {getSymbolFromCurrency(item.currency_code) +
                    "  " +
                    item.price.toFixed(2)}
                </Typography>
              </div>
              <Typography style={style?.description}>
                {item.Description}
              </Typography>

              {style.counterPosition === "last" ? (
                <div style={style?.addIcon}>
                  <Counter
                    style={style}
                    item={item}
                    cart={cart}
                    setCart={setCart}
                    products={products}
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  });
  return viewShow_HTMLTABLE;
}
