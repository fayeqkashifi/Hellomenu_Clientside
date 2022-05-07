import React, { Fragment, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { localization as t } from "../../Localization";
import IngredientLocale from "./local";
const EditIngredient = (props) => {
  const {
    check,
    setCheck,
    setAlerts,
    editmodalCentered,
    setEditModalCentered,
    edit,
  } = props;

  const [langs, setLangs] = useState([]);

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
    });
  };
  const update = (data) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("translation", JSON.stringify(langs));
    axios
      .post("/api/updateIngredient", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setEditModalCentered(false);
          setAlerts(true, "success", res.data.message);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      {editmodalCentered && (
        <Modal className="fade" show={editmodalCentered}>
          <Modal.Header>
            <Modal.Title>{t("edit_ingredient")} </Modal.Title>
            <Button
              onClick={() => setEditModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Formik
            initialValues={edit}
            validationSchema={validationSchema}
            onSubmit={update}
          >
            {({ errors, touched }) => (
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
                    url={`/api/getIngredientTranslation/${edit.id}`}
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
      )}
    </Fragment>
  );
};
export default EditIngredient;
