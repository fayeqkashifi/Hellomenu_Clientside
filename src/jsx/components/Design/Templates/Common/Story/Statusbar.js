import React, { useState, useEffect, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import { base_url, port } from "../../../../../../Consts";
import { Link } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { TemplateContext } from "../../TemplateContext";
import { useRouteMatch } from "react-router-dom";

function Statusbar() {
  const { url } = useRouteMatch();
  const { products, style, branch, locale, isMobile, isTablet } =
    useContext(TemplateContext);
  const [branchStories, setBranchStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const dataload = () => {
    try {
      axios
        .get(`/api/getStories/${branch.id}`, {
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
      setBranchStories([]);
      setLoading(true);
    };
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={style?.spinner}
      >
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
                  pathname: `${url}/video-list`,
                  state: {
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
                        pathname: `${url}/video`,
                        state: {
                          branchState: true,
                          branchStory: item,
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
                          width={isMobile ? "40px" : isTablet ? "60px" : "80px"}
                          height={
                            isMobile ? "60px" : isTablet ? "90px" : "130px"
                          }
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
                            width={
                              isMobile ? "30px" : isTablet ? "50px" : "70px"
                            }
                            height={
                              isMobile ? "40px" : isTablet ? "60px" : "100px"
                            }
                            style={style?.fullScreenIcon}
                            url={JSON.parse(item.storyVideosUrl)[0]}
                          />
                          <FullscreenIcon fontSize="1vw" />
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
                        pathname: `${url}/video`,
                        state: {
                          product_id: item.id,
                          branchState: false,
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
                          width={isMobile ? "40px" : isTablet ? "60px" : "80px"}
                          height={
                            isMobile ? "60px" : isTablet ? "90px" : "130px"
                          }
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
                            width={
                              isMobile ? "30px" : isTablet ? "50px" : "70px"
                            }
                            height={
                              isMobile ? "40px" : isTablet ? "60px" : "100px"
                            }
                            style={style?.fullScreenIcon}
                            url={JSON.parse(item.videosUrl)[0]}
                          />
                          <FullscreenIcon fontSize="1vw" />
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
