import React, { Fragment, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { localization as t } from "../../Localization";
import IngredientLocale from "./local";
const AddIngredient = (props) => {
  const {
    check,
    setCheck,
    setAlerts,
    modalCentered,
    setModalCentered,
    setProductIngredient,
    productIngredient,
  } = props;
  const initialValuesIngredient = {
    name: "",
  };
  const [langs, setLangs] = useState([]);
  const validationSchemaIngredient = () => {
    return Yup.object().shape({
      name: Yup.string().required("Ingredient Name is required"),
    });
  };

  const save = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("translation", JSON.stringify(langs));
    axios
      .post("/api/insertSingleIngredient", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setModalCentered(false);
          setProductIngredient([
            ...productIngredient,
            { value: res.data.id, label: data.name },
          ]);
          setAlerts(true, "success", res.data.message);
        } else if (res.data.status === 1062) {
          setAlerts(true, "warning", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {modalCentered && (
        <Modal className="fade" size="lg" show={modalCentered}>
          <Modal.Header>
            <Modal.Title>{t("add_ingredient")}</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={initialValuesIngredient}
            validationSchema={validationSchemaIngredient}
            onSubmit={save}
          >
            {({ errors, status, touched, values }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label> {t("name")}</label>
                    <Field
                      name="name"
                      type="text"
                      className={
                        "form-control" +
                        (errors.name && touched.name ? " is-invalid" : "")
                      }
                      placeholder="Name...."
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <IngredientLocale
                    langs={langs}
                    setLangs={setLangs}
                    url={`/api/getCompanyLanguages`}
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
      )}
    </Fragment>
  );
};
export default AddIngredient;
