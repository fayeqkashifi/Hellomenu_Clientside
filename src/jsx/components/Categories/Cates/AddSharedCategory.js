import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { localization as t } from "../../Localization";
import Select from "react-select";

const AddSharedCategory = (props) => {
  const { modal, setModal, check, setCheck, id, setAlerts } = props;
  const [cats, setCates] = useState([]);

  const dataLoad = () => {
    try {
      axios.get(`/api/sharedCates/${id}`).then((shared) => {
        if (shared.status === 200) {
          setCates(shared.data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setCates([]);
    };
  }, [id]);
  const initialValuesCate = {
    categories: "",
  };
  const validationSchemaCate = () => {
    return Yup.object().shape({
      categories: Yup.string().required("Please select a Category"),
    });
  };
  const saveCate = (data) => {
    const formData = new FormData();
    formData.append("CategoryName", data.categories);
    formData.append("branchID", id);

    axios
      .post("/api/insertSharedCate", formData)
      .then((res) => {
        if (res.data.status === 200) {
          setCheck(!check);
          setAlerts(true, "success", res.data.message);
          setModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal className="fade" show={modal}>
      <Modal.Header>
        <Modal.Title>{t("add_category")} </Modal.Title>
        <Button onClick={() => setModal(false)} variant="" className="close">
          <span>&times;</span>
        </Button>
      </Modal.Header>
      <Formik
        initialValues={initialValuesCate}
        validationSchema={validationSchemaCate}
        onSubmit={saveCate}
      >
        {({ errors, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <div className="form-group">
                <label> {t("categories")}</label>
                <Select
                  // isMulti
                  options={cats?.map((o, i) => {
                    return {
                      value: o.id,
                      label: o.CategoryName,
                    };
                  })}
                  onChange={(option) => {
                    setFieldValue("categories", option.label);
                  }}
                  // onChange={handleSelectCates}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors.categories ? (
                  <small
                    className="invalid"
                    style={{ color: "red", marginTop: ".5rem" }}
                  >
                    {errors.categories}
                  </small>
                ) : (
                  ""
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setModal(false)} variant="danger light">
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

export default AddSharedCategory;
