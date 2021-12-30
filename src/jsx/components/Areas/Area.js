import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Area = (props) => {
  // validation start
  const schema = yup
    .object()
    .shape({
      areaName: yup.string().required("This field is a required field"),
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
  // insert start
  const [modalCentered, setModalCentered] = useState(false);
  const [insert, setInsert] = useState({
    areaName: "",
  });
  const handleInput = (e) => {
    e.persist();
    setInsert({ ...insert, [e.target.name]: e.target.value });
  };
  const save = (e) => {
    axios.post("/api/InsertAreas", insert).then((res) => {
      if (res.data.status === 200) {
        setInsert({
          areaName: "",
        });
        setCheck(!check);
        reset();
        setModalCentered(false);
        swal("Success", res.data.message, "success");
      }
    });
  };
  // insert end
  // edit Attribute start
  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);
  const editHandleInput = (e) => {
    e.persist();
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };
  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios.get(`/api/EditAreas/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEdit(res.data.item);
        setEditModalCentered(true);
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };
  // update
  const update = (e) => {
    e.preventDefault();
    axios.post("/api/UpdateAreas", edit).then((res) => {
      if (res.data.status === 200) {
        setEdit({
          areaName: "",
        });
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
        axios.delete(`/api/DeleteAreas/${id}`).then((res) => {
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
    axios.get(`/api/GetAreas`).then((res) => {
      if (res.data.status === 200) {
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

          <td> {item.areaName}</td>
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
        <Form
          onSubmit={handleSubmit(save)}
          method="POST"
          encType="multipart/form-data"
        >
          <Modal.Header>
            <Modal.Title>{t("add")}</Modal.Title>
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
                <strong>{t("name_area")} </strong>{" "}
              </label>
              <input
                type="text"
                {...register("areaName")}
                className="form-control"
                placeholder={t("name_area")}
                name="areaName"
                onChange={handleInput}
                value={insert.areaName}
              />
              <div className="text-danger">{errors.areaName?.message}</div>
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
        <Form onSubmit={update} method="POST">
          <Modal.Header>
            <Modal.Title>{t("edit")} </Modal.Title>
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
                <strong>{t("name_area")}</strong>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("name_area")}
                name="areaName"
                required
                onChange={editHandleInput}
                value={edit.areaName}
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
                <h4 className="card-title mb-2">{t("areas")}</h4>
              </div>
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add")}
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th>{t("number")}</th>
                      <th>{t("areaName")}</th>
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
export default Area;
