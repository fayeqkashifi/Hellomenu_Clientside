import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const VariantsLine = (props) => {
  const { items, filerAttributes, productid, setVarantGrid } = props;
  const [values, setValues] = useState(items);
  if (Object.keys(items).length !== Object.keys(values).length) {
    setValues(items);
  }

  let [errors, setErrors] = useState({});
  useEffect(() => {
    setVarantGrid({
      ...values,
    });
    // setValues(items);
  }, [values]);
  const genrateSku = () => {
    let sku = productid + "-";
    let c = 1;
    filerAttributes.map((atter) => {
      if (values[atter.label] != "") {
        if (c == filerAttributes.length) {
          sku += values[atter.label];
        } else {
          sku += values[atter.label] + "-";
        }
      }
      c++;
    });

    return sku;
  };
  const Change = (event) => {
    if (event.target.name == "image") {
      uploadImage(event, event.target.files[0]);
      // console.log(event.target.files[0]);
      // setValues({
      //   ...values,
      //   [event.target.name]: 'image',
      // });
    } else {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    }
    console.log(values);
  };
  const uploadImage = (event, image) => {
    const formData = new FormData();
    formData.append("image", image);
    axios.post("/api/uploadImage", formData).then((res) => {
      if (res.data.status === 200) {
        setValues({
          ...values,
          [event.target.name]: res.data.filename,
        });
      }
    });
  };
  const changeSku = (event) => {
    const name = event.target.name;
    const check = filerAttributes.some((attribute) => {
      return attribute.label === name;
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
    }
    console.log({
      [event.target.name]: event.target.value,
      ...values,
      sku: sku,
    });
  };

  // console.log(items);
  // console.log(values);
  const outputs = [];
  for (const [key, value] of Object.entries(values)) {
    if (key != "postion") {
      outputs.push(
        <div className="col-xl-2 col-lg-2 col-sm-2 p-4  ">
          <input
            className={
              errors[key] ? " form-control is-invalid" : "form-control"
            }
            disabled={key == "sku"}
            value={key == "image" ? "" : value}
            onBlur={(event) => {
              changeSku(event);
            }}
            onChange={(event) => Change(event)}
            name={key}
            type={key == "image" ? "file" : ""}
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
  const { filerAttributes, numberOfVar, productid, getJSONVaraints, recheck } =
    props;
  const [varintGrid, setVariantGrid] = useState([]);

  useEffect(() => {
    if (numberOfVar.length !== 0) {
      setVariantGrid(numberOfVar);
    }
  }, [numberOfVar]);
  const vars = numberOfVar.map((item) => (
    <VariantsLine
      recheck={recheck}
      key={item.postion}
      setVarantGrid={(item) => setVarantGrid(item)}
      items={item}
      productid={productid}
      filerAttributes={filerAttributes}
    ></VariantsLine>
  ));

  const setVarantGrid = (item) => {
    if (item.sku !== "") {
      let modifyVariant = varintGrid;

      modifyVariant[item.postion] = item;
      setVariantGrid(modifyVariant);
      getJSONVaraints(JSON.stringify(varintGrid));
    } else {
      console.log("fssds");
    }
  };

  return (
    <Fragment>
      <div class="col-xl-12 col-lg-12 col-sm-12 ">
        <div className="row">
          <div class="col-md-2  p-4">SKU</div>
          <div class="col-md-2  p-4">price</div>
          <div class="col-md-2  p-4">Stock</div>
          <div class="col-md-2  p-4">Image</div>

          {filerAttributes?.map((sec) => (
            <div class="col-md-2  p-4">{sec.label}</div>
          ))}
        </div>
        {vars}
      </div>
    </Fragment>
  );
};
export default VariantsGrid;
