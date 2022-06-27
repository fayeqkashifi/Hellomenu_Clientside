import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../../Consts";
import { Link } from "react-router-dom";
import { getProductsBasedOnBranchId } from "../../Functionality";
import InfiniteScroll from "react-infinite-scroll-component";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import axios from "axios";
import { TemplateContext } from "../../TemplateContext";
import VideosShow from "./VideosShow";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PublicRoute from "../../../../PublicRoute";
// import VideoDetails from "./VideoDetails";
export function Show(props) {
  const { url } = useRouteMatch();
  const { style, branch, locale } = useContext(TemplateContext);
  const branchStories = props.history.location.state.branchStories;
  const [page, setPage] = useState(1);
  const [data, setData] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const selectedLang =
    JSON.parse(sessionStorage.getItem(btoa("selectedLang" + branch.id))) || {};
  const [changeState, setChangeState] = useState(true);
  const dataLoad = () => {
    getProductsBasedOnBranchId(branch.id, page, selectedLang.id, source).then(
      (data) => {
        if (data !== undefined) {
          setLastPage(data.last_page);
          setData(data.data);
          setPage(page + 1);
          setLoading(false);
        }
      }
    );
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    dataLoad();
    return () => {
      source.cancel();
      setData([]);
      setLoading(true);
    };
  }, []);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      getProductsBasedOnBranchId(branch.id, page, source).then((data) => {
        if (data !== undefined) {
          setData(data.concat(data.data));
          setPage(page + 1);
        }
      });
    } else {
      setChangeState(false);
    }
  };
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
      <div style={style?.background} className="p-5">
        <div className="container">
          <div className="row justify-content-start">
            {branchStories?.map((item) => {
              return (
                <div className="col" key={item.id}>
                  <Link
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
            {data.map((item) => {
              return item?.video ? (
                <div className={`col`} key={item.id}>
                  <Link
                    to={{
                      pathname: `${url}/video`,
                      state: {
                        product_id: item.id,
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
                  <div className={`col`} key={item.id}>
                    <Link
                      to={{
                        pathname: `${url}/video`,
                        state: {
                          product_id: item.id,
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
            dataLength={data.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={changeState}
            loader={
              <p className="text-center py-4" style={{ marginBottom: "100px" }}>
                <b>{locale?.loading}</b>
              </p>
            }
            endMessage={
              <p
                style={{ textAlign: "center", marginBottom: "100px" }}
                className="py-4"
              >
                <b>{locale?.yay_you_have_seen_it_all}</b>
              </p>
            }
          ></InfiniteScroll>
        </div>
      </div>
    );
  }
}
function VideoList(props) {
  const { path } = useRouteMatch();
  return (
    <Router>
      <Switch>
        <PublicRoute exact path={`${path}`} component={Show} />
        <PublicRoute path={`${path}/video`} component={VideosShow} />
        {/* <PublicRoute path={`${path}/video-details`} component={VideoDetails} /> */}
      </Switch>
    </Router>
  );
}
export default VideoList;
