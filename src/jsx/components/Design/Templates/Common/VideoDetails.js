import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../Consts";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";
import ShowCards from "./ShowCards";

function VideoDetails(props) {
  const { t } = useTranslation();

  const style = props.history.location.state.style;
  const branch = props.history.location.state.branch;
  const deliveryFees = props.history.location.state.deliveryFees;
  const product = props.history.location.state.product;
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [changeState, setChangeState] = useState(true);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (product?.sub_category_id === null) {
      getProductBasedOnCategory(product?.category_id, page).then((res) => {
        setProducts(res.data);
        setLastPage(res.last_page);
        setValue("cate~~~" + product?.category_id);
        setPage(page + 1);
      });
    } else {
      getProductBasedOnSubCategory(product?.sub_category_id, page).then(
        (res) => {
          setValue("sub~~~" + product?.sub_category_id);
          setProducts(res.data);
          setLastPage(res.last_page);
          setPage(page + 1);
        }
      );
    }
  }, []);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      const data = value?.split("~~~");
      if (data[0] === "cate") {
        getProductBasedOnCategory(data[1], page).then((res) => {
          setProducts(products.concat(res.data));
          setPage(page + 1);
        });
      } else if (data[0] === "sub") {
        getProductBasedOnSubCategory(data[1], page).then((res) => {
          setProducts(products.concat(res.data));
          setPage(page + 1);
        });
      }
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
