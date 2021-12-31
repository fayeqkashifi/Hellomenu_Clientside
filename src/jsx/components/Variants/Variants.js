import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import Grid from "./Grid";
import { CBreadcrumb } from "@coreui/react";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";

const Variants = (props) => {
  // for localization
  const history = useHistory();

  const { t } = useTranslation();
  const id = props.history.location.state.id;

  const [nameAttr, setNameAtter] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [filterAttributes, setfilterAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberOfVar, setNumberOfVar] = useState([]);
  const [jsonVaraints, setJsonVaratis] = useState("");

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
        method: "GET",
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
          image: [],
          // ...nameAtter,
        });
        // setNameAtter(nameAtter);

        setNumberOfVar(varLines);
        setAttributes(res.data.fetchData);
      } else {
        const varLines = [];

        const arrayVar = JSON.parse(jsonvar.data.fetchData);
        const AttNames = {};

        arrayVar.map((fetchData) => {
          const attrFilterName = [];

          let line = {};
          let count = 0;
          for (const [key, value] of Object.entries(fetchData)) {
            if (
              key == "postion" ||
              key == "sku" ||
              key == "price" ||
              key == "stock" ||
              key == "image"
            ) {
              line[key] = value;
            } else if (nameAtter.hasOwnProperty(key)) {
              line[key] = value;
              attrFilterName.push({
                value: key,
                label: key,
              });
              AttNames[key] = "";
            } else {
              if (count < Object.keys(nameAtter).length) {
                line[Object.keys(nameAtter)[count]] = value;
              }
              count++;
            }
          }

          varLines.push(line);
          setfilterAttributes(attrFilterName);
        });
        setNameAtter(AttNames);
        // console.log(nameAttr);

        setNumberOfVar(varLines);
        setAttributes(res.data.fetchData);
      }
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
        image: [],
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

  // select box
  const handleSelectEvent = (e) => {
    const nameAtter = {};
    // console.log(filterAttributes);
    // console.log(e);

    const inputFilter = filterAttributes?.length ? filterAttributes?.length : 0;
    const input = e?.length ? e?.length : 0;
    if (input > inputFilter) {
      if (inputFilter === 0) {
        e?.map((item) => {
          nameAtter[item.label] = "";
          numberOfVar.map((vars) => {
            vars[item.label] = vars[item.label] ? vars[item.label] : "";
          });
        });
      } else {
        e?.map((item) => {
          nameAtter[item.label] = "";
          numberOfVar.map((vars) => {
            vars[item.label] = vars[item.label] ? vars[item.label] : "";
          });
        });
      }
    } else if (input < inputFilter) {
      if (input === 0) {
        var uniqueResultOne = filterAttributes;
      } else {
        var uniqueResultOne = filterAttributes.filter(function (obj) {
          return !e.some(function (obj2) {
            return obj.value == obj2.value;
          });
        });
      }
      const label = uniqueResultOne[0].label;
      numberOfVar.map((vars) => {
        delete vars[label];
      });
      e?.map((item) => {
        nameAtter[item.label] = "";
      });
    }

    // Object.keys(vars).splice(index, 1);
    //   console.log(vars);
    setfilterAttributes(e);
    setNameAtter(nameAtter);
    setNumberOfVar(numberOfVar);
  };
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
          <Link
            className="font-weight-bold"
            to=""
            onClick={() => history.goBack()}
          >
            {t("back_to_products_list")}
          </Link>
        </CBreadcrumb>

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            <div className="card ">
              <Select
                value={filterAttributes}
                isMulti
                options={attributes.map((o, i) => {
                  return { value: o.attributeName, label: o.attributeName };
                })}
                onChange={handleSelectEvent}
                // name="attributeName"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          </div>
        </div>

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
                  filterAttributes={filterAttributes}
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
