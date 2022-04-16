import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../Consts";
import { Link } from "react-router-dom";
import { getProductsBasedOnBranchId } from "../Functionality";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
function VideoList(props) {
  const { t } = useTranslation();

  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const deliveryFees = props.history.location.state.deliveryFees;
  const categories = props.history.location.state.categories;
  const branchStories = props.history.location.state.branchStories;
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [changeState, setChangeState] = useState(true);
  const dataLoad = async () => {
    getProductsBasedOnBranchId(branch.id, page).then((data) => {
      setLastPage(data.last_page);
      setProducts(data.data);
      setPage(page + 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    dataLoad();
    return () => {
      setProducts([]);
      setLoading(true);
    };
  }, []);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      getProductsBasedOnBranchId(branch.id, page).then((data) => {
        setProducts(products.concat(data.data));
        setPage(page + 1);
      });
    } else {
      setChangeState(false);
    }
  };
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
    return (
      <div style={style?.background} className="p-5">
        <div className="container">
          <div className="row justify-content-start">
            {branchStories?.map((item) => {
              return (
                <div className="col-2" key={item.id}>
                  <Link
                    to={{
                      pathname: `/public/video`,
                      state: {
                        style: style,
                        branch: branch,
                        deliveryFees: deliveryFees,
                        branchState: true,
                        branchStory: item,
                        products: products,
                        categories: categories,
                      },
                    }}
                    style={style?.headerVideos}
                  >
                    {item?.storyVideos ? (
                      <ReactPlayer
                        width="150px"
                        height="200px"
                        style={style?.branchStory}
                        url={`http://${base_url}:${port}/videos/branches/${
                          JSON.parse(item?.storyVideos)[0]
                        }`}
                        playing={false}
                      />
                    ) : JSON.parse(item.storyVideosUrl)[0]
                        .split(".")
                        .includes("tiktok") ? (
                      <ReactPlayer
                        width="150px"
                        height="200px"
                        style={style?.branchStory}
                        playIcon={<PlayCircleOutlineIcon fontSize="large" />}
                        light={
                          item.branchImages
                            ? `http://${base_url}:${port}/images/branches/${
                                JSON.parse(item.branchImages)[0]
                              }`
                            : true
                        }
                        url={JSON.parse(item.storyVideosUrl)[0]}
                      />
                    ) : (
                      <div
                        style={style?.branchStoryList}
                        className="text-center"
                      >
                        <ReactPlayer
                          width="140px"
                          height="170px"
                          style={style?.fullScreenIcon}
                          url={JSON.parse(item.storyVideosUrl)[0]}
                        ></ReactPlayer>
                        <FullscreenIcon fontSize="small" />
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
            {products.map((item) => {
              return item?.video ? (
                <div className={`col-2`} key={item.id}>
                  <Link
                    to={{
                      pathname: `/public/video`,
                      state: {
                        style: style,
                        branch: branch,
                        product_id: item.id,
                        deliveryFees: deliveryFees,
                        branchState: false,
                      },
                    }}
                    style={style?.headerVideos}
                  >
                    <ReactPlayer
                      width="150px"
                      height="200px"
                      style={style?.productStory}
                      url={`http://${base_url}:${port}/videos/products/${
                        JSON.parse(item.video)[0]
                      }`}
                      playing={false}
                    />
                  </Link>
                </div>
              ) : (
                JSON.parse(item.videosUrl).length !== 0 && (
                  <div className={`col-2`} key={item.id}>
                    <Link
                      to={{
                        pathname: `/public/video`,
                        state: {
                          style: style,
                          branch: branch,
                          product_id: item.id,
                          deliveryFees: deliveryFees,
                          branchState: false,
                        },
                      }}
                      style={style?.headerVideos}
                    >
                      {JSON.parse(item.videosUrl)[0]
                        .split(".")
                        .includes("tiktok") ? (
                        <ReactPlayer
                          width="150px"
                          height="200px"
                          style={style?.productStory}
                          playIcon={<PlayCircleOutlineIcon fontSize="large" />}
                          light={`http://${base_url}:${port}/images/products/${
                            JSON.parse(item.image)[0]
                          }`}
                          url={JSON.parse(item.videosUrl)[0]}
                        />
                      ) : (
                        <div
                          style={style?.productStoryList}
                          className="text-center"
                        >
                          <ReactPlayer
                            width="140px"
                            height="170px"
                            style={style?.fullScreenIcon}
                            url={JSON.parse(item.videosUrl)[0]}
                          ></ReactPlayer>
                          <FullscreenIcon fontSize="small" />
                        </div>
                      )}
                    </Link>
                  </div>
                )
              );
            })}
          </div>
          <InfiniteScroll
            dataLength={products.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={changeState}
            loader={
              <p className="text-center py-4" style={{ marginBottom: "100px" }}>
                <b>{t("loading")}</b>
              </p>
            }
            endMessage={
              <p
                style={{ textAlign: "center", marginBottom: "100px" }}
                className="py-4"
              >
                <b>{t("yay_you_have_seen_it_all")}</b>
              </p>
            }
          ></InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default VideoList;
