import React, { useState, useEffect } from "react";
import SecondMain from "./Second/SecondMain";
import DarkMain from "./Dark/Main";
import {
  getProductsBasedOnBranchId,
  getThemplate,
  getCategoriesBasedProduct,
  getThemes,
  getBranch,
} from "./Functionality";
import { SecondStyle } from "./Common/Styles/Second";
import { DarkStyle } from "./Common/Styles/Dark";
import { ThridStyle } from "./Common/Styles/Thrid";
import ThridMain from "./Thrid/Main";
import axios from "axios";
import { TemplateContext } from "./TemplateContext";
import { LanguagesContext } from "./LanguagesContext";
import uuid from "react-uuid";
import CustomAlert from "../../CustomAlert";

const MainPublic = (props) => {
  const [loading, setLoading] = useState(true);
  const branchId = atob(atob(atob(props.match.params.id)));
  let deliveryFees = parseInt(props.history.location.state?.deliveryFees);
  if (isNaN(deliveryFees)) {
    deliveryFees = 0;
  }
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All~~~1");
  const [template, setTemplate] = useState([]);
  const [theme, setTheme] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [languages, setLanguages] = useState(
    JSON.parse(sessionStorage.getItem("languages")) || []
  );
  const [selectedLang, setSelectedLang] = useState(
    JSON.parse(sessionStorage.getItem("selectedLang")) || {}
  );
  const [locale, setLocale] = useState(
    JSON.parse(sessionStorage.getItem("locale")) || []
  );
  const [wishlist, setWishList] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const dataLoad = async (input) => {
    setActiveCategory("All~~~1");
    let defaultLang;
    if (input === undefined) {
      if (languages.length === 0) {
        const res = await axios({
          method: "GET",
          url: `/api/getBranchLangs/${branchId}`,
          cancelToken: source.token,
        });
        if (res != undefined) {
          if (res.data.status === 200) {
            setLanguages(res.data.fetchData);
            sessionStorage.setItem(
              "languages",
              JSON.stringify(res.data.fetchData)
            );
          }
          defaultLang = res?.data?.fetchData?.filter((item) => {
            if (item.default == 1) {
              setLocale(JSON.parse(item.locale));
              sessionStorage.setItem("locale", item.locale);
              return item;
            }
          })[0];
        }
      } else {
        defaultLang = JSON.parse(sessionStorage.getItem("selectedLang"));
      }
    }
    let page = 1;
    await getCategoriesBasedProduct(
      branchId,
      input === undefined ? defaultLang?.id : input.id,
      source
    ).then((data) => {
      setCategories(data);
    });
    await getProductsBasedOnBranchId(
      branchId,
      page,
      input === undefined ? defaultLang?.id : input.id,
      source
    ).then((data) => {
      if (data !== undefined) {
        setLastPage(data?.last_page);
        setProducts(data.data);
        setPage(page + 1);
        setLoading(false);
      }
    });
  };

  let source = axios.CancelToken.source();
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    getThemplate(branchId, source).then((data) => {
      if (data !== undefined) {
        setTemplate(data);
      }
    });
    getThemes(branchId, source).then((data) => {
      if (data !== undefined) {
        setTheme(data);
      }
    });
    getBranch(branchId, source).then((data) => {
      if (data !== undefined) {
        setBranch(data);
      }
    });
    if (localStorage.getItem("uniqueId") === null) {
      localStorage.setItem("uniqueId", btoa(uuid()));
    }
    dataLoad();

    return () => {
      source.cancel();
      setLoading(true);
      setCategories([]);
      setProducts([]);
      setActiveCategory("All~~~1");
      setPage(1);
      setLastPage(0);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [selectedLang]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  var view = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only"></span>
      </div>
    );
  } else {
    if (template?.checkTemplate === "dark") {
      view = <DarkMain />;
    } else if (template?.checkTemplate === "second") {
      view = <SecondMain />;
    } else if (template?.checkTemplate === "thrid") {
      view = <ThridMain />;
    }
  }

  return (
    <TemplateContext.Provider
      value={{
        products,
        style:
          template?.checkTemplate === "dark"
            ? DarkStyle(template?.Customization, theme)
            : template?.checkTemplate === "second"
            ? SecondStyle(template?.Customization, theme)
            : template?.checkTemplate === "thrid"
            ? ThridStyle(template?.Customization, theme)
            : console.log("style Error in Mainpublic file"),
        branchId,
        branch,
        categories,
        activeCategory,
        setActiveCategory,
        setProducts,
        setPage,
        page,
        lastPage,
        setLastPage,
        selectedLang,
        cart,
        setCart,
        deliveryFees,
        languages,
        setSelectedLang,
        locale,
        setLocale,
        wishlist,
        setWishList,
        setAlerts,
      }}
    >
      <LanguagesContext.Provider
        value={{
          dataLoad,
        }}
      >
        {alert.open && (
          <CustomAlert
            vertical="top"
            horizontal="right"
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            setAlert={setAlert}
          />
        )}
        {view}
      </LanguagesContext.Provider>
    </TemplateContext.Provider>
  );
};
export default MainPublic;
