import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../Consts";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import ScrollContainer from "react-indiana-drag-scroll";
import axios from "axios";

function Statusbar(props) {
  let { style, products, branchId, categories, deliveryFees } = props;
  const checkProduct = products.filter((item) => item.video !== null);
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    axios.get(`/api/EditBranches/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranch(res.data.branch);
      }
    });
  }, []);
  return (
    checkProduct.length !== 0 && (
      <Container>
        <div className="d-flex justify-content-between m-1">
          <span style={style?.headerVideos}>Stories</span>
          <Link
            to={{
              pathname: `/public/video-list`,
              state: {
                style: style,
                products: checkProduct,
                branch: branch,
                deliveryFees: deliveryFees,
                categories: categories,
              },
            }}
            style={style?.headerVideos}
          >
            List of Videos
          </Link>
        </div>

        <ScrollContainer className="scroll-container">
          <Toolbar>
            {branch.branchImages && (
              <Link
                to={{
                  pathname: `/public/video`,
                  state: {
                    style: style,
                    branch: branch,
                    deliveryFees: deliveryFees,
                    branchState: true,
                    products: products,
                    categories: categories,
                  },
                }}
                style={style?.headerVideos}
              >
                <ReactPlayer
                  width="100px"
                  height="150px"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid",
                    borderColor: "#ff751d",
                    margin: "3px",
                    objectFit: "contain",
                  }}
                  url={`http://${base_url}:${port}/videos/branches/${
                    JSON.parse(branch.branchVideos)[0]
                  }`}
                  playing={false}
                />
              </Link>
            )}
            {checkProduct.map((item) => {
              return (
                item.video && (
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
                    <ReactPlayer
                      width="100px"
                      height="150px"
                      style={style?.statusPlayer}
                      url={`http://${base_url}:${port}/videos/products/${
                        JSON.parse(item.video)[0]
                      }`}
                      // controls={true}
                      playing={false}
                      playIcon={<PlayCircleOutlineIcon fontSize="large" />}
                      // showPreview={() => console.log("tezz")}
                      // light={true}
                      // light={`http://${base_url}:${port}/images/products/${
                      //   JSON.parse(item.video)[0]
                      // }`}
                    />
                  </Link>
                )
              );
            })}
          </Toolbar>
        </ScrollContainer>
      </Container>
    )
  );
}

export default Statusbar;
