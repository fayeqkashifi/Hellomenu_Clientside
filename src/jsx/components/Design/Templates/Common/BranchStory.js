import React, { useState, useEffect } from "react";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import getSymbolFromCurrency from "currency-symbol-map";
import { getProduct } from "../Functionality";
import Stories from "react-insta-stories";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import profile from "../../../../../images/hellomenu/logo.svg";
import ReactPlayer from "react-player/lazy";
function BranchStory(props) {
  const { t } = useTranslation();
  const { style, branch, deliveryFees, branchStory } = props;
  console.log();
  const [loading, setLoading] = useState(true);
  const [tagProducts, setTagProducts] = useState([]);

  const loadProdcut = () => {
    const recData = [];
    const value = JSON.parse(branchStory?.storyTagProducts);
    value.map(async (item) => {
      const product = await getProduct(item.value);
      if (product.data.status === 200) {
        recData.push(product.data.fetchData[0]);
      }
    });
    setTagProducts(recData);
    setLoading(false);
  };
  useEffect(() => {
    loadProdcut();
    return () => {
      setLoading(true);
    };
  }, []);

  if (loading) {
    return (
      <div className="container ">
        <div
          className="spinner-border text-primary "
          role="status"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    const urls = [];
    branchStory?.storyVideos &&
      JSON.parse(branchStory?.storyVideos)?.map((item) => {
        urls.push({
          url: `http://${base_url}:${port}/videos/branches/${item}`,
          duration: 100000, // ignored
          type: "video",
          seeMore: () => {
            return <div></div>;
          },
          seeMoreCollapsed: () => {
            return (
              <>
                <ScrollContainer className="scroll-container">
                  <Toolbar>
                    {tagProducts?.map((item, i) => {
                      return (
                        <Link
                          to={{
                            pathname: `/public/details/${btoa(
                              btoa(btoa(item.id))
                            )}`,
                            state: {
                              style: style,
                              deliveryFees: deliveryFees,
                              branchId: branch.id,
                            },
                          }}
                          key={i}
                          className="text-center"
                        >
                          <img
                            src={`http://${base_url}:${port}/images/products/${
                              JSON.parse(item.image)[0]
                            }`}
                            alt="Image"
                            style={style?.imageVideo}
                          />
                          <small style={{ color: "#fff" }}>
                            {item.price +
                              getSymbolFromCurrency(item?.currency_code)}
                          </small>
                        </Link>
                      );
                    })}
                  </Toolbar>
                </ScrollContainer>
              </>
            );
          },
          header: {
            heading: branch.BrancheName,
            //   subheading: branch.created_at,
            profileImage:
              branch.branchImages === null
                ? profile
                : `http://${base_url}:${port}/images/branches/${
                    JSON.parse(branch.branchImages)[0]
                  }`,
          },
        });
      });
    JSON.parse(branchStory?.storyVideosUrl)?.map((item) => {
      urls.push({
        content: () => {
          return (
            <div
              className="p-2 text-center"
              style={{
                width: "100%",
                height: "100%",
                zIndex: 100000,
              }}
            >
              <div
                style={{
                  height: "70%",
                  lineBreak: "anywhere",
                  overflow: "hidden",
                  marginTop: "10%",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                {item.split(".").includes("tiktok") ? (
                  <a
                    href={item}
                    target="_blank"
                    style={{ backgroundColor: "#fff" }}
                  >
                    {item}
                  </a>
                ) : (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    style={{
                      overflow: "hidden",
                    }}
                    url={item}
                  />
                )}
              </div>
              <div
                style={{
                  height: "15%",
                  marginTop: "10%",
                }}
                className="text-center"
              >
                <ScrollContainer className="scroll-container ">
                  <Toolbar>
                    {tagProducts?.map((item, i) => {
                      return (
                        <Link
                          to={{
                            pathname: `/public/details/${btoa(
                              btoa(btoa(item.id))
                            )}`,
                            state: {
                              style: style,
                              deliveryFees: deliveryFees,
                              branchId: branch.id,
                            },
                          }}
                          key={i}
                        >
                          <img
                            src={`http://${base_url}:${port}/images/products/${
                              JSON.parse(item.image)[0]
                            }`}
                            alt="Image"
                            style={style?.imageVideo}
                          />
                          <small className="ml-1" style={{ color: "#fff" }}>
                            {item.price +
                              getSymbolFromCurrency(item?.currency_code)}
                          </small>
                        </Link>
                      );
                    })}
                  </Toolbar>
                </ScrollContainer>
              </div>
            </div>
          );
        },
      });
    });

    return (
      <div className="row" style={style?.background}>
        <div className="d-flex align-items-center justify-content-center mt-2">
          <Stories
            stories={urls}
            defaultInterval={1500}
            width={432}
            // height="auto"
            // style={{ overflow: "auto", minHeight: "500px", height: "auto" }}
          />
        </div>
      </div>
    );
  }
}
export default BranchStory;
