import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { base_url, port } from "../../../Consts";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import swal from "sweetalert";
import { Button } from "react-bootstrap";
import CustomAlert from "../CustomAlert";

const NewGrid = (props) => {
  const { t } = useTranslation();

  const { numberOfVar, productid, tags, setNumberOfVar } = props;
  // alert
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const saveVaraiants = async () => {
    let check = true;
    numberOfVar.map((vars) => {
      if (
        vars.price < 0 ||
        vars.stock < 0 ||
        vars.stock == "" ||
        vars.price == ""
      ) {
        check = false;
      }
    });
    if (check) {
      const formdata = new FormData();
      formdata.append("product_id", productid);
      formdata.append("vars", JSON.stringify(numberOfVar));
      formdata.append("tags", JSON.stringify(tags));
      const res = await axios({
        method: "post",
        data: formdata,
        url: "/api/saveVars",
      });
      if (res.data.status === 200) {
        setAlerts(true, "success", res.data.message);
      } else {
        swal("error", res.data.message, "success");
      }
    } else {
      setAlerts(true, "error", "Data Not Saved Please check the inputs");
    }
  };
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
          <div
            className={`col-xl-${
              key == "sku" || key == "image" ? 3 : 2
            } col-lg-${key == "sku" || key == "image" ? 3 : 2} col-sm-${
              key == "sku" || key == "image" ? 3 : 2
            } my-2  `}
            key={i}
          >
            <input
              className={
                key == "price" || key == "stock"
                  ? value < 0 || value == ""
                    ? " form-control is-invalid"
                    : "form-control"
                  : "form-control"
              }
              disabled={key == "sku"}
              value={
                key == "image"
                  ? ""
                  : // : key == "price" || key == "stock"
                    // ? value == ""
                    //   ? 0
                    //   : value
                    value
              }
              // onBlur={(event) => {
              //   changeSku(event);
              // }}
              onChange={(event) => Change(event, item, x)}
              name={key}
              type={key == "image" ? "file" : key == "sku" ? "text" : "number"}
              min="0"
              multiple
            ></input>
            {key == "price" || key == "stock" ? (
              value < 0 || value == "" ? (
                <div className="invalid-feedback">
                  Please Enter Positive Number
                </div>
              ) : null
            ) : null}
          </div>
        );
      } else if (key == "postion") {
        outputs.push(
          <div className={`col-xl-2 col-lg-2 col-sm-2 col-md-2`} key={i}>
            <Tooltip title="Delete">
              <IconButton onClick={(e) => removeVar(e, value)}>
                {/* {value} */}
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
    if (item.image.length != 0) {
      outputs.push(
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <div className="row">
            {item.image?.map((photo, indexOfImage) => {
              return (
                <div className="col-xl-2 col-lg-2 col-sm-2" key={photo}>
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
    let count = -1;
    setNumberOfVar((prevState) =>
      prevState
        .filter((item) => {
          return item.postion != val;
        })
        .map((item) => {
          count = count + 1;
          return {
            ...item,
            postion: count,
          };
        })
    );
  };
  return (
    <Fragment>
      {alert.open ? (
        <CustomAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}
      <div className="card-header font-weight-bold">
        <div className="col-md-2">{t("actions")}</div>
        <div className="col-md-3">{t("sku")}</div>
        <div className="col-md-2">{t("price")}</div>
        <div className="col-md-2">{t("stock")}</div>
        <div className="col-md-3">{t("image")}</div>
      </div>
      <div className={`card-body ${numberOfVar.length == 0 ? "d-none" : ""}`}>
        <div className="row">{outputs}</div>
      </div>

      <div className={`card-footer ${numberOfVar.length == 0 ? "d-none" : ""}`}>
        <Button
          onClick={saveVaraiants}
          disabled={numberOfVar.length == 0 ? "disabled" : ""}
        >
          {" "}
          Save Variants
        </Button>
      </div>
    </Fragment>
  );
};
export default NewGrid;
