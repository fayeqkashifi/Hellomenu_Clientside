import React from "react";
import ProductsStory from "./ProductsStory";
import BranchStory from "./BranchStory";

function Show(props) {
  const product_id = props.history.location.state.product_id;
  const branchState = props.history.location.state.branchState;
  const branchStory = props.history.location.state.branchStory;

  return branchState ? (
    <BranchStory branchStory={branchStory} />
  ) : (
    <ProductsStory product_id={product_id} />
  );
}

export default Show;
