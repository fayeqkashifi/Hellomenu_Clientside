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
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
var hold = 1;
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
    if (hold < categories.length) {
      getCategoriesBasedProduct(branchId).then((data) => {
        if (data[hold]?.sub_category_id === null) {
          setActiveCategory(
            data[hold]?.CategoryName + "-" + data[hold]?.category_id
          );
          getProductBasedOnCategory(data[hold]?.category_id).then((res) => {
            hold = hold + 1;
            setProducts(products.concat(res));
          });
        } else {
          setActiveCategory(
            data[hold]?.SubCategoryName + "-" + data[hold]?.sub_category_id
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
