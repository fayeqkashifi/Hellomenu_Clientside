import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { base_url, port } from "../../../../../Consts";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Counter from "../Common/Counter/Counter";
import IconButton from "@mui/material/IconButton";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import { TemplateContext } from "../TemplateContext";
import { useRouteMatch } from "react-router-dom";
export default function ShowCards(props) {
  const { url } = useRouteMatch();

  const {
    style,
    cart,
    wishlist,
    setWishList,
    products,
    branchId,
    deliveryFees,
    locale,
  } = useContext(TemplateContext);
  const { check } = props;

  const addWishList = (id) => {
    const checkData = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!checkData.includes(id)) {
      checkData.push(id);
      localStorage.setItem("wishlist", JSON.stringify(checkData));
      setWishList(checkData);
    } else {
      const data = checkData.filter((item) => item != id);
      localStorage.setItem("wishlist", JSON.stringify(data));
      setWishList(data);
    }
  };
  var viewShow_HTMLTABLE = "";
  if (products.length != 0) {
    viewShow_HTMLTABLE = products?.map((item, i) => {
      return (
        <Grid
          item
          style={
            item.stock === 0 || item.stock === null
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
          // lg={2}
          // xl={2}
          key={i}
        >
          <Card sx={style?.cardStyle}>
            <div className="px-2 pt-2">
              <IconButton
                style={style?.cardIconButton}
                onClick={() => addWishList(item.id)}
              >
                {style.template === "thrid" ? (
                  <ShoppingBasketOutlinedIcon sx={style?.shoppingIcon} />
                ) : !wishlist.includes(item.id) ? (
                  <FavoriteBorderIcon sx={style?.favIconDeactive} />
                ) : (
                  <FavoriteIcon sx={style?.favIconActive} />
                )}
              </IconButton>
            </div>

            <CardContent sx={{ flexGrow: 1 }}>
              <Link
                to={{
                  pathname: `${url}/details/${btoa(btoa(btoa(item.id)))}`,
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
                    <Typography
                      style={style?.productName}
                      className="text-truncate"
                    >
                      {item.ProductName}
                    </Typography>
                  </div>
                  <div style={style?.unitName}>{item.UnitName}</div>
                  {style.counterPosition === "last" ? null : (
                    <div style={style?.addIcon}>
                      <Counter item={item} />
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

                {style.counterPosition === "last" ? (
                  <div style={style?.addIcon}>
                    <Counter item={item} />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  } else {
    viewShow_HTMLTABLE = (
      <div className="text-center">{check ? " " : locale?.no_data_found}</div>
    );
  }
  return viewShow_HTMLTABLE;
}
