import React from "react";
import PropTypes from "prop-types";

const CSRFInput = ({
  token
}) => {
  return /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_token",
    value: token
  });
};

CSRFInput.propTypes = {
  token: PropTypes.string.isRequired
};
export default CSRFInput;