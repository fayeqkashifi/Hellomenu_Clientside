import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import { base_url, port } from "../../../../../Consts";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";
import ReactPlayer from "react-player/lazy";

function Statusbar(props) {
  let { style, products, branchId, categories, deliveryFees } = props;
  // const checkProduct = products.filter((item) => item.video !== null);
  const [branch, setBranch] = useState([]);
  const [branchStories, setBranchStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/EditBranches/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranch(res.data.branch);
      }
    });
    axios.get(`/api/getStories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranchStories(res.data.data);
        setLoading(false);
      }
    });
  }, []);

  if (products.length !== 0 || branchStories.length !== 0) {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status"></div>
        </div>
      );
    } else {
      return (
        <Container>
          <div className="d-flex justify-content-between m-1">
            <span style={style?.headerVideos}>Stories</span>
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
              List of Videos
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
                        width="100px"
                        height="150px"
                        style={{
                          borderRadius: "10px",
                          border: "2px solid",
                          borderColor: "#ff751d",
                          margin: "3px",
                          objectFit: "contain",
                        }}
                        onMouseOver={(event) => event.target.play()}
                        onMouseOut={(event) => event.target.pause()}
                        src={`http://${base_url}:${port}/videos/branches/${
                          JSON.parse(item?.storyVideos)[0]
                        }`}
                        muted={true}
                      />
                    ) : (
                      <ReactPlayer
                        width="100px"
                        height="150px"
                        style={{
                          borderRadius: "10px",
                          border: "2px solid",
                          borderColor: "#ff751d",
                          margin: "3px",
                          padding: "2px",
                          lineBreak: "anywhere",
                          overflow: "hidden",
                        }}
                        url={JSON.parse(item?.storyVideosUrl)[0]}
                      >
                        {/* <small>{JSON.parse(item?.storyVideosUrl)[0]}</small> */}
                      </ReactPlayer>
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
                        width="100px"
                        height="150px"
                        style={style?.statusPlayer}
                        src={`http://${base_url}:${port}/videos/products/${
                          JSON.parse(item.video)[0]
                        }`}
                        onMouseOver={(event) => event.target.play()}
                        onMouseOut={(event) => event.target.pause()}
                        muted={true}
                      />
                    ) : (
                      <ReactPlayer
                        width="100px"
                        height="150px"
                        style={{
                          borderRadius: "10px",
                          border: "2px solid",
                          borderColor: "#fff",
                          margin: "3px",
                          padding: "2px",
                          lineBreak: "anywhere",
                          overflow: "hidden",
                        }}
                        url={JSON.parse(item.videosUrl)[0]}
                      >
                        {/* <small>{JSON.parse(item?.videosUrl)[0]}</small> */}
                      </ReactPlayer>
                    )}
                  </Link>
                ) : null;
              })}
            </Toolbar>
          </ScrollContainer>
        </Container>
      );
    }
  } else {
    return <div></div>;
  }
}

export default Statusbar;