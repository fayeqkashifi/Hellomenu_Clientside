import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { localization as t } from "../../Localization";
import Local from "../Local";
import DefaultPic from "../../../../images/hellomenu/sub_category.svg";
import { base_url, port } from "../../../../Consts";

const EditSubCategory = (props) => {
  const {
    setEditModalCentered,
    editmodalCentered,
    setAlerts,
    id,
    check,
    setCheck,
    lang,
    setLang,
    editSubCate,
  } = props;
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

  const updateSubMenu = (data) => {
    const formData = new FormData();
    formData.append("SubCategoryIcon", data.SubCategoryIcon);
    formData.append("SubCategoryName", data.SubCategoryName);
    formData.append("CategoryID", id);
    formData.append("id", data.id);
    formData.append("translation", JSON.stringify(lang));
    axios
      .post("/api/updateSubCategory", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setEditModalCentered(false);
          setCheck(!check);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        } else if (res.data.status === 304) {
          setAlerts(true, "warning", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal className="fade" size="lg" show={editmodalCentered}>
      <Modal.Header>
        <Modal.Title>{t("edit_sub_category")}</Modal.Title>
        <Button
          onClick={() => setEditModalCentered(false)}
          variant=""
          className="close"
        >
          <span>&times;</span>
        </Button>
      </Modal.Header>
      <Formik
        initialValues={editSubCate}
        validationSchema={validationSchema}
        onSubmit={updateSubMenu}
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
              <img
                src={
                  editSubCate.SubCategoryIcon
                    ? `http://${base_url}:${port}/images/sub_catagories/${editSubCate.SubCategoryIcon}`
                    : DefaultPic
                }
                width="70"
                alt=" "
              />
              <Local
                changeBit={false}
                url={`/api/subCategoryTranslation/${values.id}`}
                inputData={values.SubCategoryName}
                lang={lang}
                setLang={setLang}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => setEditModalCentered(false)}
                variant="danger light"
              >
                {t("close")}
              </Button>
              <Button variant="primary" type="submit">
                {t("update")}{" "}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditSubCategory;
