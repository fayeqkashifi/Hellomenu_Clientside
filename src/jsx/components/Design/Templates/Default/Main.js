import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link as RLink } from "react-router-dom";
import "react-awesome-slider/dist/styles.css";
import { Col } from "react-bootstrap";
import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "@mui/material/Link";

import { base_url, port } from "../../../../../Consts";
import Toolbar from "@mui/material/Toolbar";
import getSymbolFromCurrency from "currency-symbol-map";

var hold = 1;

const DefaultMain = (props) => {
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState(0);
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    axios.get(`/api/GetTempBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setThemes(res.data.fetchData?.Customization);
      }
    });
    axios.get(`/api/GetBranchForShow/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setData(res.data.data);
      }
      setLoading(false);
    });
    axios.get(`/api/GetCategories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCategories(res.data.fetchData);
        // setActiveCategory(res.data.fetchData[0].id);
      }
    });
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.fetchData);
        axios
          .get(
            `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_id}`
          )
          .then((res) => {
            if (res.data.status === 200) {
              setProducts(res.data.data);
              setActiveSubCategory(res.data.data[0]?.sub_category_id);
            }
          });
        setSubCategories(res.data.fetchData);
      }
    });
  }, []);
  const [changeState, setChangeState] = useState(true);
  const fetchMoreData = () => {
    if (hold < subcategories.length) {
      axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
        if (res.data.status === 200) {
          // console.log(res.data.fetchData);
          setActiveSubCategory(res.data.fetchData[hold].sub_id);
          axios
            .get(
              `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[hold].sub_id}`
            )
            .then((res) => {
              if (res.data.status === 200) {
                if (res.data.data?.length === 0) {
                  hold = hold + 1;
                  // console.log(res.data.fetchData);
                  fetchMoreData();
                } else {
                  hold = hold + 1;
                  setProducts(products.concat(res.data.data));
                }
              }
            });

          setSubCategories(res.data.fetchData);
        }
      });
    } else {
      setChangeState(false);
    }
    // console.log(hold);
  };
  const filterCategory = (cateId) => {
    axios.get(`/api/GetSubCategories/${cateId}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.fetchData);
        setSubCategories(res.data.fetchData);
        // console.log(subcategories.length);
        // setProducts([]);
        // setVariants([]);
      }
    });
    setActiveCategory(cateId);
  };
  // this function called by child (counter)
  const filterProducts = (subCateID) => {
    axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
      }
    });
    setActiveSubCategory(subCateID);
  };

  const [visible, setVisible] = useState(false);
  var viewShow_HTMLTABLE = "";
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
    viewShow_HTMLTABLE = products.map((item, i) => {
      return (
        <div
          className="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6"
          key={i}
          id={item.SubCategoryName}
        >
          <div className="card">
            <div className="card-body">
              <div className="new-arrival-product">
                <div className="text-center bg-white">
                  <img
                    className="img-fluid w-40 img-thumbnail"
                    style={{ height: "100px", objectFit: "contain" }}
                    src={`http://${base_url}:${port}/images/products/${item.image}`}
                    alt=""
                  />
                </div>
                <RLink
                  to={{
                    pathname: `/standard-template/product/${btoa(item.id)}`,
                    state: { themes: themes },
                  }}
                  className="text-black"
                >
                  <div className="new-arrival-content text-center mt-3">
                    <h4>
                      {item.ProductName}
                      <p className="text-success" style={{ fontSize: 10 }}>
                        {item.UnitName}
                      </p>
                    </h4>

                    <span className="price">
                      {item.price +
                        " " +
                        getSymbolFromCurrency(item.currency_code)}
                    </span>
                  </div>
                </RLink>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand className="text-center text-uppercase text-primary">
            {data?.BrancheName}
          </CNavbarBrand>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
              {categories.map((data, i) => (
                <CNavItem as="li" key={i}>
                  <CNavLink
                    href="#"
                    onClick={() => filterCategory(data.id)}
                    className={`text-capitalize font-weight-bold ${
                      activeCategory === data.id
                        ? "active bg-primary text-white"
                        : " "
                    }`}
                  >
                    {data.CategoryName}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
      <CNavbar colorScheme="light" className="bg-white" placement="sticky-top">
        <Col lg={12}>
          <Toolbar
            component="nav"
            variant="dense"
            sx={{ justifyContent: "space-between", overflowX: "auto" }}
          >
            {subcategories.map((item, i) => (
              <Link
                onClick={() => filterProducts(item.sub_id)}
                noWrap
                key={i}
                underline="hover"
                variant="body2"
                to={`${item.SubCategoryName}`}
                className={`text-capitalize ${
                  activeSubCategory === item.sub_id
                    ? "active border border-primary text-primary"
                    : " "
                }`}
                style={{ cursor: "pointer" }}
                sx={{ p: 1, flexShrink: 0 }}
              >
                {item.SubCategoryName}
              </Link>
            ))}
          </Toolbar>
        </Col>
      </CNavbar>
      <div className="row mt-1 mx-1">{viewShow_HTMLTABLE}</div>
      <InfiniteScroll
        dataLength={products.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={changeState}
        loader={
          <p className="text-center pt-5">
            <b>{t("loading")}</b>
          </p>
        }
        endMessage={
          <p style={{ textAlign: "center " }}>
            <b>{t("yay_you_have_seen_it_all")}</b>
          </p>
        }
      ></InfiniteScroll>
    </div>
  );
};

export default DefaultMain;
