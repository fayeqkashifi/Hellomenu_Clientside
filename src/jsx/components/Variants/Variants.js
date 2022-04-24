import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import NewGrid from "./NewGrid";
import { CBreadcrumb } from "@coreui/react";
import { Link } from "react-router-dom";
import "@pathofdev/react-tag-input/build/index.css";
import { TagsInput } from "react-tag-input-component";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomAlert from "../CustomAlert";
import { checkPermission } from "../Permissions";
import { localization as t } from "../Localization";
import { Option, MultiValue, animatedComponents } from "../Common/SelectOption";
import MySelect from "../Common/MySelect";
const Variants = (props) => {
  // for localization
  const id = props.history.location.state.p_id;
  const branchId = props.history.location.state.id;

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberOfVar, setNumberOfVar] = useState([]);
  const [check, setCheck] = useState(true);
  const [variantsTags, setVariantsTage] = useState([]);
  const [tags, setTags] = useState([]);
  const [product, setProduct] = useState(0);

  const getdata = async () => {
    const proRes = await axios.get(`/api/editProducts/${id}`);
    if (proRes.data.status === 200) {
      const product = proRes.data.product;
      setProduct(product);
    }
    const jsonvar = await axios({
      method: "GET",
      url: `/api/getVariations/${id}`,
    });
    const res = await axios({
      method: "GET",
      url: "/api/getAttributesAll",
    });
    const nameAtter = {};
    res.data.fetchData.map(
      (fetchData) => (nameAtter[fetchData.attributeName] = "")
    );

    if (res.data.fetchData.length !== attributes.length) {
      setAttributes(res.data.fetchData);
      // setTags(JSON.parse(jsonvar.data.fetchData.tags));
    }

    if (jsonvar.data.fetchData !== "") {
      const recTags = JSON.parse(jsonvar.data.fetchData.tags);
      setTags(recTags);

      const varLines = [];

      const arrayVar = JSON.parse(jsonvar.data.fetchData.variants);
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
            attrFilterName.push({
              value: key,
              label: key,
            });
            line[key] = value;

            AttNames[key] = "";
          } else {
            if (count < Object.keys(nameAtter).length) {
              line[Object.keys(nameAtter)[count]] = value;
            }
            count++;
          }
        }
        varLines.push(line);
        setVariantsTage(attrFilterName);
      });
      setNumberOfVar(varLines);
      setLoading(false);
      // setAttributes(res.data.fetchData);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getdata();
    return () => {
      setLoading(true);
      setProduct([]);
      setAttributes([]);
      setTags([]);
      setVariantsTage([]);
      setNumberOfVar([]);
    };
  }, []);
  useEffect(() => {
    getdata();
  }, [check]);
  const CreateNewVar = (tag) => {
    if (variantsTags.length == 1) {
      let sku = id + "-";
      if (tag != 0) {
        for (const [attr, values] of Object.entries(tag)) {
          let count = -1;
          setNumberOfVar((prevState) =>
            prevState
              .filter((item) => {
                return values.includes(item[attr]);
              })
              .map((item) => {
                count = count + 1;
                return {
                  ...item,
                  postion: count,
                };
              })
          );
          values.map((item) => {
            const check = numberOfVar.every((section) => {
              return section.sku != sku + item;
            });
            if (check) {
              setNumberOfVar((numberOfVar) => {
                return [
                  ...numberOfVar,
                  {
                    postion: numberOfVar.length,
                    sku: sku + item,
                    price: product.price,
                    stock: 1,
                    image: [],
                    [attr]: item,
                  },
                ];
              });
            }
          });
        }
      }
    } else {
      let sku = id + "-";
      let c = 1;
      for (const [attr, values] of Object.entries(tag)) {
        if (Object.keys(tag).length == c) {
          sku += values;
        } else {
          sku += values + "-";
        }
        c++;
      }
      if (numberOfVar.length != 0) {
        const check = numberOfVar.every((item) => {
          return item.sku != sku;
        });
        if (check) {
          setNumberOfVar((numberOfVar) => {
            return [
              ...numberOfVar,
              {
                postion: numberOfVar.length,
                sku: sku,
                price: product.price,
                stock: 1,
                image: [],
                ...tag,
              },
            ];
          });
        }
      } else {
        setNumberOfVar((numberOfVar) => {
          return [
            ...numberOfVar,
            {
              postion: numberOfVar.length,
              sku: sku,
              price: product.price,
              stock: 1,
              image: [],
              ...tag,
            },
          ];
        });
      }
    }
  };
  const [change, setChange] = useState(false);
  // select box
  const handleSelectEvent = (e) => {
    if (e == null) {
      setVariantsTage([]);
      setNumberOfVar([]);
      setTags([]);
    } else {
      if (e.length < variantsTags.length) {
        setNumberOfVar([]);
        setTags([]);
        setChange(!change);
      }
      setVariantsTage(e);
    }
  };
  const handleEvent = (e, value) => {
    if (e.length != 0) {
      setTags({ ...tags, [value]: e });
    }
    if (variantsTags.length == 1) {
      CreateNewVar({ ...tags, [value]: e });
    } else {
      if (e.length < tags[value]?.length) {
        let count = -1;

        setNumberOfVar(
          numberOfVar
            .filter((item) => {
              if (e.includes(item[value])) {
                return item;
              }
            })
            .map((item) => {
              count = count + 1;
              return {
                ...item,
                postion: count,
              };
            })
        );
      } else {
        let attrs = [];
        let arrayAttr = [];
        for (const [attr, values] of Object.entries({ ...tags, [value]: e })) {
          attrs.push(values.map((v) => ({ [attr]: v })));
          arrayAttr.push(attr);
        }
        attrs = attrs.reduce((a, b) =>
          a.flatMap((d) => b.map((e) => ({ ...d, ...e })))
        );
        if (arrayAttr.length == variantsTags.length) {
          attrs.map((tag) => {
            CreateNewVar(tag);
          });
        }
      }
    }
  };

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
  // delete
  const deleteAll = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/deletevariations/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setNumberOfVar([]);
              setVariantsTage([]);
              setTags([]);
              setAlerts(true, "success", res.data.message);
            } else if (res.data.status === 404) {
              setNumberOfVar([]);
              setVariantsTage([]);
              setTags([]);
              setAlerts(true, "error", res.data.message);
            }
            setCheck(!check);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setAlerts(true, "info", "Your Data is safe now!");
      }
    });
  };
  const reset = (e) => {
    e.preventDefault();
    setNumberOfVar([]);
    setVariantsTage([]);
    setTags([]);
    setAlerts(true, "info", "Form Reseted!");
  };

  // insert Attribute start
  const initialValues = {
    attributeName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      attributeName: Yup.string().required("Attribute Name is required"),
    });
  };
  const [modalCentered, setModalCentered] = useState(false);
  const saveAttribute = (data) => {
    axios.post("/api/insertAttribute", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setModalCentered(false);
        setVariantsTage([
          ...variantsTags,
          { value: data.attributeName, label: data.attributeName },
        ]);
        setAlerts(true, "success", res.data.message);
      } else if (res.data.status === 304) {
        setAlerts(true, "warning", res.data.message);
      }
    });
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
        <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
          <Link
            to={{
              pathname: `/branches/show/products`,
              state: { id: branchId },
            }}
            className="font-weight-bold"
          >
            {t("back_to_products_list")}
          </Link>
        </CBreadcrumb>
        {checkPermission("variants-create") && (
          <>
            <div className="card">
              <div className="card-body">
                {checkPermission("attribute_create") && (
                  <div className="col-xl-12 col-lg-12 col-sm-12 ">
                    {" "}
                    <div className="d-flex justify-content-between">
                      <label className="mb-1 "></label>
                      <small
                        style={{ cursor: "pointer" }}
                        onClick={() => setModalCentered(true)}
                      >
                        {t("add_attribute")}
                      </small>
                    </div>
                  </div>
                )}

                <div className="col-xl-12 col-lg-12 col-sm-12 ">
                  <MySelect
                    options={attributes.map((o, i) => {
                      return { value: o.attributeName, label: o.attributeName };
                    })}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{ Option, MultiValue, animatedComponents }}
                    onChange={handleSelectEvent}
                    allowSelectAll={true}
                    value={variantsTags}
                  />
                </div>
              </div>
            </div>

            <div className={`card ${variantsTags.length == 0 ? "d-none" : ""}`}>
              <div className="card-body">
                <div className="col-xl-12 col-lg-12 col-sm-12 ">
                  <div
                    className={`col-xl-12 col-lg-12 col-sm-12 ${
                      variantsTags.length == 0 ? "d-none" : ""
                    }`}
                  >
                    {" "}
                    <div className="d-flex justify-content-between">
                      <label className="mb-1 "></label>
                      <small
                        style={{ cursor: "pointer" }}
                        onClick={(e) => reset(e)}
                      >
                        {t("reset_to_default")}
                      </small>
                    </div>
                  </div>
                  {variantsTags?.map((item, i) => {
                    return (
                      <div className="row m-2" key={i}>
                        <div
                          className="col-xl-3 col-lg-3 col-sm-3 font-weight-bold d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: "#f5f5f5" }}
                        >
                          {item.label}
                        </div>
                        <div className="col-xl-9 col-lg-9 col-sm-9">
                          <TagsInput
                            key={change}
                            value={
                              tags[item.label] == undefined
                                ? (e) => (e = [])
                                : tags[item.label]
                            }
                            onChange={(e) => handleEvent(e, item.label)}
                            placeHolder="Please Enter A Value"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="card" style={{ minHeight: "40vh" }}>
          <div className="card-body">
            {checkPermission("variants-delete") && (
              <div
                className={`col-xl-12 col-lg-12 col-sm-12 ${
                  numberOfVar.length == 0 ? "d-none" : ""
                }`}
              >
                {" "}
                <div className="d-flex justify-content-between">
                  <label className="mb-1 "></label>
                  <small
                    style={{ cursor: "pointer" }}
                    onClick={(e) => deleteAll(e)}
                  >
                    {t("remove_all")}
                  </small>
                </div>
              </div>
            )}
            <NewGrid
              numberOfVar={numberOfVar}
              setNumberOfVar={setNumberOfVar}
              tags={tags}
              // productid={id}
              product={product}
            ></NewGrid>
          </div>
        </div>

        <Modal className="fade" show={modalCentered}>
          <Modal.Header>
            <Modal.Title>{t("add_attribute")}</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={saveAttribute}
          >
            {({ errors, status, touched }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label> {t("attribute_name")}</label>
                    <Field
                      name="attributeName"
                      type="text"
                      className={
                        "form-control" +
                        (errors.attributeName && touched.attributeName
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Name...."
                    />
                    <ErrorMessage
                      name="attributeName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => setModalCentered(false)}
                    variant="danger light"
                  >
                    {t("close")}
                  </Button>
                  <Button variant="primary" type="submit">
                    {t("save")}{" "}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      </Fragment>
    );
  }
};

export default Variants;
