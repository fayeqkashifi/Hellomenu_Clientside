import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import Grid from "./Grid";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { base_url, port } from "../../../Consts";

const Variants = (props) => {
  // validation start

  // validation end
  // for localization
  const { t } = useTranslation();
  const id = props.history.location.state.id;

  // edit modal

  // insert a section

  // edit code

  // edit End
  // insert Start

  // for Pictures End
  //for retriving data using laravel API

  const [nameAttr, setNameAtter] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberOfVar, setNumberOfVar] = useState([]);
  const [jsonVaraints, setJsonVaratis] = useState("");
  const [check, setCheck] = useState(false);
  useEffect(() => {
    const getdata = async () => {
      const jsonvar = await axios({
        method: "GET",
        url: `/api/Getvariations/${id}`,
      });
      if (jsonvar.data.status == 200) {
        setJsonVaratis(jsonvar.data.fetchData);
      }

      const res = await axios({
        method: "POST",
        url: "/api/GetAttributes",
      });
      const nameAtter = {};
      res.data.fetchData.map((fetchData) => {
        nameAtter[fetchData.attributeName] = "";
      });
      if (
        res.data.fetchData.length !== attributes.length &&
        jsonvar.data.fetchData == ""
      ) {
        const varLines = [];

        res.data.fetchData.map((fetchData) => {
          nameAtter[fetchData.attributeName] = "";
        });

        varLines.push({
          postion: 0,
          sku: "",
          price: "",
          stock: "",
          ...nameAtter,
        });
        setNumberOfVar(varLines);

        setAttributes(res.data.fetchData);
      } else {
        const varLines = [];

        const arrayVar = JSON.parse(jsonvar.data.fetchData);

        arrayVar.map((fetchData) => {
          let line = {};
          let count = 0;
          for (const [key, value] of Object.entries(fetchData)) {
            if (
              key == "postion" ||
              key == "sku" ||
              key == "price" ||
              key == "stock"
            ) {
              line[key] = value;
            } else if (nameAtter.hasOwnProperty(key)) {
              line[key] = value;
            } else {
              if (count < Object.keys(nameAtter).length) {
                line[Object.keys(nameAtter)[count]] = value;
              }
              count++;
            }
          }

          varLines.push(line);
        });

        setNumberOfVar(varLines);

        setAttributes(res.data.fetchData);
      }
      setNameAtter(nameAtter);
    };

    getdata();
    setLoading(false);
  }, []);
  const CreateNewVar = () => {
    let postion = 0;
    if (numberOfVar.length > 0) {
      postion = numberOfVar.length;
    }
    setNumberOfVar([
      ...numberOfVar,
      {
        postion: postion,
        sku: "",
        price: "",
        stock: "",
        ...nameAttr,
      },
    ]);
  };
  const removeVar = () => {
    const varsLines = numberOfVar;
    varsLines.pop();
    setNumberOfVar([...varsLines]);
  };
  // select box
  const getJSONVaraints = (items) => {
    setJsonVaratis(items);
  };
  const saveVaraiants = async () => {
    if (numberOfVar.length === JSON.parse(jsonVaraints).length) {
      const formdata = new FormData();
      formdata.append("product_id", id);
      formdata.append("vars", jsonVaraints);
      const res = await axios({
        method: "post",
        data: formdata,
        url: "/api/saveVars",
      });
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
      } else {
        swal("error", res.data.message, "error");
      }
    } else {
      console.log(jsonVaraints);
      return;
    }
  };
  const recheckitem = (item) => {
    console.log(item);
  };
  var branchID = 0;
  var CategoryID = 0;
  var sub_category_id = 0;
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    return (
      <Fragment>
        <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
          <CBreadcrumbItem className="font-weight-bold" href="/branches">
            {t("Branches")}
          </CBreadcrumbItem>
          <CBreadcrumbItem
            className="font-weight-bold"
            href={`/category/${branchID}`}
          >
            {t("categories")}
          </CBreadcrumbItem>
          <CBreadcrumbItem
            className="font-weight-bold"
            href={`/sub-category/${CategoryID}`}
          >
            {t("sub_category")}
          </CBreadcrumbItem>
          <CBreadcrumbItem
            className="font-weight-bold"
            href={`/products/${sub_category_id}`}
          >
            {t("products")}{" "}
          </CBreadcrumbItem>
          <CBreadcrumbItem active> {t("variants")} </CBreadcrumbItem>
        </CBreadcrumb>
        {/* <PageTItle headingPara={t('variants')} activeMenu={t('variant_list')} motherMenu={t('variants')} /> */}
        {/* <!-- Insert  Modal for Attribute --> */}

        {/* <!-- Insert  Modal for variant  --> */}

        {/* Edit Modal */}

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            <div className="card ">
              <div className="col-xl-12 col-lg-12 col-sm-12 ">
                <Grid
                  recheck={(item) => {
                    recheckitem(item);
                  }}
                  getJSONVaraints={(items) => getJSONVaraints(items)}
                  numberOfVar={numberOfVar}
                  attributes={attributes}
                  productid={id}
                ></Grid>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-sm-12">
            <div className="row ">
              <div className="col-xl-1 col-lg-1 col-sm-1">
                <Button onClick={CreateNewVar}> Add Variant</Button>
              </div>
              <div className="col-xl-1 col-lg-1 col-sm-1">
                <Button onClick={removeVar}>Remove Variant</Button>
              </div>
              <div className="col-xl-1 col-lg-1 col-sm-1">
                <Button onClick={saveVaraiants}> Save Variants</Button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default Variants;
