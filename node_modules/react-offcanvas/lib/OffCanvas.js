"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OffCanvas = function OffCanvas(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === undefined ? 250 : _ref$width,
      _ref$transitionDurati = _ref.transitionDuration,
      transitionDuration = _ref$transitionDurati === undefined ? 250 : _ref$transitionDurati,
      _ref$isMenuOpened = _ref.isMenuOpened,
      isMenuOpened = _ref$isMenuOpened === undefined ? false : _ref$isMenuOpened,
      _ref$position = _ref.position,
      position = _ref$position === undefined ? "left" : _ref$position,
      _ref$effect = _ref.effect,
      effect = _ref$effect === undefined ? "push" : _ref$effect,
      children = _ref.children;

  // transfer the <OffCanvas /> props to the children
  var transferProps = function transferProps(element) {
    return _react2.default.cloneElement(element, {
      width: width,
      transitionDuration: transitionDuration,
      isMenuOpened: isMenuOpened,
      position: position,
      effect: effect
    });
  };

  // transfer the props from OffCanvas to the child
  var offCanvasChildren = _react2.default.Children.map(children, transferProps);

  return _react2.default.createElement(
    "div",
    null,
    offCanvasChildren
  );
};

exports.default = OffCanvas;