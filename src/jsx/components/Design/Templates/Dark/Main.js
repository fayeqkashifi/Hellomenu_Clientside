import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Counter from "./Counter";

var hold = 1;
export default function Main(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const deliveryFees = props.history.location.state.deliveryFees;

  const [branch, setBranch] = useState([]);
  const [menu, setMenu] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [custom, setCustom] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetTempBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCustom(res.data.fetchData[0]?.Customization);
      }
    });
    axios.get(`/api/GetBranchForShow/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranch(res.data.data);
      }
    });
    axios.get(`/api/getCategoriesBasedProducts/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setMenu(res.data.fetchData);
        if (res.data.fetchData[0]?.sub_category_id === null) {
          setActiveMenu(
            res.data.fetchData[0]?.CategoryName +
              res.data.fetchData[0]?.category_id
          );
          axios
            .get(
              `/api/GetProductsBasedCategory/${res.data.fetchData[0]?.category_id}`
            )
            .then((res) => {
              if (res.data.status === 200) {
                setProducts(res.data.data);
              }
            });
        } else {
          setActiveMenu(
            res.data.fetchData[0]?.SubCategoryName +
              res.data.fetchData[0]?.sub_category_id
          );

          axios
            .get(
              `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_category_id}`
            )
            .then((res) => {
              if (res.data.status === 200) {
                setProducts(res.data.data);
              }
            });
        }
        setLoading(false);
      }
    });
  }, []);
  const [changeState, setChangeState] = useState(true);
  const fetchMoreData = () => {
    if (hold < menu.length) {
      axios.get(`/api/getCategoriesBasedProducts/${branchId}`).then((res) => {
        if (res.data.status === 200) {
          // setActiveMenu(res.data.fetchData[hold].sub_id);

          if (res.data.fetchData[hold]?.sub_category_id === null) {
            setActiveMenu(
              res.data.fetchData[hold]?.CategoryName +
                res.data.fetchData[hold]?.category_id
            );
            axios
              .get(
                `/api/GetProductsBasedCategory/${res.data.fetchData[hold]?.category_id}`
              )
              .then((res) => {
                if (res.data.status === 200) {
                  hold = hold + 1;

                  setProducts(products.concat(res.data.data));
                }
              });
          } else {
            setActiveMenu(
              res.data.fetchData[hold]?.SubCategoryName +
                res.data.fetchData[hold]?.sub_category_id
            );

            axios
              .get(
                `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[hold]?.sub_category_id}`
              )
              .then((res) => {
                if (res.data.status === 200) {
                  hold = hold + 1;

                  setProducts(products.concat(res.data.data));
                }
              });
          }
        }
      });
    } else {
      setChangeState(false);
    }
    // console.log(hold);
  };

  // theme start
  const theme = createTheme({
    palette: {
      background: {
        default: custom?.bgColor ? custom.bgColor : "#22252a",
      },
    },
    typography: {
      fontFamily: custom?.font ? custom.font : "sans-serif",
      // discription
      subtitle1: {
        fontSize: custom?.pDiscriptionSize
          ? custom.pDiscriptionSize + "rem"
          : "0.75rem",

        color: custom?.product_discription_color
          ? custom.product_discription_color
          : "#fff",
      },
      // price
      body1: {
        fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
        color: custom?.price_color ? custom.price_color : "#fff",
      },
      // product Names
      button: {
        fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
        color: custom?.product_name_color ? custom.product_name_color : "#fff",
      },
      // Menus
      h6: {
        fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
        color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
      },
    },
  });
  // theme end
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  var viewShow_HTMLTABLE = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewShow_HTMLTABLE = products?.map((item, i) => {
      return (
        <Grid
          item
          style={
            item.stock == 0
              ? {
                  pointerEvents: "none",
                  opacity: "0.4",
                  WebkitFilter: "grayscale(1)",
                }
              : {}
          }
          xs={
            custom?.numberProductInRowMobile
              ? custom.numberProductInRowMobile == 1
                ? 12
                : custom.numberProductInRowMobile == 2
                ? 6
                : custom.numberProductInRowMobile == 3
                ? 4
                : custom.numberProductInRowMobile == 4 ||
                  custom.numberProductInRowMobile == 5
                ? 3
                : custom.numberProductInRowMobile == 6
                ? 2
                : 6
              : 6
          }
          sm={
            custom?.numberProductInRowTablet
              ? custom.numberProductInRowTablet == 1
                ? 12
                : custom.numberProductInRowTablet == 2
                ? 6
                : custom.numberProductInRowTablet == 3
                ? 4
                : custom.numberProductInRowTablet == 4 ||
                  custom.numberProductInRowTablet == 5
                ? 3
                : custom.numberProductInRowTablet == 6
                ? 2
                : 4
              : 4
          }
          md={
            custom?.numberProductInRowComputer
              ? custom.numberProductInRowComputer == 1
                ? 12
                : custom.numberProductInRowComputer == 2
                ? 6
                : custom.numberProductInRowComputer == 3
                ? 4
                : custom.numberProductInRowComputer == 4 ||
                  custom.numberProductInRowComputer == 5
                ? 3
                : custom.numberProductInRowComputer == 6
                ? 2
                : 3
              : 3
          }
          key={i}
        >
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "5%",
              backgroundColor: custom?.cardBgColor
                ? custom.cardBgColor
                : "#2d3134",
            }}
          >
            <div className="px-2 pt-2">
              {cart.every((val) => {
                return val.id !== item.id;
              }) ? (
                <FavoriteBorderIcon
                  sx={{
                    color: custom?.menusDeactiveColor
                      ? custom.menusDeactiveColor
                      : "#fff",
                  }}
                />
              ) : (
                <FavoriteIcon
                  sx={{
                    color: custom?.menusActiveColor
                      ? custom.menusActiveColor
                      : "#ff751d",
                  }}
                />
              )}
            </div>

            <CardContent sx={{ flexGrow: 1 }}>
              <Link
                to={{
                  pathname: `/dark-template/product/${btoa(item.id)}`,
                  state: { custom: custom },
                }}
              >
                <div className="text-center">
                  <img
                    style={{
                      height: "150px",
                      width: "100%",
                      borderRadius: "15%",
                      objectFit: "contain",
                    }}
                    src={`http://${base_url}:${port}/images/products/${
                      JSON.parse(item.image)[0]
                    }`}
                    alt="Image"
                    // className="h-100"
                  />
                </div>
              </Link>

              <div className="mt-2">
                <Grid container>
                  <Grid item xs={9}>
                    <Link
                      to={{
                        pathname: `/dark-template/product/${btoa(item.id)}`,
                        state: { custom: custom, deliveryFees: deliveryFees },
                      }}
                    >
                      <Typography
                        variant="button"
                        style={{ textTransform: "capitalize" }}
                        // className="font-weight-bold"
                      >
                        {item.ProductName}
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={3}>
                    <Counter
                      custom={custom}
                      item={item}
                      cart={cart}
                      setCart={setCart}
                      products={products}
                    />
                    {/* <IconButton onClick={() => addItem(item.id)}>
                      {cart.every((val) => {
                        return val.id !== item.id;
                      }) ? (
                        <AddIcon
                          sx={{
                            color: custom?.menusDeactiveColor
                              ? custom.menusDeactiveColor
                              : "#fff",
                          }}
                        />
                      ) : (
                        <AddIcon
                          sx={{
                            color: custom?.menusActiveColor
                              ? custom.menusActiveColor
                              : "#ff751d",
                          }}
                        />
                      )}
                    </IconButton> */}
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
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          cart={cart.length}
          title={branch[0]?.BrancheName}
          menu={menu}
          activeMenu={activeMenu}
          setProducts={setProducts}
          setActiveMenu={setActiveMenu}
          custom={custom}
        />

        <Container className="mt-3 d-flex justify-content-center">
          <Grid container spacing={2} className="d-flex justify-content-center">
            {viewShow_HTMLTABLE}
          </Grid>
        </Container>
        <InfiniteScroll
          dataLength={products.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={changeState}
          loader={
            <p className="text-center pt-5">
              <b>{t("loading")}</b>
            </p>
          }
          endMessage={
            <p style={{ textAlign: "center " }}>
              <b>{t("yay_you_have_seen_it_all")}</b>
            </p>
          }
        ></InfiniteScroll>
      </Container>
      <Footer
        title="Checkout Order"
        theme={custom}
        url={""}
        cart={cart}
        deliveryFees={deliveryFees}
      />
    </ThemeProvider>
  );
}
