import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Switch from "@mui/material/Switch";
import {
  Option,
  MultiValue,
  animatedComponents,
} from "../../Common/SelectOption";
import MySelect from "../../Common/MySelect";
import { localization as t } from "../../Localization";
import Local from "../Local";

const AddCategory = (props) => {
  const {
    setModalCentered,
    modalCentered,
    lang,
    setLang,
    fetchData,
    check,
    setCheck,
    id,
    setAlerts,
  } = props;
  const [share, setShare] = useState(false);
  const [branches, setBranches] = useState([]);

  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getBranchesAll`);
      if (result.data.status === 200) {
        setBranches(
          result.data.fetchData.filter((item) => {
            return item.id !== id;
          })
        );
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setBranches([]);
    };
  }, []);
  const initialValues = {
    CategoryName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      CategoryName: Yup.string().required("Category Name is required"),
    });
  };
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, CategoryIcon: e.target.files[0] });
  };

  const [productbranches, setProductBranches] = useState([]);
  const handleSelectBranches = (e) => {
    setProductBranches(e);
  };
  const saveMenu = (data) => {
    const checkCate = fetchData.every((item) => {
      return item.CategoryName !== data.CategoryName;
    });
    if (checkCate) {
      const formData = new FormData();
      productbranches.map((item) => formData.append("branches[]", item.value));
      formData.append("CategoryIcon", imageState.CategoryIcon);
      formData.append("CategoryName", data.CategoryName);
      formData.append("branchID", id);
      formData.append("translation", JSON.stringify(lang));

      axios
        .post("/api/insertCategories", formData)
        .then((res) => {
          if (res.data.status === 200) {
            setImageState([]);
            setCheck(!check);
            setShare(false);
            setProductBranches([]);
            setAlerts(true, "success", res.data.message);
            setModalCentered(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAlerts(true, "warning", "Already exists, Please Try another name!");
    }
  };
  return (
    <Modal className="fade" size="lg" show={modalCentered}>
      <Modal.Header>
        <Modal.Title>{t("add_category")} </Modal.Title>
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
        onSubmit={saveMenu}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Body>
              <div className="form-group">
                <label> {t("share_category_with_other_branches")}</label>
                <Switch
                  checked={share}
                  color="secondary"
                  onChange={(e) => setShare(!share)}
                />
              </div>
              {share ? (
                <>
                  <div className="form-group">
                    <label> {t("branches")}</label>
                    <MySelect
                      options={branches?.map((o, i) => {
                        return {
                          value: o.id,
                          label: o.BrancheName,
                        };
                      })}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{
                        Option,
                        MultiValue,
                        animatedComponents,
                      }}
                      onChange={handleSelectBranches}
                      allowSelectAll={true}
                      value={productbranches}
                      name="branches"
                    />
                  </div>
                </>
              ) : (
                " "
              )}
              <div className="form-group">
                <label> {t("category_name")}</label>
                <Field
                  name="CategoryName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.CategoryName && touched.CategoryName
                      ? " is-invalid"
                      : "")
                  }
                  placeholder={t("category_name")}
                />
                <ErrorMessage
                  name="CategoryName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <label> {t("image")}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  placeholder={t("category_icon")}
                  name="CategoryIcon"
                  onChange={handleImage}
                />
              </div>

              <Local
                changeBit={true}
                url={`/api/branchLangs/${id}`}
                inputData={values.CategoryName}
                lang={lang}
                setLang={setLang}
              />
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
  );
};

export default AddCategory;
