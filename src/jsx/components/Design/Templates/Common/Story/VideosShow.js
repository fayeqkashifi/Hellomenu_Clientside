import React from "react";
import ProductsStory from "./ProductsStory";
import BranchStory from "./BranchStory";
import { TemplateContext } from "../../TemplateContext";

function VideosShow(props) {
  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const product_id = props.history.location.state.product_id;
  const branchState = props.history.location.state.branchState;
  const categories = props.history.location.state.categories;
  const deliveryFees = props.history.location.state.deliveryFees;
  const branchStory = props.history.location.state.branchStory;
  const selectedLang =
    JSON.parse(sessionStorage.getItem(btoa("selectedLang" + branch.id))) || {};
  return (
    <TemplateContext.Provider
      value={{
        style,
        branchStory,
        branch,
        deliveryFees,
        categories,
        product_id,
        selectedLang,
      }}
    >
      {branchState ? <BranchStory /> : <ProductsStory />}
    </TemplateContext.Provider>
  );
}

export default VideosShow;
