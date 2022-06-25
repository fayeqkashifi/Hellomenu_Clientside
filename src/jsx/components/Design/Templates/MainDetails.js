import React, { useState, useEffect, useContext } from "react";
import ProductDetails from "./Common/ProductDetails";
import { TemplateContext } from "./TemplateContext";
import { LanguagesContext } from "./LanguagesContext";
import { getProduct } from "./Functionality";
import axios from "axios";

const MainDetails = (props) => {
  const { selectedLang, style } = useContext(TemplateContext);

  const id = atob(atob(atob(props.match.params.id)));
  const [productIngredients, setProductIntgredients] = useState([]);
  const [extra, setExtra] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  let source = axios.CancelToken.source();
  const dataLoad = (input) => {
    getProduct(id, input.id, source).then((result) => {
      if (result !== undefined) {
        setFetchData(result.data.fetchData[0]);
        setProductIntgredients(result.data.ingredients);
        setRecommend(result.data.recommend);
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
      setRecommend([]);
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  if (loading) {
    return (
      <div
        className="spinner-border"
        role="status"
        style={style?.spinnerInCenter}
      >
        <span className="sr-only"></span>
      </div>
    );
  } else {
    return (
      <LanguagesContext.Provider
        value={{
          dataLoad,
          fetchData,
          setFetchData,
          recommend,
          setRecommend,
        }}
      >
        <ProductDetails
          id={id}
          extra={extra}
          productIngredients={productIngredients}
        />
      </LanguagesContext.Provider>
    );
  }
};
export default MainDetails;
