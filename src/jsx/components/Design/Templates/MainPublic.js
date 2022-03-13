import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SecondMain from "./Second/SecondMain";
import DarkMain from "./Dark/Main";
import {
  getProductsBasedOnBranchId,
  getThemplate,
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "./Functionality";
import { SecondStyle } from "./Common/Styles/Second";
import { DarkStyle } from "./Common/Styles/Dark";
import { ThridStyle } from "./Common/Styles/Thrid";
import ThridMain from "./Thrid/Main";
const MainPublic = (props) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(atob(atob(props.match.params.id)));
  let deliveryFees = parseInt(props.history.location.state?.deliveryFees);
  if (isNaN(deliveryFees)) {
    deliveryFees = 0;
  }
  // console.log(deliveryFees == NaN ? 0 : deliveryFees);
  // const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All~~~1");
  const [custom, setCustom] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const dataLoad = async () => {
    getThemplate(branchId).then((data) => {
      // console.log(data);
      setCustom(data);
    });
    getCategoriesBasedProduct(branchId).then((data) => {
      setCategories(data);
    });
    getProductsBasedOnBranchId(branchId, page).then((data) => {
      setLastPage(data.last_page);
      setProducts(data.data);
      setPage(page + 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    dataLoad();
    return () => {
      setCustom([]);
      setCategories([]);
      setActiveCategory(0);
      setProducts([]);
      setLoading(true);
    };
  }, []);
  const properties = {
    lastPage: lastPage,
    setLastPage: setLastPage,
    page: page,
    setPage: setPage,

    branchId: branchId,
    deliveryFees: deliveryFees,
    activeCategory: activeCategory,
    setActiveCategory: setActiveCategory,
    categories: categories,
    products: products,
    setCart: setCart,
    setProducts: setProducts,
    cart: cart,
  };
  var view = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    if (custom.checkTemplate === "dark") {
      view = (
        <DarkMain {...properties} style={DarkStyle(custom?.Customization)} />
      );
    } else if (custom.checkTemplate === "second") {
      view = (
        <SecondMain
          {...properties}
          style={SecondStyle(custom?.Customization)}
        />
      );
    } else if (custom.checkTemplate === "thrid") {
      view = (
        <ThridMain {...properties} style={ThridStyle(custom?.Customization)} />
      );
    }
  }

  return view;
};
export default MainPublic;
