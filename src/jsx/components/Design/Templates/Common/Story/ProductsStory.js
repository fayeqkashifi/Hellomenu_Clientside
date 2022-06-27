import React, { useState, useEffect, useContext } from "react";
import { base_url, port } from "../../../../../../Consts";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import { Link } from "react-router-dom";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../../Functionality";
import Stories from "react-insta-stories";
import { useSwipeable } from "react-swipeable";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import profile from "../../../../../../images/hellomenu/logo.svg";
import ReactPlayer from "react-player/lazy";
import { TemplateContext } from "../../TemplateContext";
import { useRouteMatch } from "react-router-dom";

function ProductsStory(props) {
  const { url } = useRouteMatch();
  const { product_id } = props;
  const { style, branch, selectedLang } = useContext(TemplateContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [recomandProducts, setRecomandProducts] = useState([]);
  const [numberOfCategories, setNumberOfCategories] = useState(0);

  const loadProdcut = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `/api/getProduct/${product_id}`,
        params: {
          langId: selectedLang?.id,
        },
        cancelToken: source.token,
      });
      if (response?.data?.status === 200) {
        const data = response?.data?.fetchData[0];
        setData(data);
        if (data?.sub_category_id === null) {
          getProductBasedOnCategory(
            data?.category_id,
            page,
            selectedLang?.id,
            source
          ).then((res) => {
            if (res !== undefined) {
              setRecomandProducts(
                res.data.filter((item) => item.video !== null)
              );
            }
          });
          setLoading(false);
        } else {
          getProductBasedOnSubCategory(
            data?.sub_category_id,
            page,
            selectedLang?.id,
            source
          ).then((value) => {
            if (value !== undefined) {
              setRecomandProducts(
                value.data.filter((item) => item.video !== null)
              );
            }
          });
          setLoading(false);
        }
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
      axios
        .get(`/api/getCategoriesWithPaging/${branch.id}`, {
          cancelToken: source.token,
        })
        .then((data) => {
          if (data?.status === 200) {
            setNumberOfCategories(data.data.fetchData.last_page);
          } else {
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    loadProdcut();
    return () => {
      source.cancel();
      setData([]);
      setRecomandProducts([]);
      setLoading(true);
    };
  }, []);
  const changeProduct = async (id) => {
    try {
      setLoading(true);
      const response = await axios({
        method: "GET",
        url: `/api/getProduct/${id}`,
        params: {
          langId: selectedLang?.id,
        },
        cancelToken: source.token,
      });
      if (response?.data?.status === 200) {
        const data = response?.data?.fetchData[0];
        setData(data);
        setLoading(false);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [page, setPage] = useState(1);

  const loadSwiperUp = () => {
    if (page < numberOfCategories) {
      axios
        .get(`/api/getCategoriesWithPaging/${branch.id}?page=${page + 1}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          if (res?.status === 200) {
            const cate = res?.data?.fetchData.data[0];
            // console.log(cate);
            if (data?.sub_category_id === null) {
              setLoading(true);
              getProductBasedOnCategory(
                cate?.category_id,
                1,
                selectedLang.id,
                source
              ).then((res) => {
                if (res !== undefined) {
                  const result = res.data.filter((item) => item.video !== null);
                  if (result.length !== 0) {
                    setRecomandProducts(result);
                    setData(result[0]);
                  }
                  setLoading(false);
                }
              });
            } else {
              setLoading(true);
              getProductBasedOnSubCategory(
                cate?.sub_category_id,
                1,
                selectedLang.id,
                source
              ).then((value) => {
                if (value !== undefined) {
                  const result = value.data.filter(
                    (item) => item.video !== null
                  );
                  setRecomandProducts(result);
                  setData(result[0]);
                  setLoading(false);
                }
              });
            }
            setPage(page + 1);
          } else {
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const loadSwiperDown = () => {
    if (page > 1) {
      axios
        .get(`/api/getCategoriesWithPaging/${branch.id}?page=${page - 1}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          if (res?.status === 200) {
            setLoading(true);

            const cate = res?.data?.fetchData.data[0];
            if (data?.sub_category_id === null) {
              getProductBasedOnCategory(
                cate?.category_id,
                1,
                selectedLang.id,
                source
              ).then((res) => {
                if (res !== undefined) {
                  const result = res.data.filter((item) => item.video !== null);
                  if (result.length !== 0) {
                    setRecomandProducts(result);
                    setData(result[0]);
                  }
                  setLoading(false);
                }
              });
            } else {
              getProductBasedOnSubCategory(
                cate?.sub_category_id,
                1,
                selectedLang.id,
                source
              ).then((value) => {
                if (value !== undefined) {
                  const result = value.data.filter(
                    (item) => item.video !== null
                  );
                  if (result.length !== 0) {
                    setRecomandProducts(result);
                    setData(result[0]);
                  }
                  setLoading(false);
                }
              });
            }
            setPage(page - 1);
          } else {
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
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
        <div className="spinner-border " role="status" style={style?.spinner}>
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    const urls = [];
    data?.video &&
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
                      pathname: `${url}/video-details`,
                      state: {
                        product: data,
                        // products: recomandProducts,
                      },
                    }}
                    style={style?.headerVideos}
                  >
                    See More
                  </Link>
                </div>
                <ScrollContainer className="scroll-container">
                  <Toolbar>
                    {recomandProducts?.map((item, i) => {
                      return (
                        <div style={{ cursor: "pointer" }} key={i}>
                          <Link
                            to={{
                              pathname: `${url}/details/${btoa(
                                btoa(btoa(item.id))
                              )}`,
                            }}
                          >
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
                          </Link>
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
    JSON.parse(data?.videosUrl)?.map((item) => {
      urls.push({
        content: () => {
          return (
            <div
              className="p-2 text-center"
              style={{
                width: "100%",
                height: "100%",
                zIndex: 100000,
              }}
            >
              <div
                style={{
                  height: "70%",
                  lineBreak: "anywhere",
                  overflow: "hidden",
                  marginTop: "10%",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                {item.split(".").includes("tiktok") ? (
                  <a
                    href={item}
                    target="_blank"
                    style={{ backgroundColor: "#fff" }}
                  >
                    {item}
                  </a>
                ) : (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    style={{
                      overflow: "hidden",
                    }}
                    url={item}
                  />
                )}
              </div>
              <div
                style={{
                  height: "15%",
                  marginTop: "10%",
                }}
                className="text-center"
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to={{
                      pathname: `${url}/video-details`,
                      state: {
                        product: data,
                        // products: recomandProducts,
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
                          <Link
                            to={{
                              pathname: `${url}/details/${btoa(
                                btoa(btoa(item.id))
                              )}`,
                            }}
                          >
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
                          </Link>
                        </div>
                      );
                    })}
                  </Toolbar>
                </ScrollContainer>
              </div>
            </div>
          );
        },
      });
    });

    return (
      <div className="row" {...handlers}>
        <div className="d-flex align-items-center justify-content-center mb-5 mt-2">
          <Stories
            stories={urls}
            defaultInterval={1500}
            width={432}
            // height={1000}
          />
        </div>
      </div>
    );
  }
}

export default ProductsStory;
