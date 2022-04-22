import React, { useState, useEffect } from "react";
import ProductDetails from "./Common/ProductDetails";
import { TemplateContext } from "./TemplateContext";
import { getProduct } from "./Functionality";

const MainDetails = (props) => {
  const style = props.history.location.state.style;
  const id = atob(atob(atob(props.match.params.id)));
  const deliveryFees = parseInt(props.history.location.state.deliveryFees);
  const branchId = props.history.location.state.branchId;
  const languages = JSON.parse(sessionStorage.getItem("languages"));
  const [selectedLang, setSelectedLang] = useState(
    JSON.parse(sessionStorage.getItem("selectedLang")) || {}
  );
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [locale, setLocale] = useState(
    JSON.parse(sessionStorage.getItem("locale")) || []
  );
  const [productIngredients, setProductIntgredients] = useState([]);
  const [extra, setExtra] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async (input) => {
    await getProduct(id, input.id).then((result) => {
      setFetchData(result.data.fetchData[0]);
      setProductIntgredients(result.data.ingredients);
      setExtra(result.data.extras);
      setLoading(false);
    });
  };
  useEffect(() => {
    dataLoad(selectedLang);
    return () => {
      setProductIntgredients([]);
      setExtra([]);
      setFetchData([]);
      setLoading(true);
    };
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        id,
        style,
        deliveryFees,
        branchId,
        languages,
        selectedLang,
        setSelectedLang,
        cart,
        setCart,
        setLocale,
        locale,
        loading,
        fetchData,
        setFetchData,
        extra,
        productIngredients,
        dataLoad,
      }}
    >
      <ProductDetails />
    </TemplateContext.Provider>
  );
};
export default MainDetails;
