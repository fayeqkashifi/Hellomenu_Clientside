import React, { useState } from "react";
import ProductDetails from "./Common/ProductDetails";
const MainDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const style = props.history.location.state.style;
  const id = atob(props.match.params.id);
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);
  const branch = props.history.location.state.branch;

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
        branch={branch}
      />
    );
  }

  return view;
};
export default MainDetails;
