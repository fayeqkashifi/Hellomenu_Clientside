import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const VariantsLine = (props) => {
  const { items, setVarantGrid } = props;
  const [values, setValues] = useState(items);
  if (Object.keys(items).length !== Object.keys(values).length) {
    setValues(items);
  }

  useEffect(() => {
    setVarantGrid({
      ...values,
    });
  }, [values]);

  let [errors, setErrors] = useState({});
  const Change = (event) => {
    const name = event.target.name;
    if (event.target.name == "image") {
      uploadImage(event);
    } else {
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
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    }
    // console.log(values);
  };
  const uploadImage = (event) => {
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      formData.append("file[]", event.target.files[i]);
    }
    const images = [];

    axios.post("/api/uploadImage", formData).then((res) => {
      if (res.data.status === 200) {
        values.image.map((item) => {
          images.push(item);
        });
        res.data.filenames.map((item) => {
          images.push(item);
        });
        setValues({
          ...values,
          image: images,
        });
      }
    });
  };
  const removeImage = (e, image) => {
    e.preventDefault();
    axios.post(`/api/removeImage/${image}`).then((res) => {
      if (res.data.status === 200) {
        setValues({
          ...values,
          image: values.image.filter((item) => item !== image),
        });
        // setImagesName(imagesName.filter((item) => item !== image));
      }
    });
  };

  const outputs = [];

  let i = 0;
  for (const [key, value] of Object.entries(values)) {
    i++;
    if (key == "sku" || key == "price" || key == "stock" || key == "image") {
      outputs.push(
        <div className={`col-xl-2 col-lg-2 col-sm-2 m-2 `} key={i}>
          <input
            className={
              errors[key] ? " form-control is-invalid" : "form-control"
            }
            disabled={key == "sku"}
            value={key == "image" ? "" : value}
            // onBlur={(event) => {
            //   changeSku(event);
            // }}
            onChange={(event) => Change(event)}
            name={key}
            type={key == "image" ? "file" : ""}
            multiple
          ></input>
          {errors[key] ? (
            <div className="invalid-feedback">{errors[key + "message"]}</div>
          ) : null}
        </div>
      );
    }
  }
  return (
    <>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <div className="row">{outputs}</div>
        </div>
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <div className="row">
            {values.image?.map((photo, i) => {
              return (
                <div className="col-xl-2 col-lg-2 col-sm-2" key={i}>
                  <div className="card ">
                    <div className="text-center">
                      <img
                        className="w-100"
                        src={`http://${base_url}:${port}/images/variants_pics/${photo}`}
                        alt=""
                        style={{
                          // width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div className="card-footer pt-0 pb-0 text-center">
                      <div className="row">
                        <Tooltip title="Delete">
                          <IconButton onClick={(e) => removeImage(e, photo)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const VariantsGrid = (props) => {
  const { t } = useTranslation();

  const { numberOfVar, productid, getJSONVaraints, recheck, setNumberOfVar } =
    props;
  const [varintGrid, setVariantGrid] = useState([]);

  useEffect(() => {
    if (numberOfVar.length !== 0) {
      setVariantGrid(numberOfVar);
    }
    setNumberOfVar(numberOfVar);
  }, [numberOfVar]);

  const vars = numberOfVar.map((item, i) => (
    <div className="row" key={i}>
      <div className={`col-xl-10 col-lg-10 col-sm-10`}>
        <VariantsLine
          recheck={recheck}
          setVarantGrid={(item) => setVarantGrid(item)}
          items={item}
          productid={productid}
        >
          {console.log("ali")}
        </VariantsLine>
      </div>

      <div className={`col-xl-2 col-lg-2 col-sm-2 `}>
        <Tooltip title="Delete">
          <IconButton onClick={(e) => removeVar(e, item.postion)}>
            {item.postion}
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
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

  const removeVar = (e, val) => {
    e.preventDefault();
    setNumberOfVar((prevState) =>
      prevState
        .filter((item) => {
          return item.postion != val;
        })
        .map((item) => {
          return {
            ...item,
            postion: item.postion > val ? item.postion - 1 : item.postion,
          };
        })
    );
  };
  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12 col-sm-12 ">
        <div className="row">
          <div className="col-md-3  p-4 text-center ">{t("sku")}</div>
          <div className="col-md-2  p-4 text-center">{t("price")}</div>
          <div className="col-md-2  p-4 text-center">{t("stock")}</div>
          <div className="col-md-3  p-4 text-center">{t("image")}</div>
          <div className="col-md-2  p-4 text-center">{t("actions")}</div>
          {/* {filterAttributes?.map((sec, i) => (
            <div className="col-md-2  p-4" key={i}>
              {sec.label}
            </div>
          ))} */}
        </div>
        {vars}
      </div>
    </Fragment>
  );
};
export default VariantsGrid;
