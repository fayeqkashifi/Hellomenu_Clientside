import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Attributes = (props) => {
  // validation start
  const schema = yup
    .object()
    .shape({
      attributeName: yup.string().required("This field is a required field"),
    })
    .required();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // validation end

  // for localization
  const { t } = useTranslation();

  // insert Attribute start
  const [modalCentered, setModalCentered] = useState(false);
  const [attributeInsert, setAttributeInsert] = useState([]);
  const handleInput = (e) => {
    e.persist();
    console.log(e.target.value);
    setAttributeInsert({ ...attributeInsert, [e.target.name]: e.target.value });
  };
  const saveAttribute = (e) => {
    // e.preventDefault();
    axios.post("/api/InsertAttribute", attributeInsert).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);
        setAttributeInsert([]);
        reset();

        swal("Success", res.data.message, "success");
        setModalCentered(false);
        //  this.props.history.push("/")
      }
    });
  };
  // insert Attribute end

  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [editAttribute, setEditAttribute] = useState([]);
  const editHandleInput = (e) => {
    e.persist();

    setEditAttribute({ ...editAttribute, [e.target.name]: e.target.value });
  };
  // fetch the exact Attribute
  const fetchAttribute = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditAttribute/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEditAttribute(res.data.item);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // update the Attribute
  const updateAttribute = (e) => {
    e.preventDefault();
    axios.post("/api/UpdateAttribute", editAttribute).then((res) => {
      if (res.data.status === 200) {
        setCheck(!check);

        setEditAttribute([]);
        setEditModalCentered(false);

        swal("Success", res.data.message, "success");
        //  this.props.history.push("/")
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // edit Attribute end

  // delete Attribute Start
  const deleteAttribute = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteAttribute/${id}`).then((res) => {
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
  // delete Attribute End

  //retriving data using laravel API for show
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  useEffect(() => {
    axios.post(`/api/GetAttributes`).then((res) => {
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

          <td> {item.attributeName}</td>
          <td>
            {/* <Link to={`add-option/${item.id}`} className="btn btn-outline-danger btn-sm">{t('options')}</Link>&nbsp;&nbsp;&nbsp; */}
            <button
              type="button"
              onClick={(e) => fetchAttribute(e, item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              {t("edit")}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              onClick={(e) => deleteAttribute(e, item.id)}
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
      <Modal className="fade" show={modalCentered}>
        <Form
          onSubmit={handleSubmit(saveAttribute)}
          method="POST"
          encType="multipart/form-data"
        >
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
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("attribute_name")} </strong>{" "}
              </label>
              <input
                type="text"
                {...register("attributeName")}
                className="form-control"
                placeholder={t("attribute_name")}
                name="attributeName"
                onChange={handleInput}
                value={attributeInsert.attributeName}
              />
              <div className="text-danger">{errors.attributeName?.message}</div>
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
              {t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Edit Modal */}
      <Modal className="fade" show={editmodalCentered}>
        <Form onSubmit={updateAttribute} method="POST">
          <Modal.Header>
            <Modal.Title>{t("edit_Attribute")} </Modal.Title>
            <Button
              onClick={() => setEditModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label className="mb-1 ">
                {" "}
                <strong>{t("attribute_name")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("attribute_name")}
                name="attributeName"
                required
                onChange={editHandleInput}
                value={editAttribute.attributeName}
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
      </Modal>
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("attributes")}</h4>
              </div>
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add_attribute")}
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("attribute_name")}</th>
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

export default Attributes;
