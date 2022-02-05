import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import HorizontalScroller from "react-horizontal-scroll-container";
import ShowCards from "../Common/ShowCards";
import SideBar from "../Common/SideBar";
import Header from "../Common/Header";

export default function SecondMain(props) {
  const {
    branch,
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

  return (
    <div style={style?.background}>
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
