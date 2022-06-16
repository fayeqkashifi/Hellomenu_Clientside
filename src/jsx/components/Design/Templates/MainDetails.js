import React, { useState, useEffect, useContext } from "react";
import ProductDetails from "./Common/ProductDetails";
import { TemplateContext } from "./TemplateContext";
import { LanguagesContext } from "./LanguagesContext";
import { getProduct } from "./Functionality";
import axios from "axios";

const MainDetails = (props) => {
  const { selectedLang } = useContext(TemplateContext);

  // const style = props.history.location.state.style;
  const id = atob(atob(atob(props.match.params.id)));

  // const deliveryFees = parseInt(props.history.location.state.deliveryFees);
  // const branchId = props.history.location.state.branchId;
  // const languages = JSON.parse(sessionStorage.getItem("languages"));
  // const [selectedLang, setSelectedLang] = useState(
  //   JSON.parse(sessionStorage.getItem("selectedLang")) || {}
  // );
  // const [cart, setCart] = useState(
  //   JSON.parse(localStorage.getItem("cart")) || []
  // );
  // const [locale, setLocale] = useState(
  //   JSON.parse(sessionStorage.getItem("locale")) || []
  // );
  // const [wishlist, setWishList] = useState(
  //   JSON.parse(localStorage.getItem("wishlist")) || []
  // );
  const [productIngredients, setProductIntgredients] = useState([]);
  const [extra, setExtra] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  let source = axios.CancelToken.source();
  const dataLoad = (input) => {
    getProduct(id, input.id, source).then((result) => {
      if (result !== undefined) {
        setFetchData(result.data.fetchData[0]);
        setProductIntgredients(result.data.ingredients);
        setExtra(result.data.extras);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoad(selectedLang);
    return () => {
      source.cancel();
      setProductIntgredients([]);
      setExtra([]);
      setFetchData([]);
      setLoading(true);
    };
  }, []);
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
    return (
      <LanguagesContext.Provider
        value={{
          dataLoad,
        }}
      >
        <ProductDetails
          id={id}
          fetchData={fetchData}
          setFetchData={setFetchData}
          extra={extra}
          productIngredients={productIngredients}
        />
      </LanguagesContext.Provider>
    );
  }
};
export default MainDetails;
