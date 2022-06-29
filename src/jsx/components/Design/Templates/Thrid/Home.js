import React, { useState, useEffect, useContext } from "react";
import { TemplateContext } from "../TemplateContext";
import axios from "axios";
import Container from "@mui/material/Container";
import Header from "../Common/Layout/Header";
import SideBar from "../Common/Layout/SideBar";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";
import ShowCards from "../Common/ShowCards";
import {
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import Statusbar from "../Common/Story/Statusbar";
function Home(props) {
  const {
    branch,
    style,
    products,
    activeCategory,
    setProducts,
    setPage,
    page,
    lastPage,
    selectedLang,
    locale,
  } = useContext(TemplateContext);

  const [changeState, setChangeState] = useState(true);

  const fetchMoreData = () => {
    if (page <= lastPage) {
      if (activeCategory === "All~~~1") {
        getProductsBasedOnBranchId(
          branch.id,
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
            if (res !== undefined) {
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
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    return () => {
      source.cancel();
    };
  }, []);
  var viewShow_HTMLTABLE = (
    <Grid container spacing={2} className="d-flex justify-content-center">
      <ShowCards />
    </Grid>
  );

  return (
    <>
      <div style={style?.background}>
        <Container maxWidth="lg">
          <Header search={true} setChangeState={setChangeState} />
          <SideBar />
          <Statusbar />
          <Container
            className="mt-3 d-flex justify-content-center"
            style={style?.varaintContainer}
          >
            {viewShow_HTMLTABLE}
          </Container>

          {products.length >= 10 && (
            <InfiniteScroll
              dataLength={products.length} //This is important field to render the next data
              next={fetchMoreData}
              hasMore={changeState}
              loader={
                <p
                  className="text-center py-4"
                  style={{ marginBottom: "100px" }}
                >
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
          )}
        </Container>
      </div>
    </>
  );
}

export default Home;
