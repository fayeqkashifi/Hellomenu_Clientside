import React, { useState, useEffect } from "react";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import getSymbolFromCurrency from "currency-symbol-map";
import { getProduct } from "../Functionality";
import Stories from "react-insta-stories";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import axios from "axios";

function BranchStory(props) {
  const { t } = useTranslation();
  const { style, branch, deliveryFees } = props;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tagProducts, setTagProducts] = useState([]);

  const loadProdcut = async () => {
    // const recData = [];
    const response = await axios.get(`/api/getStories/${branch.id}`);
    if (response.data.status === 200) {
      setData(response.data.data);
    }
    // await JSON.parse(branch?.storyTagProducts).map(async (item) => {
    //   getProduct(item.value).then((res) => {
    //     if (res.data.status === 200) {
    //       recData.push(res.data.fetchData[0]);
    //     }
    //   });
    // });
    // setData(branch);
    // setTagProducts(recData);
    setLoading(false);
  };
  useEffect(() => {
    loadProdcut();
    return () => {
      setData([]);
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
    JSON.parse(data.storyVideos)?.map((item) => {
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
                          pathname: `/public/details/${btoa(item.id)}`,
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
            </>
          );
        },
        header: {
          heading: branch.BrancheName,
          //   subheading: branch.created_at,
          profileImage: `http://${base_url}:${port}/images/branches/${
            JSON.parse(branch.branchImages)[0]
          }`,
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
