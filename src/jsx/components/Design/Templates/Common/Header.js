import React, { useState, useEffect, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useHistory } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Drawer from "./Drawer";
import getSymbolFromCurrency from "currency-symbol-map";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";
import LanguageLocalization from "./Localization";
import { TemplateContext } from "../TemplateContext";
function Header(props) {
  const {
    style,
    categories,
    activeCategory,
    setProducts,
    setActiveCategory,
    cart,
    branchId,
    setLastPage,
    setPage,
    selectedLang,
    locale,
  } = useContext(TemplateContext);
  const { search, details, setChangeState } = props;

  const history = useHistory();
  const [modalCentered, setModalCentered] = useState(false);

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
      getProductsBasedOnBranchId(branchId, 1, selectedLang.id, source).then(
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
  const dataLoading = () => {
    let count = 0;
    cart.map(
      (item) =>
        (count +=
          item.totalPrice === undefined
            ? item.price * item.qty
            : parseInt(item.totalPrice) + item.price * (item.qty - 1))
    );
    setSum(count);
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoading();
    return () => {
      source.cancel();
      setSum(0);
    };
  }, [cart]);
  let cancelToken;
  const searchItem = async (e) => {
    if (e.target.value === "") {
      getProductsBasedOnBranchId(branchId, 1, selectedLang.id, source).then(
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
            branchId: branchId,
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
    <React.Fragment>
      <Toolbar sx={{ position: "sticky", zIndex: 9999999 }} className="top-0">
        <IconButton onClick={() => history.goBack()} sx={style?.backIcon}>
          <KeyboardBackspaceIcon fontSize="small" />
        </IconButton>
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
          <>
            <input
              // sx={{ ml: 1, flex: 1 }}
              onChange={searchItem}
              style={style?.inputfield}
              className={`form-control`}
              placeholder={locale?.search_by_name}
            />
          </>
        )}
        <LanguageLocalization />
        <IconButton onClick={() => setModalCentered(true)}>
          <Badge
            badgeContent={cart.length}
            sx={style?.BadgeStyle}
            overlap="circular"
          >
            <AddShoppingCartIcon fontSize="small" sx={style?.cartIcon} />
          </Badge>
        </IconButton>
        <div style={style?.headerTotalDiv}>
          <IconButton sx={style?.totalPriceIcon}>
            <FunctionsIcon fontSize="small" />
          </IconButton>
          {sum.toFixed(2) +
            "  " +
            (getSymbolFromCurrency(cart[0]?.currency_code) === undefined
              ? " "
              : getSymbolFromCurrency(cart[0]?.currency_code))}{" "}
          &nbsp;
        </div>
      </Toolbar>

      {style?.template === "dark" && (
        <ScrollContainer
          className={`croll-container ${details ? "d-none" : ""}`}
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
      )}
      <Drawer
        modalCentered={modalCentered}
        setModalCentered={setModalCentered}
        checkBit={true}
      />
    </React.Fragment>
  );
}

export default Header;
