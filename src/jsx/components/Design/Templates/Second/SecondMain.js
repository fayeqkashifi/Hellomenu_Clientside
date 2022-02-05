import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useTranslation } from "react-i18next";

import HorizontalScroller from "react-horizontal-scroll-container";
import ShowCards from "../Common/ShowCards";
import SideBar from "../Common/SideBar";
import Header from "../Common/Header";
import { SecondStyle } from "../Common/Styles/Second";
import { DarkStyle } from "../Common/Styles/Dark";

export default function SecondMain(props) {
  const {
    branchId,
    branch,
    products,
    custom,
    cart,
    setCart,
    deliveryFees,
    categories,
    activeCategory,
    setActiveCategory,
    setProducts,
  } = props;
  const template = "second";
  var style = "";
  if (template === "dark") {
    style = DarkStyle(custom);
  } else if (template === "second") {
    style = SecondStyle(custom);
  }
  return (
    <div>
      <Header
        template="second"
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
      <div style={style?.sidebarMainDiv}>
        <Card style={style?.sidebarCard}>
          <SideBar
            style={style}
            categories={categories}
            activeCategory={activeCategory}
            setProducts={setProducts}
            setActiveCategory={setActiveCategory}
          />
        </Card>
        <Grid container spacing={2}>
          <HorizontalScroller>
            <ShowCards
              style={style}
              cart={cart}
              setCart={setCart}
              deliveryFees={deliveryFees}
              products={products}
              branch={branch}
            />
          </HorizontalScroller>
        </Grid>
      </div>
    </div>
  );
}
