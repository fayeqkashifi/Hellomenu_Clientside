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
import Counter from "../Common/Counter/Counter";
import IconButton from "@mui/material/IconButton";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import { TemplateContext } from "../TemplateContext";
import { useRouteMatch } from "react-router-dom";
import { addItemWithdoutDetails } from "../Functionality";
import Tooltip from "@mui/material/Tooltip";

export default function ShowCards(props) {
  const { url } = useRouteMatch();

  const {
    style,
    wishlist,
    setWishList,
    products,
    branch,
    deliveryFees,
    locale,
    setAlerts,
    cart,
  } = useContext(TemplateContext);
  const { check } = props;

  const addWishList = (id) => {
    const wishCheck = wishlist.every((item) => {
      return item.id !== id;
    });
    if (wishCheck) {
      const check = cart.every((item) => {
        return item.id !== id;
      });
      if (check) {
        addItemWithdoutDetails(id, wishlist, products, "wishlist").then(
          (data) => {
            if (data === "") {
              setAlerts(
                true,
                "warning",
                locale?.please_select_product_variantion
              );
            } else {
              setWishList(data);
            }
          }
        );
      } else {
        setAlerts(true, "warning", locale?.item_is_already_in_cart);
      }
    } else {
      const filterData = wishlist.filter((item) => item.id !== id);
      setWishList(filterData);
      localStorage.setItem("wishlist", JSON.stringify(filterData));
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
              <Tooltip title={locale?.add_to_wishlist}>
                <IconButton
                  style={style?.cardIconButton}
                  onClick={() => addWishList(item.id)}
                >
                  {style.template === "thrid" ? (
                    <ShoppingBasketOutlinedIcon sx={style?.shoppingIcon} />
                  ) : wishlist.every((value) => value.id !== item.id) ? (
                    <FavoriteBorderIcon sx={style?.favIconDeactive} />
                  ) : (
                    <FavoriteIcon sx={style?.favIconActive} />
                  )}
                </IconButton>
              </Tooltip>
            </div>

            <CardContent sx={{ flexGrow: 1 }}>
              <Link
                to={{
                  pathname: `${url}/details/${btoa(btoa(btoa(item.id)))}`,
                  state: {
                    style: style,
                    deliveryFees: deliveryFees,
                    branchId: branch.id,
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
