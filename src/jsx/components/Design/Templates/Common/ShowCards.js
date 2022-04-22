import React, { useContext } from "react";
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
import { TemplateContext } from "../TemplateContext";
export default function ShowCards() {
  const { style, cart, products, branchId, deliveryFees, locale } =
    useContext(TemplateContext);
  var viewShow_HTMLTABLE = "";
  if (products.length != 0) {
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
      <div className="text-center">{locale?.no_data_found}</div>
    );
  }
  return viewShow_HTMLTABLE;
}
