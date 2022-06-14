import React, { useState, useEffect, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import { base_url, port } from "../../../../../../Consts";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { TemplateContext } from "../../TemplateContext";
function Statusbar() {
  const { products, style, branchId, categories, deliveryFees, locale } =
    useContext(TemplateContext);

  // const checkProduct = products.filter((item) => item.video !== null);
  const [branch, setBranch] = useState([]);
  const [branchStories, setBranchStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const dataload = () => {
    try {
      axios
        .get(`/api/editBranches/${branchId}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          if (res?.data?.status === 200) {
            setBranch(res?.data?.branch);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`/api/getStories/${branchId}`, {
          cancelToken: source.token,
        })
        .then((res) => {
          if (res?.data?.status === 200) {
            setBranchStories(res?.data?.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataload();
    return () => {
      source.cancel();
      setBranch([]);
      setBranchStories([]);
      setLoading(true);
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else {
    return (
      <>
        {branchStories.length !== 0 ||
        products.filter(
          (item) =>
            item?.video !== null || JSON.parse(item.videosUrl).length !== 0
        ).length !== 0 ? (
          <div className="px-5">
            <div className="d-flex justify-content-between my-2">
              <span style={style?.headerVideos}> {locale?.stories}</span>
              <Link
                to={{
                  pathname: `/public/video-list`,
                  state: {
                    style: style,
                    products: products,
                    branch: branch,
                    deliveryFees: deliveryFees,
                    categories: categories,
                    branchStories: branchStories,
                  },
                }}
                style={style?.headerVideos}
              >
                {locale?.list_of_videoes}
              </Link>
            </div>
            <ScrollContainer className="scroll-container">
              <Toolbar>
                {branchStories?.map((item) => {
                  return item?.storyVideos ||
                    JSON.parse(item.storyVideosUrl).length !== 0 ? (
                    <Link
                      key={item.id}
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
                        <video
                          style={style?.branchStory}
                          onMouseOver={(event) => event.target.play()}
                          onMouseOut={(event) => event.target.pause()}
                          src={`http://${base_url}:${port}/videos/branches/${
                            JSON.parse(item?.storyVideos)[0]
                          }`}
                          muted={true}
                        />
                      ) : JSON.parse(item.storyVideosUrl)[0]
                          .split(".")
                          .includes("tiktok") ? (
                        <ReactPlayer
                          width="80px"
                          height="130px"
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
                        <div className="text-center" style={style?.branchStory}>
                          <ReactPlayer
                            width="70px"
                            height="100px"
                            style={style?.fullScreenIcon}
                            url={JSON.parse(item.storyVideosUrl)[0]}
                          />
                          <FullscreenIcon fontSize="small" />
                        </div>
                      )}
                    </Link>
                  ) : null;
                })}

                {products.map((item) => {
                  return item?.video ||
                    JSON.parse(item.videosUrl).length !== 0 ? (
                    <Link
                      to={{
                        pathname: `/public/video`,
                        state: {
                          style: style,
                          branch: branch,
                          product_id: item.id,
                          deliveryFees: deliveryFees,
                          branchState: false,
                          products: products,
                          categories: categories,
                        },
                      }}
                      key={item.id}
                      style={style?.headerVideos}
                    >
                      {item?.video ? (
                        <video
                          style={style?.productStory}
                          src={`http://${base_url}:${port}/videos/products/${
                            JSON.parse(item.video)[0]
                          }`}
                          onMouseOver={(event) => event.target.play()}
                          onMouseOut={(event) => event.target.pause()}
                          muted={true}
                        />
                      ) : JSON.parse(item.videosUrl)[0]
                          .split(".")
                          .includes("tiktok") ? (
                        <ReactPlayer
                          width="80px"
                          height="130px"
                          style={style?.productStory}
                          playIcon={<PlayCircleOutlineIcon fontSize="large" />}
                          light={`http://${base_url}:${port}/images/products/${
                            JSON.parse(item.image)[0]
                          }`}
                          url={JSON.parse(item.videosUrl)[0]}
                        />
                      ) : (
                        <div
                          className="text-center"
                          style={style?.productStory}
                        >
                          <ReactPlayer
                            width="70px"
                            height="100px"
                            style={style?.fullScreenIcon}
                            url={JSON.parse(item.videosUrl)[0]}
                          />
                          <FullscreenIcon fontSize="small" />
                        </div>
                      )}
                    </Link>
                  ) : null;
                })}
              </Toolbar>
            </ScrollContainer>
          </div>
        ) : null}
      </>
    );
  }
}

export default Statusbar;
