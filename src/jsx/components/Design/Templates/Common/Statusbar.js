import React from "react";
import Toolbar from "@mui/material/Toolbar";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../Consts";
import HorizontalScroller from "react-horizontal-scroll-container";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Link } from "react-router-dom";
function Statusbar(props) {
  let { style, products, branchId, deliveryFees } = props;
  const checkProduct = products.filter((item)=>item.video!==null);
  return (
    checkProduct.length !== 0 &&(
    <>
      <div className="d-flex justify-content-between m-1">
        <span style={style?.headerVideos}>Videos</span>
        {/* <Link
          to={{
            pathname: `/public/video`,
            state: {
              style: style,
              branchId: branchId,
            },
          }}
          style={style?.headerVideos}
        >
          List of Videos
        </Link> */}
      </div>

      <HorizontalScroller >
        <Toolbar >
          {products.map((item) => {
            return (
              item.video && (
                <Link
                  to={{
                    pathname: `/public/video`,
                    state: {
                      style: style,
                      branchId: branchId,
                      product_id: item.id,
                      deliveryFees: deliveryFees,
                    },
                  }}
                  key={item.id}
                  style={style?.headerVideos}
                >
                  <ReactPlayer
                    width="150px"
                    height="200px"
                    style={style?.statusPlayer}
                    url={`http://${base_url}:${port}/images/products/${item.video}`}
                    //   controls={true}
                    playing={false}
                    playIcon={<PlayCircleOutlineIcon fontSize="large" />}
                    light={`http://${base_url}:${port}/images/products/${
                      JSON.parse(item.image)[0]
                    }`}
                  />
                </Link>
              )
            );
          })}
        </Toolbar>
      </HorizontalScroller>
    </>
    )
  );
}

export default Statusbar;
