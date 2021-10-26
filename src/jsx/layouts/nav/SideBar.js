import React, { Component } from "react";

/// Link
import { Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";

class MM extends Component {
   componentDidMount() {
      this.$el = this.el;
      this.mm = new MetisMenu(this.$el);
   }
   componentWillUnmount() {
      this.mm("dispose");
   }
   render() {
      return (
         <div className="mm-wrapper">
            <ul className="metismenu" ref={(el) => (this.el = el)}>
               {this.props.children}
            </ul>
         </div>
      );
   }
}

class SideBar extends Component {
   /// Open menu
   componentDidMount() {
      // sidebar open/close
      var btn = document.querySelector(".nav-control");
      var aaa = document.querySelector("#main-wrapper");

      function toggleFunc() {
         return aaa.classList.toggle("menu-toggle");
      }

      btn.addEventListener("click", toggleFunc);
   }
   render() {
      /// Path
      const path = window.location.pathname;

      /// Active menu
      let dashBoard = [
            "dashboard",
         ],
         branch = [
            "branches",
         ],
         categories = [
            "category",
         ],
         Companies = [
            "companies",
         ],
         Products = [
            "products",
         ];
         console.log(path.slice(1));
      return (
         <div className="deznav">
            <PerfectScrollbar className="deznav-scroll">
               <MM className="metismenu" id="menu">
                  <li
                     className={`${
                        dashBoard.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/dashboard"
                     >
                        <i className="flaticon-381-networking"></i>
                        <span className="nav-text">Dashboard</span>
                     </Link>
                     
                  </li>
                  <li
                     className={`${
                        branch.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/branches"
                     >
                        <i className="flaticon-381-television"></i>
                        <span className="nav-text">Branches</span>
                     </Link>
                    
                  </li>
                  <li
                     className={`${
                        categories.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/category"
                        
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">Menus</span>
                     </Link>
                    
                  </li>
                  <li
                     className={`${
                        Companies.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/companies"
                        
                     >
                        <i className="flaticon-381-internet"></i>
                        <span className="nav-text">Companies</span>
                     </Link>
                    
                  </li>
                  <li
                     className={`${
                        Products.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/products"
                     >
                        <i className="flaticon-381-internet"></i>
                        <span className="nav-text">Products</span>
                     </Link>
                    
                  </li>
                  
               </MM>
            </PerfectScrollbar>
         </div>
      );
   }
}

export default SideBar;
