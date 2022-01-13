import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import Grid from "./Grid";
import { CBreadcrumb } from "@coreui/react";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import "@pathofdev/react-tag-input/build/index.css";
import { TagsInput } from "react-tag-input-component";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Variants = (props) => {
  // for localization
  const history = useHistory();

  const { t } = useTranslation();
  const id = props.history.location.state.p_id;
  const branchId = props.history.location.state.id;

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberOfVar, setNumberOfVar] = useState([]);
  const [jsonVaraints, setJsonVaratis] = useState("");
  const [filterAttributes, setfilterAttributes] = useState([]);
  const [check, setCheck] = useState(true);

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
        // const varLines = [];
        // res.data.fetchData.map((fetchData) => {
        //   nameAtter[fetchData.attributeName] = "";
        // });
        // varLines.push({
        //   postion: 0,
        //   sku: "",
        //   price: "",
        //   stock: "",
        //   image: [],
        //   // ...nameAtter,
        // });
        // setNameAtter(nameAtter);
        // setNumberOfVar(varLines);

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

          console.log(attrFilterName);

          varLines.push(line);
          setVariantsTage(attrFilterName);
        });

        setNumberOfVar(varLines);
        setAttributes(res.data.fetchData);
      }
    };

    getdata();
    setLoading(false);
  }, [check]);
  const CreateNewVar = (tag) => {
    let postion = 0;
    if (numberOfVar.length > 0) {
      postion = numberOfVar.length;
    }
    if (variantsTags.length == 1) {
      let sku = id + "-";
      if (tags != 0) {
        for (const [attr, values] of Object.entries(tag)) {
          if (values.length < numberOfVar.length) {
            // delete variants
            setNumberOfVar(
              numberOfVar.filter((val) => {
                return values.includes(val[attr]);
              })
            );
          } else {
            values.map((item) => {
              const check = numberOfVar.every((section) => {
                return section.sku != sku + item;
              });
              if (check) {
                setNumberOfVar((numberOfVar) => {
                  return [
                    ...numberOfVar,
                    {
                      postion: postion,
                      sku: sku + item,
                      price: "",
                      stock: "",
                      image: [],
                      [attr]: item,
                    },
                  ];
                });
              }
            });
          }
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
                price: "",
                stock: "",
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
              price: "",
              stock: "",
              image: [],
              ...tag,
            },
          ];
        });
      }

      // console.log(numberOfVar);
    }
  };

  // const removeVar = () => {
  //   const varsLines = numberOfVar;
  //   varsLines.pop();
  //   setNumberOfVar([...varsLines]);
  // };
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
  const [variantsTags, setVariantsTage] = useState([]);
  // select box
  const handleSelectEvent = (e) => {
    if (e == null) {
      setVariantsTage([]);
    } else {
      setVariantsTage(e);
    }
  };
  const [tags, setTags] = useState([]);
  const handleEvent = (e, value) => {
    setTags({ ...tags, [value]: e });
    if (variantsTags.length == 1) {
      CreateNewVar({ ...tags, [value]: e });
    } else {
      let attrs = [];
      for (const [attr, values] of Object.entries({ ...tags, [value]: e }))
        attrs.push(values.map((v) => ({ [attr]: v })));

      attrs = attrs.reduce((a, b) =>
        a.flatMap((d) => b.map((e) => ({ ...d, ...e })))
      );
      attrs.map((tag) => {
        CreateNewVar(tag);
      });
    }
  };

  // delete Start
  const deleteAll = (e) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("Cancel"), t("Confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/Deletevariations/${id}`).then((res) => {
          if (res.data.status === 200) {
            setNumberOfVar([]);
            setVariantsTage([]);
            setTags([]);
            swal("Success", res.data.message, "success");
          } else if (res.data.status === 404) {
            setNumberOfVar([]);
            setVariantsTage([]);
            setTags([]);
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  const reset = (e) => {
    e.preventDefault();
    setNumberOfVar([]);
    setVariantsTage([]);
    setTags([]);
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
    axios.post("/api/InsertAttribute", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setModalCentered(false);
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

        <div className="row">
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
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            <div className="card ">
              <Select
                value={variantsTags}
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
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          {" "}
          <div className="d-flex justify-content-between">
            <label className="mb-1 "></label>
            <small style={{ cursor: "pointer" }} onClick={(e) => deleteAll(e)}>
              {t("remove_all")}
            </small>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12 col-sm-12 p-5">
          <div
            className={`col-xl-12 col-lg-12 col-sm-12 ${
              variantsTags.length == 0 ? "d-none" : ""
            }`}
          >
            {" "}
            <div className="d-flex justify-content-between">
              <label className="mb-1 "></label>
              <small style={{ cursor: "pointer" }} onClick={(e) => reset(e)}>
                {t("reset_to_default")}
              </small>
            </div>
          </div>
          {variantsTags?.map((item, i) => {
            return (
              <div className="row m-2" key={i}>
                <div
                  className="col-xl-3 col-lg-3 col-sm-3 "
                  // style={{ backgroundColor: "#555", font: "white" }}
                >
                  {item.label}
                  {/* {item.value} */}
                </div>
                <div className="col-xl-9 col-lg-9 col-sm-9">
                  {/* <TagInput /> */}
                  <TagsInput
                    // value={tags.length == 0 ? "" : []}
                    onChange={(e) => handleEvent(e, item.label)}
                    // onBlur={CreateNewVar}
                    // id={item.label}
                    placeHolder="Please Enter A Value"
                  />
                </div>
              </div>
            );
          })}
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
                  setNumberOfVar={setNumberOfVar}
                  // variantsTags={variantsTags}
                  productid={id}
                ></Grid>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-sm-12">
            <div className="row ">
              {/* <div className="col-xl-1 col-lg-1 col-sm-1">
                <Button onClick={CreateNewVar}> Add Variant</Button>
              </div> */}
              {/* <div className="col-xl-1 col-lg-1 col-sm-1">
                <Button onClick={removeVar}>Remove Variant</Button>
              </div> */}
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
