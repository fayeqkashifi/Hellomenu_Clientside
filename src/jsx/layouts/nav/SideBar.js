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
      let deshBoard = [
            "",
            "analytics",
            "companies",
            "statistics",
			
         ],
         app = [
            "app-profile",
            "app-calender",
            "email-compose",
            "email-inbox",
            "email-read",
            "ecom-product-grid",
            "ecom-product-list",
            "ecom-product-list",
            "ecom-product-order",
            "ecom-checkout",
            "ecom-invoice",
            "ecom-customers",
         ],
         charts = [
            "chart-morris",
            "chart-chartjs",
            "chart-chartist",
            "chart-sparkline",
            "chart-peity",
         ],
         bootstrap = [
            "ui-accordion",
            "ui-badge",
            "ui-alert",
            "ui-button",
            "ui-modal",
            "ui-button-group",
            "ui-list-group",
            "ui-media-object",
            "ui-card",
            "ui-carousel",
            "ui-dropdown",
            "ui-popover",
            "ui-progressbar",
            "ui-tab",
            "ui-typography",
            "ui-pagination",
            "ui-grid",
         ],
         plugins = [
            "uc-select2",
            "uc-nestable",
            "uc-sweetalert",
            "uc-toastr",
            "uc-jqvmap",
            "uc-noui-slider",
         ],
         widget = ["widget"],
         forms = [
            "form-element",
            "form-wizard",
            "form-editor-summernote",
            "form-pickers",
            "form-validation-jquery",
         ],
         table = ["table-bootstrap-basic", "table-datatable-basic"];

      return (
         <div className="deznav">
            <PerfectScrollbar className="deznav-scroll">
               <MM className="metismenu" id="menu">
                  <li
                     className={`${
                        deshBoard.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/"
                        
                     >
                        <i className="flaticon-381-networking"></i>
                        <span className="nav-text">Dashboard</span>
                     </Link>
                     
                  </li>
                  <li
                     className={`${
                        app.includes(path.slice(1)) ? "mm-active" : ""
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
                        charts.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">Menus</span>
                     </Link>
                     <ul >
                        <li>
                           <Link to="/chart-rechart">Test one</Link>
                        </li>
                     </ul>
                  </li>
                  <li
                     className={`${
                        bootstrap.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        
                     >
                        <i className="flaticon-381-internet"></i>
                        <span className="nav-text">Design</span>
                     </Link>
                     <ul >
                        <li>
                           <Link to="/ui-accordion">Test one</Link>
                        </li>
                     </ul>
                  </li>
                  <li
                     className={`${
                        plugins.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        
                     >
                        <i className="flaticon-381-heart"></i>
                        <span className="nav-text">Orders</span>
                     </Link>
                     <ul >
                        <li>
                           <Link to="/uc-select2">Orders</Link>
                        </li>
                        <li>
                           <Link to="/uc-nestable">Tables</Link>
                        </li>
                        <li>
                           <Link to="/uc-noui-slider">Waiters</Link>
                        </li>
                        <li>
                           <Link to="/uc-sweetalert">Modifiers</Link>
                        </li>
                     </ul>
                  </li>
                  <li
                     className={`${
                        widget.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        to="widget-basic"
                        className="ai-icon"
                        
                     >
                        <i className="flaticon-381-settings-2"></i>
                        <span className="nav-text">Feedback</span>
                     </Link>
                  </li>
                  <li
                     className={`${
                        forms.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        
                     >
                        <i className="flaticon-381-notepad"></i>
                        <span className="nav-text forms">Feedback</span>
                     </Link>
                     <ul >
                        <li>
                           <Link to="/form-element">Survey forms</Link>
                        </li>
                        <li>
                           <Link to="/form-wizard">Survey result</Link>
                        </li>
                     </ul>
                  </li>
                  <li
                     className={`${
                        table.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        
                     >
                        <i className="flaticon-381-network"></i>
                        <span className="nav-text">Settings</span>
                     </Link>
                     <ul >
                        <li>
                           <Link to="table-bootstrap-basic">Test one</Link>
                        </li>
                     </ul>
                  </li>
               </MM>
            </PerfectScrollbar>
         </div>
      );
   }
}

export default SideBar;
