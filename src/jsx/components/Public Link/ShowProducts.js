import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { base_url, port } from "../../../Consts";

// import Slider from "react-slick";

const ShowProducts = (props) => {
  // for localization
  const { t } = useTranslation();
  const id = props.match.params.id;
  let varData = [];
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [showVaralint, setShowVarlist] = useState([]);
  const [variantsWithPictures, setVariantsWithPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuarray, setSkuArray] = useState([]);
  const [productDetails, setProductDetails] = useState({ price: 0, stock: 0,image:fetchData.image });
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
    //   .get(`/api/GetVariantsBasedOnProductWithPictures/${id}`)
    //   .then((res) => {
    //     if (res.data.status === 200) {
    //       setVariantsWithPictures(res.data.fetchData);
    //       // console.log(res.data.fetchData);
    //     }
    //   });
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
      const newProductDetails = { price: line.price, stock: line.stock, image: line.image };
      productdetails = newProductDetails;
    } else {
      const newProductDetails = { price: 0, stock: "No Stock", image: fetchData.image  };
      productdetails = newProductDetails;
    }
    // console.log(productdetails);
    setProductDetails({ ...productdetails });
  };
  const parseVariants = (variantData) => {
    const variants = [];
    const savePostion = ["postion", "sku", "price", "stock","image"];
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
    var att;
    viewImages_HTMLTABLE = (
      <>
        <div className="col-xl-12 col-lg-12 col-sm-12 my-2">
          <div className="card overflow-hidden">
            <div className="text-center">
              <div className="profile-photo">
                <img
                  style={{ height: "200px", objectFit: "contain" }}
                  src={productDetails.stock==="No Stock"? `http://${base_url}:${port}/images/products/${productDetails.image}` : `http://${base_url}:${port}/images/variants_pics/${productDetails.image}`}
                  className="d-block w-100 img-thumbnail"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-sm-12">
          <div className="card border">
            <div className="row mx-3 mt-3">
              <h4>
                {t("product_name")}: {fetchData.ProductName}
              </h4>
              <p>
                {t("description")}: {fetchData.Description}
              </p>
              <p>
                {t("unit")}: {fetchData.UnitName}
              </p>
              <p>Price : {productDetails.price}</p>
              <p>Stock: {productDetails.stock}</p>
            </div>
            <div className="row m-3">
              <h4> {t("vatiants")}</h4>
            </div>
            <div class="row ">
              <>
                {Object.keys(showVaralint).map((list, i) => {
                  return (
                    <div className="row">
                      <div className="col md-12">
                        {list}
                        <div className="row">
                          {showVaralint[list].map((variant) => {
                            return (
                              <div className="col-md-1 ">
                                <div
                                  onClick={() => {
                                    changePrice(list, variant);
                                  }}
                                  style={
                                    skuarray[i] == variant
                                      ? {
                                          padding: "10px",
                                          border: "1px solid",
                                          textAlign: "center",
                                          borderRadius: "10px",
                                          borderColor: "red",
                                        }
                                      : {
                                          padding: "10px",
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
              </>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="container">
      <Fragment>
        {/* <PageTItle headingPara={t('variants')} activeMenu={t('variant_details')} motherMenu={t('variants')} /> */}
        {/* <!-- Insert  Modal --> */}
        <div className="row">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 ">
            <div className="row">{viewImages_HTMLTABLE}</div>
            <div className="row"></div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default ShowProducts;
