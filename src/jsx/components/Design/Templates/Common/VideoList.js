import React, { useState } from "react";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../Consts";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Link } from "react-router-dom";
import {
  getCategoriesBasedProduct,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

var hold = 1;

function VideoList(props) {
  const { t } = useTranslation();

  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const deliveryFees = props.history.location.state.deliveryFees;
  const categories = props.history.location.state.categories;
  const [products, setProducts] = useState(
    props.history.location.state.products
  );
  const [changeState, setChangeState] = useState(true);

  const fetchMoreData = () => {
    if (hold < categories.length) {
      getCategoriesBasedProduct(branch.id).then((data) => {
        if (data[hold]?.sub_category_id === null) {
          getProductBasedOnCategory(data[hold]?.category_id).then((res) => {
            hold = hold + 1;
            setProducts(products.concat(res));
          });
        } else {
          getProductBasedOnSubCategory(data[hold]?.sub_category_id).then(
            (value) => {
              hold = hold + 1;
              setProducts(products.concat(value));
            }
          );
        }
      });
    } else {
      setChangeState(false);
    }
  };

  return (
    <div style={style?.background}>
      <div className="row p-5">
        <div className="col">
          <Link
            to={{
              pathname: `/public/video`,
              state: {
                style: style,
                branch: branch,
                deliveryFees: deliveryFees,
                branchState: true,
                deliveryFees: deliveryFees,
              },
            }}
            style={style?.headerVideos}
          >
            <ReactPlayer
              width="150px"
              height="200px"
              style={style?.statusPlayer}
              url={`http://${base_url}:${port}/videos/branches/${
                JSON.parse(branch.branchVideos)[0]
              }`}
              //   controls={true}
              playing={false}
              playIcon={<PlayCircleOutlineIcon fontSize="large" />}
              light={`http://${base_url}:${port}/images/branches/${
                JSON.parse(branch.branchImages)[0]
              }`}
            />
          </Link>
        </div>
        {products.map((item) => {
          return (
            item.video && (
              <div className="col" key={item.id}>
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
  );
}

export default VideoList;
