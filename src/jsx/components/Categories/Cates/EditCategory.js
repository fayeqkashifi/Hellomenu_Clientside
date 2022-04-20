import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { localization as t } from "../../Localization";
import Local from "../Local";
import { base_url, port } from "../../../../Consts";
import DefaultPic from "../../../../images/hellomenu/category.svg";

const EditCategory = (props) => {
  const {
    editmodalCentered,
    setEditModalCentered,
    lang,
    setLang,
    editCate,
    setEditCate,
    check,
    setCheck,
    id,
    setAlerts,
  } = props;
  const validationSchema = () => {
    return Yup.object().shape({
      CategoryName: Yup.string().required("Category Name is required"),
    });
  };
  const [imageState, setImageState] = useState([]);
  const handleImage = (e) => {
    setImageState({ ...imageState, CategoryIcon: e.target.files[0] });
  };
  const updateMenu = (data) => {
    const formData = new FormData();
    formData.append("CategoryIcon", imageState.CategoryIcon);
    formData.append("CategoryName", data.CategoryName);
    formData.append("branchID", id);
    formData.append("id", editCate.id);
    formData.append("translation", JSON.stringify(lang));
    axios
      .post("/api/updateCategories", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setEditCate({
            id: "",
            CategoryName: "",
            CategoryIcon: "",
            branchID: id,
          });
          setImageState([]);
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
          setEditModalCentered(false);
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
        <Modal.Title>{t("edit_category")}</Modal.Title>
        <Button
          onClick={() => setEditModalCentered(false)}
          variant=""
          className="close"
        >
          <span>&times;</span>
        </Button>
      </Modal.Header>
      <Formik
        initialValues={editCate}
        validationSchema={validationSchema}
        onSubmit={updateMenu}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Body>
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
                <img
                  src={
                    editCate.CategoryIcon
                      ? `http://${base_url}:${port}/images/catagories/${editCate.CategoryIcon}`
                      : DefaultPic
                  }
                  width="70"
                  alt=" "
                />
              </div>
              <Local
                changeBit={false}
                url={`/api/categoryTranslation/${values.id}`}
                inputData={values.CategoryName}
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

export default EditCategory;
