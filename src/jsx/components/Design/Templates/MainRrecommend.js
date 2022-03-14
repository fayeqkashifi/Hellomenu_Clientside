import React, { useState } from "react";
import OrderDetails from "./Common/OrderDetails";
const MainRrecommend = (props) => {
  const [loading, setLoading] = useState(false);
  const style = props.history.location.state.style;
  const id = atob(atob(atob(props.match.params.id)));

  const deliveryFees = props.history.location.state.deliveryFees;
  const branchId = props.history.location.state.branchId;
  const productName = props.history.location.state.productName;
  const picture = props.history.location.state.picture;
  const stock = props.history.location.state.stock;
  const price = props.history.location.state.price;
  const orignalPrice = props.history.location.state.orignalPrice;
  const orignalStock = props.history.location.state.orignalStock;
  const countryCode = props.history.location.state.countryCode;
  const extraValue = props.history.location.state.extraValue;
  const ingredients = props.history.location.state.ingredients;
  const skuarray = props.history.location.state.skuarray;
  const activeSKU = props.history.location.state.activeSKU;

  var view = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only"></span>
      </div>
    );
  } else {
    view = (
      <OrderDetails
        id={id}
        style={style}
        deliveryFees={deliveryFees}
        branchId={branchId}
        productName={productName}
        picture={picture}
        stock={stock}
        price={price}
        orignalPrice={orignalPrice}
        orignalStock={orignalStock}
        countryCode={countryCode}
        extraValue={extraValue}
        ingredients={ingredients}
        skuarray={skuarray}
        activeSKU={activeSKU}
      />
    );
  }

  return view;
};
export default MainRrecommend;
