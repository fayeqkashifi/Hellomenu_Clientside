import React, { useState, useEffect} from "react";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import HorizontalScroller from "react-horizontal-scroll-container";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { Link } from "react-router-dom";

import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Stories from "react-insta-stories";
import { useSwipeable } from "react-swipeable";
function VideosShow(props) {
  const { t } = useTranslation();
  const style = props.history.location.state.style;
  const branchId = props.history.location.state.branchId;
  const deliveryFees = props.history.location.state.deliveryFees;
  const product_id = props.history.location.state.product_id;

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
          setRecomandProducts(res.filter((item) => item.video !== null));
        });
        setLoading(false);
      } else {
        getProductBasedOnSubCategory(data?.sub_category_id).then((value) => {
          setRecomandProducts(value.filter((item) => item.video !== null));
        });
        setLoading(false);
      }
    }
    axios.get(`/api/getCategoriesWithPaging/${branchId}`).then((data) => {
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
        .get(`/api/getCategoriesWithPaging/${branchId}?page=${page + 1}`)
        .then((res) => {
          if (res.status === 200) {
            const cate = res.data.fetchData.data[0];
            if (data?.sub_category_id === null) {

              setLoading(true);
              getProductBasedOnCategory(cate?.category_id).then((res) => {
                const result = res.filter((item) => item.video !== null);
                if(result.length!== 0){
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
        .get(`/api/getCategoriesWithPaging/${branchId}?page=${page - 1}`)
        .then((res) => {
          if (res.status === 200) {
            setLoading(true);

            const cate = res.data.fetchData.data[0];
            if (data?.sub_category_id === null) {
              getProductBasedOnCategory(cate?.category_id).then((res) => {
                const result = res.filter((item) => item.video !== null);
                setRecomandProducts(result);
                setData(result[0]);
                setLoading(false);
              });
            } else {
              getProductBasedOnSubCategory(cate?.sub_category_id).then(
                (value) => {
                  const result = value.filter((item) => item.video !== null);
                  setRecomandProducts(result);
                  setData(result[0]);
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
    const stories = [
      {
        url: `http://${base_url}:${port}/images/products/${data?.video}`,
        duration: 100000, // ignored
        type: "video",
        seeMore: () => {
          return (
            <div
              className="row"
              style={{ backgroundColor: "#fff", height: "100%" }}
            >
              <div className="text-center mt-5" style={{ color: "#000" }}>
                <h1 style={{ color: "#000" }}>
                  {getSymbolFromCurrency(data.currency_code) +
                    "  " +
                    data.price.toFixed(2)}
                </h1>
                <h2 style={{ color: "#000" }}>{data.ProductName}</h2>
                <h6 style={{ color: "#000" }}>category: {data.CategoryName}</h6>
                <p>{data.UnitName}</p>
                <p>{data.Description}</p>
                <Link
                  to={{
                    pathname: `/public/details/${btoa(product_id)}`,
                    state: {
                      style: style,
                      deliveryFees: deliveryFees,
                      branchId: branchId,
                    },
                  }}
                  style={{ color: "#000", fontWeight: "bold" }}
                >
                  See More
                </Link>
              </div>
            </div>
          );
        },
      },
    ];
    return (
      <div
        className="row"
        style={{ color: "#000" }}
        {...handlers}
        style={{ touchAction: "pan-y" }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <Stories
            stories={stories}
            defaultInterval={1500}
            width={432}
            style={{overflow:"auto",
            minHeight: "500px",
            height: "auto",
          }}
          />
        </div>

        <div className="d-flex align-items-center justify-content-center my-2">
          <div
            className="d-flex justify-content-between "
            style={{ width: "432px" }}
          >
            <HorizontalScroller>
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
                    <small className="ml-1">
                      {item.price + getSymbolFromCurrency(item?.currency_code)}
                    </small>
                  </div>
                );
              })}
            </HorizontalScroller>
          </div>
        </div>
      </div>
      // <AmpStory
      //   title="Example title"
      //   publisher="Example publisher"
      //   publisher-logo-src="logo128.png"
      //   poster-portrait-src="3x4.jpg"
      // >
      //   <AmpStoryPage id={product_id}>
      //     <AmpStoryGridLayer template="fill">
      //       {data?.video && (
      //         <AmpVideo
      //           src={`http://${base_url}:${port}/images/products/${data?.video}`}
      //           height="720"
      //           width="1280"
      //           layout="responsive"
      //         />
      //       )}
      //     </AmpStoryGridLayer>
      //     <AmpStoryGridLayer
      //       template="vertical"
      //       style={{ color: "#fff", marginTop: "350px" }}
      //     >
      //       <AmpHeader
      //         level={6}
      //         title={
      //           <div className="d-flex justify-content-between ">
      //             <h6 style={{ color: "#fff" }}>{data.ProductName}</h6>
      //             <Link
      //               to={{
      //                 pathname: `/public/details/${btoa(product_id)}`,
      //                 state: {
      //                   style: style,
      //                   deliveryFees: deliveryFees,
      //                   branchId: branchId,
      //                 },
      //               }}
      //               style={{ color: "#fff" }}
      //             >
      //               See More
      //             </Link>
      //           </div>
      //         }
      //       />
      //       <AmpParagraph
      //         text={
      //           <HorizontalScroller>
      //             {recomandProducts?.map((item, i) => {
      //               return (
      //                 <div style={{ cursor: "pointer" }} key={i}>
      //                   <img
      //                     src={`http://${base_url}:${port}/images/products/${
      //                       JSON.parse(item.image)[0]
      //                     }`}
      //                     alt="Image"
      //                     style={style?.imageVideo}
      //                     onClick={() => changeProduct(item.id)}
      //                   />
      //                   <small>
      //                     {item.price +
      //                       getSymbolFromCurrency(item?.currency_code)}
      //                   </small>
      //                 </div>
      //               );
      //             })}
      //           </HorizontalScroller>
      //         }
      //       />
      //     </AmpStoryGridLayer>
      //   </AmpStoryPage>
      // </AmpStory>
    );
  }
}

export default VideosShow;
