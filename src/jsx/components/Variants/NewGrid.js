import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import swal from "sweetalert";
import { Button } from "react-bootstrap";

const NewGrid = (props) => {
  const { t } = useTranslation();

  const { numberOfVar, productid, setNumberOfVar } = props;

  const saveVaraiants = async () => {
    const formdata = new FormData();
    formdata.append("product_id", productid);
    formdata.append("vars", JSON.stringify(numberOfVar));
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
  };
  const [values, setValues] = useState([]);
  let [errors, setErrors] = useState({});
  const Change = (event, item, index) => {
    if (event.target.name == "image") {
      uploadImage(event, index);
    } else {
      setNumberOfVar((prev) => {
        return prev.map((item, i) => {
          if (i !== index) {
            return item;
          }
          return {
            ...item,
            [event.target.name]: event.target.value,
          };
        });
      });
    }
  };
  const uploadImage = (event, index) => {
    const val = numberOfVar.filter((item, i) => {
      if (i === index) {
        return item;
      }
    });
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      formData.append("file[]", event.target.files[i]);
    }
    const images = [];

    axios.post("/api/uploadImage", formData).then((res) => {
      if (res.data.status === 200) {
        val[0].image.map((item) => {
          images.push(item);
        });
        res.data.filenames.map((item) => {
          images.push(item);
        });
        setNumberOfVar((prev) => {
          return prev.map((item, i) => {
            if (i !== index) {
              return item;
            }
            return {
              ...item,
              image: images,
            };
          });
        });
      }
    });
  };
  const removeImage = (e, image, index) => {
    e.preventDefault();
    if (index < numberOfVar.length) {
      const imagesArray = numberOfVar.filter((item, i) => {
        if (i === index) {
          return item;
        }
      });
      axios.post(`/api/removeImage/${image}`).then((res) => {
        if (res.data.status === 200) {
          setNumberOfVar((prev) => {
            return prev.map((item, i) => {
              if (i !== index) {
                return item;
              }
              return {
                ...item,
                image: imagesArray[0].image.filter((item) => item !== image),
              };
            });
          });
        }
      });
    } else {
      console.log(index);
    }
  };

  const outputs = [];
  let i = 0;

  numberOfVar.map((item, x) => {
    for (const [key, value] of Object.entries(item)) {
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
              onChange={(event) => Change(event, item, x)}
              name={key}
              type={key == "image" ? "file" : ""}
              multiple
            ></input>
            {errors[key] ? (
              <div className="invalid-feedback">{errors[key + "message"]}</div>
            ) : null}
          </div>
        );
      } else if (key == "postion") {
        outputs.push(
          <div className={`col-xl-2 col-lg-2 col-sm-2 col-md-2`} key={i}>
            <Tooltip title="Delete">
              <IconButton onClick={(e) => removeVar(e, value)}>
                {value}
                <DeleteIcon fontSize="small" sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
    if (item.image.length != 0) {
      outputs.push(
        <div className="col-xl-12 col-lg-12 col-sm-12 " key={x}>
          <div className="row">
            {item.image?.map((photo, indexOfImage) => {
              return (
                <div className="col-xl-2 col-lg-2 col-sm-2" key={indexOfImage}>
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
                          <IconButton
                            onClick={(e) =>
                              removeImage(e, photo, x, indexOfImage)
                            }
                          >
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
      );
    }
  });

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
          <div className="col-md-2  p-4 text-center">{t("actions")}</div>
          <div className="col-md-3  p-4 text-center ">{t("sku")}</div>
          <div className="col-md-2  p-4 text-center">{t("price")}</div>
          <div className="col-md-2  p-4 text-center">{t("stock")}</div>
          <div className="col-md-3  p-4 text-center">{t("image")}</div>
        </div>
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <div className="row">{outputs}</div>
        </div>

        <div className="col-xl-12 col-lg-12 col-sm-12">
          <div className="row ">
            <div className="col-xl-1 col-lg-1 col-sm-1">
              <Button
                onClick={saveVaraiants}
                disabled={numberOfVar.length == 0 ? "disabled" : ""}
              >
                {" "}
                Save Variants
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default NewGrid;
