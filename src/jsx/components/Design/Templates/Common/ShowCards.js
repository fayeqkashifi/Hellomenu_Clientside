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

export default function ShowCards(props) {
  let { style, cart, setCart, products, branch, deliveryFees } = props;
  // style for dark tempalte

  // end
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
            {cart.every((val) => {
              return val.id !== item.id;
            }) ? (
              <FavoriteBorderIcon sx={style?.favIconDeactive} />
            ) : (
              <FavoriteIcon sx={style?.favIconActive} />
            )}
          </div>

          <CardContent sx={{ flexGrow: 1 }}>
            <Link
              to={{
                pathname: `/dark-template/product/${btoa(item.id)}`,
                state: {
                  style: style,
                  deliveryFees: deliveryFees,
                  branch: branch,
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
                  <Typography variant="button" style={style?.productName}>
                    {item.ProductName}
                  </Typography>
                </div>
                <div style={style?.addIcon}>
                  <Counter
                    style={style}
                    item={item}
                    cart={cart}
                    setCart={setCart}
                    products={products}
                  />
                </div>
              </div>

              <Typography
                variant="body1"
                gutterBottom
                // className="font-weight-bold"
                style={style?.price}
              >
                {getSymbolFromCurrency(item.currency_code) +
                  "  " +
                  item.price.toFixed(2)}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={style?.description}
              >
                {item.Description}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  });
  return viewShow_HTMLTABLE;
}
