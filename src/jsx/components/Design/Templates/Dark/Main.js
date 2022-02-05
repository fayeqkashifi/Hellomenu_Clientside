import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";

import ShowCards from "../Common/ShowCards";
import {
  getThemplate,
  getBranch,
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import { SecondStyle } from "../Common/Styles/Second";
import { DarkStyle } from "../Common/Styles/Dark";
var hold = 1;
export default function Main(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);

  const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
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
      setCategories(data);
      const category = data[0];
      if (category?.sub_category_id === null) {
        setActiveCategory(category?.CategoryName + category?.category_id);
        getProductBasedOnCategory(category?.category_id).then((data) => {
          setProducts(data);
        });
      } else {
        setActiveCategory(
          category?.SubCategoryName + category?.sub_category_id
        );
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
    if (hold < categories.length) {
      getCategoriesBasedProduct(branchId).then((data) => {
        if (data[hold]?.sub_category_id === null) {
          setActiveCategory(data[hold]?.CategoryName + data[hold]?.category_id);
          getProductBasedOnCategory(data[hold]?.category_id).then((res) => {
            hold = hold + 1;
            setProducts(products.concat(res));
          });
        } else {
          setActiveCategory(
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
  const template = "dark";
  var style = "";
  if (template === "dark") {
    style = DarkStyle(custom);
  } else if (template === "second") {
    style = SecondStyle(custom);
  }
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
      <Grid container spacing={2} className="d-flex justify-content-center">
        <ShowCards
          style={style}
          cart={cart}
          setCart={setCart}
          deliveryFees={deliveryFees}
          products={products}
          branch={branch}
        />
      </Grid>
    );
  }

  return (
    <div style={style?.background}>
      {/* <CssBaseline /> */}
      <Container maxWidth="lg">
        <Header
          cart={cart}
          setCart={setCart}
          branch={branch}
          categories={categories}
          activeCategory={activeCategory}
          setProducts={setProducts}
          setActiveCategory={setActiveCategory}
          style={style}
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
        style={style}
        cart={cart}
        branch={branch}
        setCart={setCart}
        deliveryFees={deliveryFees}
      />
    </div>
  );
}
