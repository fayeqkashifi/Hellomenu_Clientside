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
  let { custom, cart, setCart, products, branch, deliveryFees } = props;
  // style for dark tempalte
  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    borderRadius: "5%",
    backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
  };
  const favIconDeactive = {
    color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
  };
  const favIconActive = {
    color: custom?.menusActiveColor ? custom.menusActiveColor : "#ff751d",
  };
  const imageStyle = {
    height: "150px",
    width: "100%",
    borderRadius: "15%",
    objectFit: "contain",
  };
  const xs = custom?.numberProductInRowMobile
    ? custom.numberProductInRowMobile === 1
      ? 12
      : custom.numberProductInRowMobile === 2
      ? 6
      : custom.numberProductInRowMobile === 3
      ? 4
      : custom.numberProductInRowMobile === 4 ||
        custom.numberProductInRowMobile === 5
      ? 3
      : custom.numberProductInRowMobile === 6
      ? 2
      : 6
    : 6;
  const sm = custom?.numberProductInRowTablet
    ? custom.numberProductInRowTablet === 1
      ? 12
      : custom.numberProductInRowTablet === 2
      ? 6
      : custom.numberProductInRowTablet === 3
      ? 4
      : custom.numberProductInRowTablet === 4 ||
        custom.numberProductInRowTablet === 5
      ? 3
      : custom.numberProductInRowTablet === 6
      ? 2
      : 4
    : 4;
  const md = custom?.numberProductInRowComputer
    ? custom.numberProductInRowComputer === 1
      ? 12
      : custom.numberProductInRowComputer === 2
      ? 6
      : custom.numberProductInRowComputer === 3
      ? 4
      : custom.numberProductInRowComputer === 4 ||
        custom.numberProductInRowComputer === 5
      ? 3
      : custom.numberProductInRowComputer === 6
      ? 2
      : 3
    : 3;
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
        xs={xs}
        sm={sm}
        md={md}
        key={i}
      >
        <Card sx={cardStyle}>
          <div className="px-2 pt-2">
            {cart.every((val) => {
              return val.id !== item.id;
            }) ? (
              <FavoriteBorderIcon sx={favIconDeactive} />
            ) : (
              <FavoriteIcon sx={favIconActive} />
            )}
          </div>

          <CardContent sx={{ flexGrow: 1 }}>
            <Link
              to={{
                pathname: `/dark-template/product/${btoa(item.id)}`,
                state: {
                  custom: custom,
                  deliveryFees: deliveryFees,
                  branch: branch,
                },
              }}
            >
              <div className="text-center">
                <img
                  style={imageStyle}
                  src={`http://${base_url}:${port}/images/products/${
                    JSON.parse(item.image)[0]
                  }`}
                  alt="Image"
                />
              </div>
            </Link>

            <div className="mt-2">
              <Grid container>
                <Grid item xs={8}>
                  <Typography
                    variant="button"
                    style={{ textTransform: "capitalize" }}
                  >
                    {item.ProductName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Counter
                    custom={custom}
                    item={item}
                    cart={cart}
                    setCart={setCart}
                    products={products}
                  />
                </Grid>
              </Grid>

              <Typography
                variant="body1"
                gutterBottom
                className="font-weight-bold"
              >
                {getSymbolFromCurrency(item.currency_code) +
                  "  " +
                  item.price.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {item.Description}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  });
  return (
    <Grid container spacing={2} className="d-flex justify-content-center">
      {viewShow_HTMLTABLE}
    </Grid>
  );
}
