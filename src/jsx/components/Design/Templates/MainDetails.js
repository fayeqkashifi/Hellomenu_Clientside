import React, { useState } from "react";
import ProductDetails from "./Common/ProductDetails";
const MainDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const style = props.history.location.state.style;
  const id = atob(atob(atob(props.match.params.id)));
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);
  const branchId = props.history.location.state.branchId;
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
      <ProductDetails
        id={id}
        style={style}
        deliveryFees={deliveryFees}
        branchId={branchId}
      />
    );
  }

  return view;
};
export default MainDetails;
