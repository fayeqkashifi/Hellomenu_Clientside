import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
const VariantsLine = (props) => {
  const { items, attributes, productid, setVarantGrid } = props;
  const [values, setValues] = useState(items);
  let [errors, setErrors] = useState({});
  const genrateSku = () => {
    let sku = productid + "-";
    let c = 1;
    attributes.map((atter) => {
      if (values[atter.attributeName] != "") {
        if (c == attributes.length) {
          sku += values[atter.attributeName];
        } else {
          sku += values[atter.attributeName] + "-";
        }
      }
      c++;
    });
    return sku;
  };
  const Change = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const changeSku = (event) => {
    const name = event.target.name;
    const check = attributes.some((attribute) => {
      return attribute.attributeName === name;
    });

    if (!check) {
      const error = {};
      if (isNaN(event.target.value)) {
        error[name] = true;
        error[name + "message"] = "Please Enter A Real Number";
        setErrors({ ...errors, ...error });
      } else {
        error[name] = false;
        error[name + "message"] = "";
        setErrors({ ...errors, ...error });
      }
    }
    let sku = genrateSku();

    if (sku != "") {
      setValues({
        ...values,
        sku: sku,
      });
      setVarantGrid(values);
    }
  };
  const outputs = [];
  for (const [key, value] of Object.entries(values)) {
    if (key != "postion") {
      outputs.push(
        <div className="col-xl-2 col-lg-2 col-sm-2 p-4">
          <input
            className={
              errors[key] ? " form-control is-invalid" : "form-control"
            }
            disabled={key == "sku"}
            value={value}
            onBlur={(event) => {
              changeSku(event);
            }}
            onChange={(event) => Change(event)}
            name={key}
          ></input>
          {errors[key] ? (
            <div className="invalid-feedback">{errors[key + "message"]}</div>
          ) : null}
        </div>
      );
    }
  }
  return (
    <div className="col-xl-12 col-lg-12 col-sm-12 ">
      <div className="row">{outputs}</div>
    </div>
  );
};
const VariantsGrid = (props) => {
  const { attributes, numberOfVar, productid, getJSONVaraints } = props;
  const [varintGrid, setVariantGrid] = useState([]);
  const setVarantGrid = (item) => {
    if (item.sku !== "") {
      let modifyVariant = varintGrid;
      modifyVariant[item.postion] = item;
      setVariantGrid(modifyVariant);
    }
    getJSONVaraints(JSON.stringify(varintGrid));
  };
  return (
    <Fragment>
      <div class="col-xl-12 col-lg-12 col-sm-12 ">
        <div className="d-flex flex-row">
          <div class="col-md-2  p-4">SKU</div>
          <div class="col-md-2  p-4">price</div>
          <div class="col-md-2  p-4">Stock</div>

          {attributes.map((sec) => (
            <div class="col-md-2  p-4">{sec.attributeName}</div>
          ))}
        </div>
        {numberOfVar.map((item) => (
          <VariantsLine
            key={item.postion}
            setVarantGrid={(item) => setVarantGrid(item)}
            items={item}
            productid={productid}
            attributes={attributes}
          ></VariantsLine>
        ))}
      </div>
    </Fragment>
  );
};
export default VariantsGrid;
