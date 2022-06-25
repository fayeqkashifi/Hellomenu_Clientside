import React, { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";
import ShowCards from "../Common/ShowCards";
import {
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Statusbar from "../Common/Story/Statusbar";
import Container from "@mui/material/Container";
import Header from "../Common/Layout/Header";
import axios from "axios";
import { TemplateContext } from "../TemplateContext";

export default function Home() {
  const {
    products,
    style,
    branchId,
    activeCategory,
    setProducts,
    setPage,
    page,
    lastPage,
    selectedLang,
    locale,
  } = useContext(TemplateContext);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      if (activeCategory === "All~~~1") {
        getProductsBasedOnBranchId(
          branchId,
          page,
          selectedLang.id,
          source
        ).then((data) => {
          if (data !== undefined) {
            setProducts(products.concat(data.data));
            setPage(page + 1);
          }
        });
      } else {
        const data = activeCategory?.split("~~~");
        if (data[1] === "cate") {
          getProductBasedOnCategory(
            data[2],
            page,
            selectedLang.id,
            source
          ).then((data) => {
            if (data !== undefined) {
              setProducts(products.concat(data.data));
              setPage(page + 1);
            }
          });
        } else if (data[1] === "sub") {
          getProductBasedOnSubCategory(
            data[2],
            page,
            selectedLang.id,
            source
          ).then((res) => {
            if (data !== undefined) {
              setProducts(products.concat(res.data));
              setPage(page + 1);
            }
          });
        }
      }
    } else {
      setChangeState(false);
    }
  };

  const [changeState, setChangeState] = useState(true);

  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    setChangeState(true);

    return () => {
      source.cancel();
    };
  }, [selectedLang]);

  return (
    <div>
      {" "}
      <Header search={true} setChangeState={setChangeState} />
      <Statusbar />
      <Container
        className="mt-3 d-flex justify-content-center"
        style={style?.varaintContainer}
      >
        <Grid container spacing={2} className="d-flex justify-content-center">
          <ShowCards />
        </Grid>
      </Container>
      {products.length >= 10 && (
        <InfiniteScroll
          dataLength={products.length}
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
              <b style={style?.cartDescription}>
                {locale?.yay_you_have_seen_it_all}
              </b>
            </p>
          }
        ></InfiniteScroll>
      )}
    </div>
  );
}
