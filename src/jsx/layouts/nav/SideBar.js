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
         menus = [
            "menu",
         ],
         bootstrap = [
            "ui-accordion",
           
         ],
         plugins = [
            "uc-select2",
            
         ],
         widget = ["widget"],
         forms = [
            "form-element",
           
         ],
         table = ["table-bootstrap-basic", "table-datatable-basic"];

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
                        menus.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to="/menu"
                        
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">Menus</span>
                     </Link>
                    
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
