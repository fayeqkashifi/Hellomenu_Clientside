import React, { Component } from "react";

/// Link
import { Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";
import { withTranslation } from "react-i18next";
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
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname.replace(/^\/([^\/]*).*$/, "$1"),
    };
  }
  render() {
    const { t } = this.props;
    return (
      <div className="deznav">
        <PerfectScrollbar className="deznav-scroll">
          <MM className="metismenu" id="menu">
            <li
              className={`${
                this.state.path === "dashboard" ? "mm-active" : ""
              }`}
            >
              <Link
                className="ai-icon"
                to="/dashboard"
                onClick={() => this.setState({ path: "dashboard" })}
              >
                <i className="flaticon-381-networking"></i>
                <span className="nav-text">{t("dashboard")}</span>
              </Link>
            </li>
            <li
              className={`${this.state.path === "company" ? "mm-active" : ""}`}
            >
              <Link
                className="ai-icon"
                to="/company"
                onClick={() => this.setState({ path: "company" })}
              >
                <i className="flaticon-381-internet"></i>
                <span className="nav-text">{t("company")}</span>
              </Link>
            </li>
            <li
              className={`${this.state.path === "branches" ? "mm-active" : ""}`}
            >
              <Link
                className="ai-icon"
                to="/branches"
                onClick={() => this.setState({ path: "branches" })}
              >
                <i className="flaticon-381-television"></i>
                <span className="nav-text">{t("branches")}</span>
              </Link>
            </li>
            <li
              className={`${
                this.state.path === "attributes" ? "mm-active" : ""
              }`}
            >
              <Link
                className="ai-icon"
                to="/attributes"
                onClick={() => this.setState({ path: "attributes" })}
              >
                <i className="flaticon-381-list"></i>
                <span className="nav-text">{t("attributes")}</span>
              </Link>
            </li>
            <li
              className={`${
                this.state.path === "ingredients" ? "mm-active" : ""
              }`}
            >
              <Link
                className="ai-icon"
                to="/ingredients"
                onClick={() => this.setState({ path: "ingredients" })}
              >
                <i className="flaticon-381-pad"></i>
                <span className="nav-text">{t("ingredients")}</span>
              </Link>
            </li>
            <li className={`${this.state.path === "areas" ? "mm-active" : ""}`}>
              <Link
                className="ai-icon"
                to="/areas"
                onClick={() => this.setState({ path: "areas" })}
              >
                <i className="flaticon-381-location"></i>
                <span className="nav-text">{t("areas")}</span>
              </Link>
            </li>

            <li
              className={`${this.state.path === "orders" ? "mm-active" : ""}`}
            >
              <Link
                className="ai-icon"
                to="/orders"
                onClick={() => this.setState({ path: "orders" })}
              >
                <i className="flaticon-381-plus"></i>
                <span className="nav-text">{t("orders")}</span>
              </Link>
            </li>
            <li
              className={`${this.state.path === "settings" ? "mm-active" : ""}`}
            >
              <Link
                className="ai-icon"
                to="/settings"
                onClick={() => this.setState({ path: "settings" })}
              >
                <i className="flaticon-381-settings-2"></i>
                <span className="nav-text">{t("settings")}</span>
              </Link>
            </li>
          </MM>
        </PerfectScrollbar>
      </div>
    );
  }
}

export default withTranslation()(SideBar);
