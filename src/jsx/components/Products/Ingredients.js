import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
const Ingredients = (props) => {
  // validation start
  const initialValues = {
    name: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
    });
  };
  // validation end

  // for localization
  const { t } = useTranslation();
  // insert start
  const [modalCentered, setModalCentered] = useState(false);

  const save = (data) => {
    axios.post("/api/InsertIngredient", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setModalCentered(false);
        swal("Success", res.data.message, "success");
      }
    });
  };
  // insert end
  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);

  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditIngredient/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEdit(res.data.item);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // update
  const update = (data) => {
    axios.post("/api/UpdateIngredient", data).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setEditModalCentered(false);
        swal("Success", res.data.message, "success");
        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // edit end

  // delete Start
  const deleteIngredient = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteIngredient/${id}`).then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            setCheck(!check);
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  // delete End

  //retriving data using laravel API for show
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  useEffect(() => {
    axios.post(`/api/GetIngredient`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.fetchData);
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [check]);

  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <tr key={item.id}>
          <td>{i + 1}</td>

          <td> {item.name}</td>
          <td>
            {/* <Link to={`add-option/${item.id}`} className="btn btn-outline-danger btn-sm">{t('options')}</Link>&nbsp;&nbsp;&nbsp; */}
            <button
              type="button"
              onClick={(e) => fetch(e, item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              {t("edit")}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              onClick={(e) => deleteIngredient(e, item.id)}
              className="btn btn-outline-warning btn-sm"
            >
              {t("delete")}
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <Fragment>
      {/* insert */}
      <Modal className="fade" show={modalCentered}>
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={save}
        >
          {({ errors, status, touched }) => (
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
      {/* Edit Modal */}
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
          {({ errors, status, touched }) => (
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
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("ingredients")}</h4>
              </div>
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add_ingredient")}
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("name")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>{viewProducts_HTMLTABLE}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Ingredients;
