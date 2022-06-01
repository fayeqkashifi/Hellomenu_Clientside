import React from "react";
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
    SubCategoryIcon: null,
  };
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/svg",
    "image/gif",
    "image/png",
  ];

  const validationSchema = () => {
    return Yup.object().shape({
      SubCategoryName: Yup.string().required("Sub Category Name is required"),
      SubCategoryIcon: Yup.mixed()
        .nullable()
        // .required("A file is required")
        .test(
          "FILE_SIZE",
          "File Size is too large",
          (value) => !value || (value && value.size <= 5000000)
        )
        .test(
          "FILE_FORMAT",
          "Unsupported File Format",
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
    });
  };

  const saveSubCate = (data) => {
    const checkCate = fetchData.every((item) => {
      return item.SubCategoryName !== data.SubCategoryName;
    });
    if (checkCate) {
      const formData = new FormData();
      formData.append("SubCategoryName", data.SubCategoryName);
      formData.append("CategoryID", id);
      formData.append("SubCategoryIcon", data.SubCategoryIcon);
      formData.append("translation", JSON.stringify(lang));
      axios
        .post("/api/insertSubCategories", formData)
        .then((res) => {
          if (res.data.status === 200) {
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
        {({ errors, touched, values, setFieldValue }) => (
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
                <label>
                  {" "}
                  {t("image")}
                  <small style={{ fontSize: "10px" }}>{"(Max Size 5MB)"}</small>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={
                    "form-control" +
                    (errors.SubCategoryIcon && touched.SubCategoryIcon
                      ? " is-invalid"
                      : "")
                  }
                  onChange={(event) => {
                    setFieldValue("SubCategoryIcon", event.target.files[0]);
                  }}
                />
                <ErrorMessage
                  name="SubCategoryIcon"
                  component="div"
                  className="invalid-feedback"
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
