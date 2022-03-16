import React, { useState } from "react";
import Container from "@mui/material/Container";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import SideBar from "../Common/SideBar";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";

import ShowCards from "../Common/ShowCards";
import {
  getProductsBasedOnBranchId,
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
export default function ThridMain(props) {
  const { t } = useTranslation();
  const {
    branchId,
    products,
    style,
    cart,
    setCart,
    deliveryFees,
    categories,
    activeCategory,
    setActiveCategory,
    setProducts,
    setPage,
    page,
    lastPage,
    setLastPage,
  } = props;
  const properties = {
    branchId: branchId,
    deliveryFees: deliveryFees,
    setCart: setCart,
    cart: cart,
    style: style,
  };
  const [changeState, setChangeState] = useState(true);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      if (activeCategory === "All~~~1") {
        getProductsBasedOnBranchId(branchId, page).then((data) => {
          setProducts(products.concat(data.data));
          setPage(page + 1);
        });
      } else {
        const data = activeCategory?.split("~~~");
        if (data[1] === "cate") {
          getProductBasedOnCategory(data[2], page).then((data) => {
            setProducts(products.concat(data.data));
            setPage(page + 1);
          });
        } else if (data[1] === "sub") {
          getProductBasedOnSubCategory(data[2], page).then((res) => {
            setProducts(products.concat(res.data));
            setPage(page + 1);
          });
        }
      }
    } else {
      setChangeState(false);
    }
  };
  var viewShow_HTMLTABLE = (
    <Grid container spacing={2} className="d-flex justify-content-center">
      <ShowCards {...properties} products={products} />
    </Grid>
  );

  return (
    <div style={style?.background}>
      <Container maxWidth="lg">
        <Header
          {...properties}
          categories={categories}
          activeCategory={activeCategory}
          setProducts={setProducts}
          setActiveCategory={setActiveCategory}
        />
        <SideBar
          style={style}
          branchId={branchId}
          categories={categories}
          activeCategory={activeCategory}
          setProducts={setProducts}
          setActiveCategory={setActiveCategory}
        />
        <Container
          className="mt-3 d-flex justify-content-center"
          style={style?.varaintContainer}
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
    </div>
  );
}
