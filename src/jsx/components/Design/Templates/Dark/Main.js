import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Counter from "../Common/Counter";
import ShowCards from "../Common/ShowCards";
import {
  getThemplate,
  getBranch,
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
var hold = 1;
export default function Main(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);

  const [branch, setBranch] = useState([]);
  const [menu, setMenu] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [custom, setCustom] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const dataLoad = () => {
    getThemplate(branchId).then((data) => {
      setCustom(data);
    });
    getBranch(branchId).then((data) => {
      setBranch(data);
    });
    getCategoriesBasedProduct(branchId).then((data) => {
      setMenu(data);
      const category = data[0];
      if (category?.sub_category_id === null) {
        setActiveMenu(category?.CategoryName + category?.category_id);
        getProductBasedOnCategory(category?.category_id).then((data) => {
          setProducts(data);
        });
      } else {
        setActiveMenu(category?.SubCategoryName + category?.sub_category_id);
        getProductBasedOnSubCategory(category?.sub_category_id).then((data) => {
          setProducts(data);
        });
      }
      setLoading(false);
    });
  };
  // const lengthArray = cart.length;
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, [cart.length]);

  const [changeState, setChangeState] = useState(true);
  const fetchMoreData = () => {
    if (hold < menu.length) {
      getCategoriesBasedProduct(branchId).then((data) => {
        if (data[hold]?.sub_category_id === null) {
          setActiveMenu(data[hold]?.CategoryName + data[hold]?.category_id);
          getProductBasedOnCategory(data[hold]?.category_id).then((res) => {
            hold = hold + 1;
            setProducts(products.concat(res));
          });
        } else {
          setActiveMenu(
            data[hold]?.SubCategoryName + data[hold]?.sub_category_id
          );
          getProductBasedOnSubCategory(data[hold]?.sub_category_id).then(
            (value) => {
              hold = hold + 1;
              setProducts(products.concat(value));
            }
          );
        }
      });
    } else {
      setChangeState(false);
    }
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
    viewShow_HTMLTABLE = (
      <ShowCards
        custom={custom}
        cart={cart}
        setCart={setCart}
        deliveryFees={deliveryFees}
        products={products}
        branch={branch}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          cart={cart}
          setCart={setCart}
          branch={branch}
          menu={menu}
          activeMenu={activeMenu}
          setProducts={setProducts}
          setActiveMenu={setActiveMenu}
          custom={custom}
          deliveryFees={deliveryFees}
        />

        <Container
          className="mt-3 d-flex justify-content-center"
          style={{ marginBottom: "50px" }}
        >
          {viewShow_HTMLTABLE}
        </Container>
        <InfiniteScroll
          dataLength={products.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={changeState}
          loader={
            <p className="text-center py-4" style={{ marginBottom: "100px" }}>
              <b>{t("loading")}</b>
            </p>
          }
          endMessage={
            <p
              style={{ textAlign: "center", marginBottom: "100px" }}
              className="py-4"
            >
              <b>{t("yay_you_have_seen_it_all")}</b>
            </p>
          }
        ></InfiniteScroll>
      </Container>
      <Footer
        title="Checkout Order"
        theme={custom}
        cart={cart}
        branch={branch}
        setCart={setCart}
        deliveryFees={deliveryFees}
      />
    </ThemeProvider>
  );
}
