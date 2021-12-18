import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { base_url, port } from "../../../../../Consts";

import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../style.css";
const ShowProducts = (props) => {
  // for localization
  const { t } = useTranslation();

  const id = atob(props.match.params.id);
  const themes = props.history.location.state.themes;
  let varData = [];
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [showVaralint, setShowVarlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuarray, setSkuArray] = useState([]);
  const [productDetails, setProductDetails] = useState({
    price: 0,
    stock: 0,
    image: fetchData?.image,
  });
  useEffect(() => {
    const getdata = async () => {
      const product = await axios({
        method: "GET",
        url: `/api/GetProduct/${id}`,
      });
      const data = product.data.fetchData;

      const res = await axios({
        method: "GET",
        url: `/api/Getvariations/${id}`,
      });
      setFetchData(data[0]);
      if (res.data.fetchData !== "") {
        varData = JSON.parse(res.data.fetchData);
        parseVariants(varData);
      }

      setLoading(false);
    };
    getdata(); // axios
  }, [id]);
  const changePrice = (varName, variant) => {
    const keys = Object.keys(showVaralint);
    const varlineindex = keys.indexOf(varName);
    const newSkuArray = skuarray;
    newSkuArray[varlineindex] = variant;
    setSkuArray(newSkuArray);
    if (keys.length == newSkuArray.length) {
      caluclatePrice(newSkuArray, variantData);
    }
  };
  const caluclatePrice = (newSkuArray, variantData) => {
    let sku = id + "-";
    for (let i = 0; i < newSkuArray.length; i++) {
      if (i == newSkuArray.length - 1) {
        sku += newSkuArray[i];
      } else {
        sku += newSkuArray[i] + "-";
      }
    }

    const priceList = variantData.filter((item) => {
      return item.sku.replace(/\s+/g, "") == sku.replace(/\s+/g, "");
    });
    console.log(newSkuArray);
    let productdetails = { price: 0, stock: 0 };
    if (priceList.length !== 0) {
      const line = priceList.pop();
      const newProductDetails = {
        price: line.price,
        stock: line.stock,
        image: line.image,
      };
      productdetails = newProductDetails;
    } else {
      const newProductDetails = {
        price: 0,
        stock: "No Stock",
        image: fetchData.image,
      };
      productdetails = newProductDetails;
    }
    setProductDetails({ ...productdetails });
  };
  const parseVariants = (variantData) => {
    const variants = [];
    const savePostion = ["postion", "sku", "price", "stock", "image"];
    const varLine = variantData[0];
    const varlinekey = Object.keys(varLine);
    for (let i = 0; i < varlinekey.length; i++) {
      if (savePostion.indexOf(varlinekey[i]) == -1) {
        let listvar = variantData.map((item) => {
          return item[varlinekey[i]];
        });
        // get unique variants
        listvar = listvar.filter(
          (thing, index, self) =>
            index ===
            self.findIndex((t) => t.place === listvar.place && t === thing)
        );
        if (listvar[0] != 0) variants[varlinekey[i]] = listvar;
      }
    }
    let def = [];
    Object.keys(variants).map((item) => {
      def.push(variants[item][0]);
    });
    setSkuArray(def);
    caluclatePrice(def, variantData);
    setShowVarlist(variants);
    setVariantData(variantData);
  };
  const [ingredients, setIntgredients] = useState([]);
  const changeIngredients = (label) => {
    if (!ingredients.includes(label) === false) {
      setIntgredients(ingredients.filter((item) => item !== label));
    } else {
      setIntgredients([...ingredients, label]);
    }
  };
  let [sum, setSum] = useState(0);

  const extraHandlers = (e, price) => {
    if (e.target.checked) {
      // console.log((sum += parseInt(price)));
      setSum((sum += parseInt(price)));
    } else {
      setSum((sum -= parseInt(price)));
    }
  };

  const zoomOutProperties = {
    duration: 100,
    transitionDuration: 5,
    canSwipe: true,
    indicators: true,
    scale: false,
    autoplay: false,
    indicators: (i) => (
      <div className="indicator">
        <img
          src={
            productDetails?.stock === "No Stock" || productDetails?.stock === 0
              ? `http://${base_url}:${port}/images/products/${fetchData?.image}`
              : `http://${base_url}:${port}/images/variants_pics/${productDetails.image[i]}`
          }
          width="40px"
          // className="p-1"
          // style={{ width: "40px" }}
        />
      </div>
    ),
  };

  var viewImages_HTMLTABLE = "";
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
    viewImages_HTMLTABLE = (
      <div className="row p-2">
        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
          <div className="row col-md-12 text-center ">
            <Zoom {...zoomOutProperties}>
              {(() => {
                if (Array.isArray(productDetails.image)) {
                  return productDetails.image?.map((image) => {
                    return (
                      <div key={image} style={{ width: "100%" }}>
                        <img
                          src={`http://${base_url}:${port}/images/variants_pics/${image}`}
                          style={{
                            height: "500px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                          // className="img-thumbnail"
                          alt=""
                        />
                      </div>
                    );
                  });
                } else {
                  return (
                    <div style={{ width: "100%" }}>
                      <img
                        src={
                          productDetails.stock === "No Stock" ||
                          productDetails?.stock === 0
                            ? `http://${base_url}:${port}/images/products/${
                                productDetails.image
                                  ? productDetails?.image
                                  : fetchData?.image
                              }`
                            : `http://${base_url}:${port}/images/variants_pics/${productDetails.image}`
                        }
                        style={{
                          height: "500px",
                          width: "100%",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                    </div>
                  );
                }
              })()}
            </Zoom>
          </div>
        </div>

        <div className="col-xl-7 col-lg-7 col-sm-12">
          <div className="card border">
            <div className="row mx-3 mt-3">
              <h4>
                {t("product_name")}: {fetchData?.ProductName}
              </h4>
              <p>
                {t("description")}: {fetchData?.Description}
              </p>
              <p>
                {t("unit")}: {fetchData?.UnitName}
              </p>
              {themes?.preparation_time != 0 ? (
                <p>
                  {t("preparation_Time")}: {fetchData?.preparationTime} Minutes
                </p>
              ) : (
                " "
              )}
              <p>
                {t("price")} :{" "}
                {productDetails.price === 0
                  ? fetchData?.price + sum
                  : parseInt(productDetails.price) + sum}
              </p>
              <p>
                {t("stock")}:{" "}
                {productDetails.stock === 0
                  ? fetchData?.stock
                  : productDetails.stock}
              </p>
            </div>
            <div className="row mx-3">
              <h4> {t("ingredients")}</h4>
              <small>Please select the ingredients you want to remove.</small>
            </div>
            <div className="row mx-4">
              {JSON.parse(fetchData.ingredients)?.map((item, i) => {
                return (
                  <div
                    className="col-md-auto col-sm-auto col-xl-auto col-lg-auto col-auto"
                    onClick={() => {
                      changeIngredients(item.label);
                    }}
                    style={
                      ingredients.includes(item.label)
                        ? {
                            cursor: "pointer",

                            padding: "3px",
                            margin: "2px",
                            border: "1px solid",
                            textAlign: "center",
                            borderColor: "red",
                            textDecoration: "line-through",
                            color: "red",
                          }
                        : {
                            cursor: "pointer",
                            padding: "3px",
                            margin: "2px",
                            border: "1px solid",
                            textAlign: "center",
                            // borderRadius: "10px",
                            borderColor: "black",
                          }
                    }
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="row m-3">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{t("extras")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <FormGroup>
                      {JSON.parse(fetchData.extras)?.map((item, i) => {
                        return (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  extraHandlers(e, item.price);
                                }}
                                color="secondary"
                              />
                            }
                            label={
                              item.label + " ( +" + item.price + ".00" + " )"
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>

            <div className="row m-3">
              <h4> {t("vatiants")}</h4>
            </div>

            <div className="row mx-2">
              {Object.keys(showVaralint).map((list, i) => {
                return (
                  <div className="row " key={i}>
                    <div className="col-md-auto col-sm-auto col-xl-auto col-lg-auto col-auto">
                      {list}
                      <div className="row">
                        {showVaralint[list].map((variant) => {
                          return (
                            <div className="col-md-auto col-sm-auto col-xl-auto col-lg-auto col-auto">
                              <div
                                onClick={() => {
                                  changePrice(list, variant);
                                }}
                                style={
                                  skuarray[i] == variant
                                    ? {
                                        cursor: "pointer",
                                        margin: "2px",
                                        padding: "5px",
                                        border: "1px solid",
                                        textAlign: "center",
                                        borderRadius: "10px",
                                        borderColor: "red",
                                      }
                                    : {
                                        cursor: "pointer",
                                        margin: "2px",

                                        padding: "5px",
                                        border: "1px solid",
                                        textAlign: "center",
                                        borderRadius: "10px",
                                        borderColor: "black",
                                      }
                                }
                              >
                                {variant}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <> {viewImages_HTMLTABLE}</>;
};

export default ShowProducts;
