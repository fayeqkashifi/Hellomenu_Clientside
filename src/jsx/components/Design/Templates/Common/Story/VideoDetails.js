import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player/lazy";
import { base_url, port } from "../../../../../../Consts";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../../Functionality";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";
import ShowCards from "../ShowCards";
import { TemplateContext } from "../../TemplateContext";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PublicRoute from "../../../../PublicRoute";
import MainDetails from "../../MainDetails";
export function Show(props) {
  const { style, locale, selectedLang } = useContext(TemplateContext);
  const product = props.history.location.state.product;
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [changeState, setChangeState] = useState(true);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const dataLoad = () => {
    if (product?.sub_category_id === null) {
      getProductBasedOnCategory(
        product?.category_id,
        page,
        selectedLang.id,
        source
      ).then((res) => {
        if (res !== undefined) {
          setData(res.data);
          setLastPage(res.last_page);
          setValue("cate~~~" + product?.category_id);
          setPage(page + 1);
          setLoading(false);
        }
      });
    } else {
      getProductBasedOnSubCategory(
        product?.sub_category_id,
        page,
        selectedLang.id,
        source
      ).then((res) => {
        if (res != undefined) {
          setValue("sub~~~" + product?.sub_category_id);
          setData(res.data);
          setLastPage(res.last_page);
          setPage(page + 1);
          setLoading(false);
        }
      });
    }
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
      setPage(1);
      setLastPage(1);
      setValue("");
      setData([]);
    };
  }, []);
  const fetchMoreData = () => {
    if (page <= lastPage) {
      const data = value?.split("~~~");
      if (data[0] === "cate") {
        getProductBasedOnCategory(data[1], page, selectedLang.id, source).then(
          (res) => {
            if (res !== undefined) {
              setData(data.concat(res.data));
              setPage(page + 1);
            }
          }
        );
      } else if (data[0] === "sub") {
        getProductBasedOnSubCategory(
          data[1],
          page,
          selectedLang.id,
          source
        ).then((res) => {
          if (res !== undefined) {
            setData(data.concat(res.data));
            setPage(page + 1);
          }
        });
      }
    } else {
      setChangeState(false);
    }
  };
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only"></span>
      </div>
    );
  } else {
    return (
      <div style={style?.background}>
        <div className="row p-3">
          <div className="d-flex align-items-center justify-content-center">
            {product?.video ? (
              <ReactPlayer
                width="40%"
                height="50vh"
                url={`http://${base_url}:${port}/videos/products/${
                  JSON.parse(product.video)[0]
                }`}
                controls={true}
                playing={false}
              />
            ) : (
              <ReactPlayer
                width="40%"
                height="50vh"
                style={style?.reactPlayerStyle}
                url={JSON.parse(product?.videosUrl)[0]}
              ></ReactPlayer>
            )}
          </div>
        </div>
        <div className=" p-3">
          <Grid container spacing={2} className="d-flex justify-content-center">
            <ShowCards check={true} />
          </Grid>
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

function VideoDetails(props) {
  const { path } = useRouteMatch();

  return (
    <Router>
      <Switch>
        <PublicRoute exact path={`${path}`} component={Show} />
        <PublicRoute path={`${path}/details/:id`} component={MainDetails} />
      </Switch>
    </Router>
  );
}
export default VideoDetails;
