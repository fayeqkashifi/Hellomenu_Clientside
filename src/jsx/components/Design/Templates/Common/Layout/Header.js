import React, { useState, useEffect, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FunctionsIcon from "@mui/icons-material/Functions";
import getSymbolFromCurrency from "currency-symbol-map";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";
import LanguageLocalization from "../Localization";
import { TemplateContext } from "../../TemplateContext";
import {
  getProduct,
  getVariations,
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../../Functionality";

function Header(props) {
  const {
    style,
    categories,
    activeCategory,
    products,
    setProducts,
    setActiveCategory,
    cart,
    setLastPage,
    setPage,
    selectedLang,
    locale,
    setCart,
    branch,
  } = useContext(TemplateContext);
  const { search, details, setChangeState } = props;

  const filterProducts = async (menu) => {
    if (menu !== "All") {
      if (menu.sub_category_id === null) {
        getProductBasedOnCategory(
          menu.category_id,
          1,
          selectedLang.id,
          source
        ).then((data) => {
          if (data !== undefined) {
            setProducts(data.data);
            setChangeState(true);
            setLastPage(data.last_page);
            setPage(2);
            setActiveCategory(
              menu.CategoryName + "~~~cate~~~" + menu.category_id
            );
          }
        });
      } else {
        getProductBasedOnSubCategory(
          menu.sub_category_id,
          1,
          selectedLang.id,
          source
        ).then((res) => {
          if (res !== undefined) {
            setProducts(res.data);
            setActiveCategory(
              menu.SubCategoryName + "~~~sub~~~" + menu.sub_category_id
            );
            setChangeState(true);
            setLastPage(res.last_page);
            setPage(2);
          }
        });
      }
    } else {
      getProductsBasedOnBranchId(branch.id, 1, selectedLang.id, source).then(
        (data) => {
          if (data !== undefined) {
            setProducts(data.data);
            setChangeState(true);
            setLastPage(data.last_page);
            setPage(2);
            setActiveCategory("All~~~1");
          }
        }
      );
    }
  };
  let [sum, setSum] = useState(0);
  const dataLoading = async () => {
    var total = 0;
    if (cart.length != 0) {
      await cart.map((item) => {
        getProduct(item.id, selectedLang.id, source).then((result) => {
          if (result !== undefined) {
            if (result.data.fetchData.length !== 0) {
              let extraTotal = 0;
              result.data.extras.map((extra) => {
                if (item.extras.includes(extra.value)) {
                  extraTotal += extra.price;
                }
              });
              let recomendTotal = 0;
              result.data.recommend.map((recom) => {
                item.recommendations.filter((recommend) => {
                  if (recommend.value === recom.value) {
                    recomendTotal += recom.price * recommend.qty;
                  }
                });
              });
              const itemFetchData = result.data.fetchData[0];

              if (item.checkSKU) {
                if (item.checkSKU.length != 0) {
                  getVariations(item.id, source).then((res) => {
                    if (res !== undefined) {
                      if (res !== "") {
                        let varData = JSON.parse(res.variants).filter(
                          (variant) => variant.sku === item.checkSKU
                        );
                        if (varData.length !== 0) {
                          total +=
                            parseInt(varData[0].price) * item.qty +
                            extraTotal +
                            recomendTotal;
                          setSum(total);
                        } else {
                          const filterData = cart.filter(
                            (check) => check.id != item.id
                          );
                          setCart(filterData);
                          localStorage.setItem(
                            btoa("cart" + branch.id),
                            JSON.stringify(filterData)
                          );
                        }
                      }
                    }
                  });
                } else {
                  total +=
                    itemFetchData.price * item.qty + extraTotal + recomendTotal;
                }
              } else {
                total += item.qty * itemFetchData.price;
              }
              setSum(total);
            } else {
              const filterData = cart.filter((check) => check.id != item.id);
              setCart(filterData);

              const filterProducts = products.filter(
                (check) => check.id != item.id
              );
              setProducts(filterProducts);

              localStorage.setItem(
                btoa("cart" + branch.id),
                JSON.stringify(filterData)
              );
            }
          }
        });
      });
    } else {
      setSum(total);
    }
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    if (style?.template === "thrid") {
      dataLoading();
    }
    return () => {
      source.cancel();
      // setSum(0);
    };
  }, [cart]);
  let cancelToken;
  const searchItem = async (e) => {
    if (e.target.value === "") {
      getProductsBasedOnBranchId(branch.id, 1, selectedLang.id, source).then(
        (data) => {
          if (data !== undefined) {
            setProducts(data.data);
            setChangeState(true);
            setLastPage(data.last_page);
            setPage(2);
            setActiveCategory("All~~~1");
          }
        }
      );
    } else {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      let results;
      try {
        results = await axios.get(`/api/findProduct/${e.target.value}`, {
          cancelToken: cancelToken.token,
          params: {
            branchId: branch.id,
            langId: selectedLang.id,
          },
        });
        if (results.data.status === 200) {
          setProducts(results.data.fetchData);
        } else if (results.data.status === 404) {
          setProducts(results.data.fetchData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Toolbar
        sx={{
          position: "sticky",
        }}
        className="top-0 "
        style={style?.toolbarHeader}
      >
        <Typography align="left" style={style?.title} noWrap>
          {activeCategory?.split("~~~")[0] === "All"
            ? locale?.all
            : activeCategory?.split("~~~")[0]}
        </Typography>
        <Typography
          align="right"
          sx={{ flex: 1 }}
          style={style?.searchFields}
        ></Typography>
        {search && (
          <input
            onChange={searchItem}
            style={style?.searchFields}
            className={`form-control`}
            placeholder={locale?.search_by_name}
          />
        )}
        <LanguageLocalization />
        <div style={style?.headerTotalDiv}>
          <IconButton sx={style?.totalPriceIcon}>
            <FunctionsIcon fontSize="small" />
          </IconButton>
          {sum.toFixed(2) + "  " + getSymbolFromCurrency(branch?.currency_code)}
          &nbsp;
        </div>
      </Toolbar>

      <ScrollContainer
        className={`croll-container ${details ? "d-none" : ""}`}
        style={style?.catesDiv}
      >
        <Toolbar component="nav" variant="dense" sx={style?.headerToolbar}>
          {categories && (
            <Typography
              style={
                activeCategory === "All~~~1"
                  ? style?.cateActive
                  : style?.cateDeActive
              }
              sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
              onClick={() => filterProducts("All")}
            >
              {locale?.all}
            </Typography>
          )}

          {categories?.map((section, i) => (
            <Typography
              style={
                activeCategory ===
                (section.sub_category_id === null
                  ? section.CategoryName + "~~~cate~~~" + section.category_id
                  : section.SubCategoryName +
                    "~~~sub~~~" +
                    section.sub_category_id)
                  ? style?.cateActive
                  : style?.cateDeActive
              }
              key={i}
              sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
              onClick={() => filterProducts(section)}
            >
              {section.SubCategoryName === null
                ? section.CategoryName
                : section.SubCategoryName}
            </Typography>
          ))}
        </Toolbar>
      </ScrollContainer>
    </div>
  );
}

export default Header;
