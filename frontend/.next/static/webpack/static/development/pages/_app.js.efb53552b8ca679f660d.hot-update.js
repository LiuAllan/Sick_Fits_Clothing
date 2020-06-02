webpackHotUpdate("static\\development\\pages\\_app.js",{

/***/ "./components/CartCount.js":
/*!*********************************!*\
  !*** ./components/CartCount.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-transition-group */ "./node_modules/react-transition-group/index.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_transition_group__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "C:\\Users\\Alllan\\Documents\\GitHub\\Sick_Fits_Clothing\\frontend\\components\\CartCount.js";




var Dot = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].div.withConfig({
  displayName: "CartCount__Dot",
  componentId: "xxvp4g-0"
})(["background:", ";color:white;border-radius:50%;padding:0.5rem;line-height:2rem;min-width:3rem;margin-left:1rem;font-weight:100;font-feature-settings:'tnum';fon-variant-numeric:tabular-nums;"], function (props) {
  return props.theme.red;
});
var AnimationStyles = styled_components__WEBPACK_IMPORTED_MODULE_2__["default"].span.withConfig({
  displayName: "CartCount__AnimationStyles",
  componentId: "xxvp4g-1"
})(["position:relative;.count{display:block;position:relative;transition:all 0.4s;backface-visibility:hidden;}.count-enter{transform:scale(2) rotateX(0.5turn);}.count-enter-active{transform:rotateX(0);}.count-exit{top:0;position:absolute;transform:rotateX(0);}.count-exit-active{transform:scale(2) rotateX(0.5turn);}"]); //Cart counter animation. Doubles the dot when the counter increments for 4 seconds before going to the new value

var CartCount = function CartCount(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AnimationStyles, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_3__["TransitionGroup"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_3__["CSSTransition"], {
    unmountOnExit: true,
    className: "count",
    classNames: "count",
    key: props.count,
    timeout: {
      enter: 400,
      exit: 400
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Dot, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, props.count))));
}; // This destructured props
// const CartCount =({ count }) => (
// 	<Dot>{count}</Dot>
// );


/* harmony default export */ __webpack_exports__["default"] = (CartCount);

/***/ })

})
//# sourceMappingURL=_app.js.efb53552b8ca679f660d.hot-update.js.map