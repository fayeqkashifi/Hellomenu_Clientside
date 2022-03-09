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
import Grid from "@mui/material/Grid";

import ShowCards from "./ShowCards";
var hold = 1;

function VideoDetails(props) {
  const { t } = useTranslation();

  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const deliveryFees = props.history.location.state.deliveryFees;
  const categories = props.history.location.state.categories;
  const product = props.history.location.state.product;
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
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const properties = {
    branchId: branch.id,
    deliveryFees: deliveryFees,
    setCart: setCart,
    cart: cart,
    style: style,
  };
  return (
    <div style={style?.background}>
      <div className="row p-3">
        <div className="d-flex align-items-center justify-content-center">
          <ReactPlayer
            width="200px"
            height="300px"
            style={style?.statusPlayer}
            url={`http://${base_url}:${port}/videos/products/${
              JSON.parse(product.video)[0]
            }`}
            controls={true}
            playing={false}
          />
        </div>
      </div>
      <div className=" p-3">
        <Grid container spacing={2} className="d-flex justify-content-center">
          <ShowCards {...properties} products={products} />
        </Grid>
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

export default VideoDetails;
