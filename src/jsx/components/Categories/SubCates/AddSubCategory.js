import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { localization as t } from "../../Localization";
import Local from "../Local";
const AddSubCategory = (props) => {
  const {
    setModalCentered,
    modalCentered,
    fetchData,
    setAlerts,
    id,
    branchId,
    check,
    setCheck,
    lang,
    setLang,
  } = props;
  const initialValues = {
    SubCategoryName: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      SubCategoryName: Yup.string().required("Sub Category Name is required"),
    });
  };
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, SubCategoryIcon: e.target.files[0] });
  };
  const saveSubCate = (data) => {
    const checkCate = fetchData.every((item) => {
      return item.SubCategoryName !== data.SubCategoryName;
    });
    if (checkCate) {
      const formData = new FormData();
      formData.append("SubCategoryName", data.SubCategoryName);
      formData.append("CategoryID", id);
      formData.append("SubCategoryIcon", imageState.SubCategoryIcon);
      formData.append("translation", JSON.stringify(lang));
      axios
        .post("/api/insertSubCategories", formData)
        .then((res) => {
          if (res.data.status === 200) {
            setImageState([]);
            setCheck(!check);
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
        <Modal.Title>{t("add_sub_Category")}</Modal.Title>
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
        onSubmit={saveSubCate}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Body>
              <div className="form-group">
                <label> {t("sub_category_icon")}</label>
                <Field
                  name="SubCategoryName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.SubCategoryName && touched.SubCategoryName
                      ? " is-invalid"
                      : "")
                  }
                  placeholder={t("category_name")}
                />
                <ErrorMessage
                  name="SubCategoryName"
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
                  placeholder={t("sub_category_icon")}
                  name="SubCategoryIcon"
                  onChange={handleImage}
                />
              </div>
              <Local
                changeBit={true}
                url={`/api/branchLangs/${branchId}`}
                inputData={values.SubCategoryName}
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

export default AddSubCategory;
