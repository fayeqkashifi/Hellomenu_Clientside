import React, { useState, useEffect } from "react";
import OrderDetails from "./Common/OrderDetails";
import { TemplateContext } from "./TemplateContext";
import { getProduct } from "./Functionality";

const MainRrecommend = (props) => {
  const [loading, setLoading] = useState(false);
  const style = props.history.location.state.style;
  const id = atob(atob(atob(props.match.params.id)));

  const deliveryFees = props.history.location.state.deliveryFees;
  const branchId = props.history.location.state.branchId;
  const productName = props.history.location.state.productName;
  const picture = props.history.location.state.picture;
  const stock = props.history.location.state.stock;
  const price = props.history.location.state.price;
  const orignalPrice = props.history.location.state.orignalPrice;
  const orignalStock = props.history.location.state.orignalStock;
  const countryCode = props.history.location.state.countryCode;
  const extraValue = props.history.location.state.extraValue;
  const ingredients = props.history.location.state.ingredients;
  const skuarray = props.history.location.state.skuarray;
  const activeSKU = props.history.location.state.activeSKU;
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const languages = JSON.parse(sessionStorage.getItem("languages"));
  const [selectedLang, setSelectedLang] = useState(
    JSON.parse(sessionStorage.getItem("selectedLang")) || {}
  );
  const [locale, setLocale] = useState(
    JSON.parse(sessionStorage.getItem("locale")) || []
  );
  const [item, setItem] = useState([]);
  const [fetchData, setFetchData] = useState([]);

  const dataLoad = async (input) => {
    var data = [];
    await getProduct(id, input.id).then((result) => {
      data = result.data.fetchData;
      setItem(data);
      setFetchData(result.data.recommend);
      setLoading(false);
    });
  };
  useEffect(() => {
    dataLoad(selectedLang);
    return () => {
      setItem([]);
      setFetchData([]);
      setLoading(true);
    };
  }, [id]);
  return (
    <TemplateContext.Provider
      value={{
        dataLoad,
        loading,
        fetchData,
        item,
        setItem,
        languages,
        selectedLang,
        setSelectedLang,
        setLocale,
        locale,
        cart,
        setCart,
        deliveryFees,
        activeSKU,
        skuarray,
        ingredients,
        extraValue,
        countryCode,
        orignalStock,
        orignalPrice,
        price,
        stock,
        picture,
        productName,
        branchId,
        style,
        id,
      }}
    >
      <OrderDetails />
    </TemplateContext.Provider>
  );
};
export default MainRrecommend;
