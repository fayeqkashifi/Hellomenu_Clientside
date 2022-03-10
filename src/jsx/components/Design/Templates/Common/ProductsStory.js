import React, { useState, useEffect } from "react";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { Link } from "react-router-dom";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Stories from "react-insta-stories";
import { useSwipeable } from "react-swipeable";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import profile from "../../../../../images/hellomenu/logo.svg";

function ProductsStory(props) {
  const { t } = useTranslation();
  const { style, branch, product_id, deliveryFees, categories } = props;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [recomandProducts, setRecomandProducts] = useState([]);
  const [numberOfCategories, setNumberOfCategories] = useState(0);

  const loadProdcut = async () => {
    const response = await axios.get(`/api/GetProduct/${product_id}`);
    if (response.data.status === 200) {
      const data = response.data.fetchData[0];
      setData(data);
      if (data?.sub_category_id === null) {
        getProductBasedOnCategory(data?.category_id).then((res) => {
          setRecomandProducts(res.data.filter((item) => item.video !== null));
        });
        setLoading(false);
      } else {
        getProductBasedOnSubCategory(data?.sub_category_id).then((value) => {
          setRecomandProducts(value.data.filter((item) => item.video !== null));
        });
        setLoading(false);
      }
    }
    axios.get(`/api/getCategoriesWithPaging/${branch.id}`).then((data) => {
      if (data.status === 200) {
        setNumberOfCategories(data.data.fetchData.last_page);
      } else {
        console.log(data);
      }
    });
  };
  useEffect(() => {
    loadProdcut();
    return () => {
      setData([]);
      setRecomandProducts([]);
      setLoading(true);
    };
  }, []);
  const changeProduct = async (id) => {
    setLoading(true);
    const response = await axios.get(`/api/GetProduct/${id}`);
    if (response.data.status === 200) {
      const data = response.data.fetchData[0];
      setData(data);
      setLoading(false);
    }
  };
  const [page, setPage] = useState(1);

  const loadSwiperUp = () => {
    if (page < numberOfCategories) {
      axios
        .get(`/api/getCategoriesWithPaging/${branch.id}?page=${page + 1}`)
        .then((res) => {
          if (res.status === 200) {
            const cate = res.data.fetchData.data[0];
            // console.log(cate);
            if (data?.sub_category_id === null) {
              setLoading(true);
              getProductBasedOnCategory(cate?.category_id).then((res) => {
                const result = res.filter((item) => item.video !== null);
                if (result.length !== 0) {
                  setRecomandProducts(result);
                  setData(result[0]);
                }
                setLoading(false);
              });
            } else {
              setLoading(true);
              getProductBasedOnSubCategory(cate?.sub_category_id).then(
                (value) => {
                  const result = value.filter((item) => item.video !== null);
                  setRecomandProducts(result);
                  setData(result[0]);
                  setLoading(false);
                }
              );
            }
            setPage(page + 1);
          } else {
            console.log(data);
          }
        });
    }
  };
  const loadSwiperDown = () => {
    if (page > 1) {
      axios
        .get(`/api/getCategoriesWithPaging/${branch.id}?page=${page - 1}`)
        .then((res) => {
          if (res.status === 200) {
            setLoading(true);

            const cate = res.data.fetchData.data[0];
            if (data?.sub_category_id === null) {
              getProductBasedOnCategory(cate?.category_id).then((res) => {
                const result = res.filter((item) => item.video !== null);
                if (result.length !== 0) {
                  setRecomandProducts(result);
                  setData(result[0]);
                }
                setLoading(false);
              });
            } else {
              getProductBasedOnSubCategory(cate?.sub_category_id).then(
                (value) => {
                  const result = value.filter((item) => item.video !== null);
                  if (result.length !== 0) {
                    setRecomandProducts(result);
                    setData(result[0]);
                  }
                  setLoading(false);
                }
              );
            }
            setPage(page - 1);
          } else {
            console.log(data);
          }
        });
    }
  };
  const config = {
    delta: { top: 20, bottom: 20 }, // min distance(px) before a swipe starts. *See Notes*
    preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0, // set a rotation angle
  };
  const handlers = useSwipeable({
    onSwipedUp: () => loadSwiperUp(),
    onSwipedDown: () => loadSwiperDown(),
    ...config,
  });

  if (loading) {
    return (
      <div className="container ">
        <div
          className="spinner-border text-primary "
          role="status"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    const urls = [];
    JSON.parse(data.video).map((item) => {
      urls.push({
        url: `http://${base_url}:${port}/videos/products/${item}`,
        duration: 100000, // ignored
        type: "video",
        seeMore: () => {
          return <div></div>;
        },
        seeMoreCollapsed: () => {
          return (
            <>
              <div className="d-flex align-items-center justify-content-center">
                <Link
                  to={{
                    pathname: `/public/video-details`,
                    state: {
                      style: style,
                      product: data,
                      products: recomandProducts,
                      branch: branch,
                      deliveryFees: deliveryFees,
                      categories: categories,
                    },
                  }}
                  style={style?.headerVideos}
                >
                  See More{" "}
                </Link>
              </div>
              <ScrollContainer className="scroll-container">
                <Toolbar>
                  {recomandProducts?.map((item, i) => {
                    return (
                      <div style={{ cursor: "pointer" }} key={i}>
                        <img
                          src={`http://${base_url}:${port}/images/products/${
                            JSON.parse(item.image)[0]
                          }`}
                          alt="Image"
                          style={style?.imageVideo}
                          onClick={() => changeProduct(item.id)}
                        />
                        <small className="ml-1" style={{ color: "#fff" }}>
                          {item.price +
                            getSymbolFromCurrency(item?.currency_code)}
                        </small>
                      </div>
                    );
                  })}
                </Toolbar>
              </ScrollContainer>
            </>
          );
        }, // when collapsed
        header: {
          heading: branch.BrancheName,
          //   subheading: branch.created_at,
          profileImage:
            branch.branchImages === null
              ? profile
              : `http://${base_url}:${port}/images/branches/${
                  JSON.parse(branch.branchImages)[0]
                }`,
        },
      });
    });

    return (
      <div className="row" {...handlers} style={style?.background}>
        <div className="d-flex align-items-center justify-content-center mt-2">
          <Stories
            stories={urls}
            defaultInterval={1500}
            width={432}
            // height="auto"
            // style={{ overflow: "auto", minHeight: "500px", height: "auto" }}
          />
        </div>
      </div>
    );
  }
}

export default ProductsStory;
