import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SecondMain from "./Second/SecondMain";
import DarkMain from "./Dark/Main";
import {
  getThemplate,
  getBranch,
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
  const branchId = atob(props.match.params.id);
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);

  // const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [custom, setCustom] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const dataLoad = async () => {
    getThemplate(branchId).then((data) => {
      // console.log(data);
      setCustom(data);
    });
   
    getCategoriesBasedProduct(branchId).then((data) => {
      setCategories(data);
      const category = data[0];
      if (category?.sub_category_id === null) {
        setActiveCategory(category?.CategoryName + "-" + category?.category_id);
        getProductBasedOnCategory(category?.category_id).then((data) => {
          setProducts(data);
        });
      } else {
        setActiveCategory(
          category?.SubCategoryName + "-" + category?.sub_category_id
        );
        getProductBasedOnSubCategory(category?.sub_category_id).then((data) => {
          setProducts(data);
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, []);
  const properties = {
    // branch: branch,
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
