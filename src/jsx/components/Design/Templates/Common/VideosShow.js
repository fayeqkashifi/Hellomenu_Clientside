import React from "react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import ProductsStory from "./ProductsStory";
import BranchStory from "./BranchStory";

function VideosShow(props) {
  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const product_id = props.history.location.state.product_id;
  const branchState = props.history.location.state.branchState;
  const categories = props.history.location.state.categories;
  const deliveryFees = props.history.location.state.deliveryFees;

  return branchState ? (
    <BranchStory style={style} branch={branch} deliveryFees={deliveryFees} />
  ) : (
    <ProductsStory
      style={style}
      branch={branch}
      categories={categories}
      deliveryFees={deliveryFees}
      product_id={product_id}
    />
  );
}

export default VideosShow;
