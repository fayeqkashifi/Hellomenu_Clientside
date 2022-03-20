import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ShowCards from "../Common/ShowCards";
import SideBar from "../Common/SideBar";
import Header from "../Common/Header";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import Statusbar from "../Common/Statusbar";

export default function SecondMain(props) {
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
  return (
    <div style={style?.background}>
      <Header
        {...properties}
        categories={categories}
        activeCategory={activeCategory}
        setProducts={setProducts}
        setActiveCategory={setActiveCategory}
      />

      <div style={style?.sidebarMainDiv}>
        <Card style={style?.sidebarCard}>
          <SideBar
            branchId={branchId}
            style={style}
            categories={categories}
            activeCategory={activeCategory}
            setProducts={setProducts}
            setActiveCategory={setActiveCategory}
          />
        </Card>
        <Grid
          container
          spacing={2}
          style={{
            minHeight: "80vh",
            maxWidth: "90%",
            marginLeft: "10%",
          }}
        >
          <Statusbar
            {...properties}
            products={products}
            categories={categories}
          />

          <ScrollContainer
            className="scroll-container row align-items-center justify-content-center"
            // style={{ marginRight: "150px" }}
          >
            <Toolbar>
              <ShowCards {...properties} products={products} />
            </Toolbar>
          </ScrollContainer>
        </Grid>
      </div>
    </div>
  );
}
