import React, { Component } from "react";

/// Link
import { Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";
import { withTranslation  } from "react-i18next";
// const { t } = useTranslation();

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
      const { t } = this.props;
      /// Path
      const path = window.location.pathname;
      // console.log(path);
      /// Active menu
      let dashBoard = [
            "dashboard",
         ],
         branch = [
            "branches",
         ],
         orders = [
            "orders",
         ],
         baskets=[
            "baskets",

         ],
         Companies = [
            "companies",
         ];
         // console.log(dashBoard.includes(path.slice(1)));
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
                        <span className="nav-text">{t('dashboard')}</span>
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
                        <span className="nav-text">{t('branches')}</span>
                     </Link>
                    
                  </li>
                  <li
                     className={`${
                        orders.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/orders"
                        
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">{t('orders')}</span>
                     </Link>
                  </li>
                  <li
                     className={`${
                        baskets.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/baskets"
                        
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">{t('baskets')}</span>
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
                        <span className="nav-text">{t('companies')}</span>
                     </Link>
                    
                  </li>
                  
                  
               </MM>
            </PerfectScrollbar>
         </div>
      );
   }
}

export default withTranslation()(SideBar);
