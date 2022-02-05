import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import SecondMain from "./Second/SecondMain";
import {
  getThemplate,
  getBranch,
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "./Functionality";
const MainPublic = (props) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  // const deliveryFees = parseInt(props.history.location.state.deliveryFees);

  const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [custom, setCustom] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const dataLoad = () => {
    getThemplate(branchId).then((data) => {
      setCustom(data);
    });
    getBranch(branchId).then((data) => {
      setBranch(data);
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
  // const lengthArray = cart.length;
  useEffect(() => {
    let unmounted = false;
    dataLoad();
    return () => {
      unmounted = true;
    };
  }, []);
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
    view = (
      <>
        <SecondMain
          branchId={branch.id}
          branch={branch}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          products={products}
          setCart={setCart}
          setProducts={setProducts}
          cart={cart}
          custom={custom}
          deliveryFees={0}
        />
      </>
    );
  }

  return view;
};
export default MainPublic;
