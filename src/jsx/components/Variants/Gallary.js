import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { base_url, port } from "../../../Consts";
const Gallery = (props) => {
  // for localization
  const { t } = useTranslation();
  // get ID
  const id = props.match.params.id;
  //  insert Start
  const [modalCentered, setModalCentered] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleImageChange = (e) => {
    const imagesArray = [];
    for (let i = 0; i < e.target.files.length; i++) {
      imagesArray.push(e.target.files[i]);
    }
    setImageState({ ...imageState, image: imagesArray });

    setSelectedFiles([]);
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedFiles((prevImages) => prevImages.concat(filesArray));
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };
  const renderPhotos = (source) => {
    return source.map((photo) => {
      return (
        <img
          className="p-2"
          src={photo}
          alt=""
          key={photo}
          style={{ width: "100", height: "100px" }}
        />
      );
    });
  };
  // insert Pictures
  const savePictures = (e) => {
    e.preventDefault();
    // console.log(e.target[0].files);

    // var files = e.target[0].files;
    const formData = new FormData();
    for (let i = 0; i < imageState.image.length; i++) {
      formData.append("file[]", imageState.image[i]);
    }
    // formData.append('file', imageState.PicturesLocation	);

    formData.append("variantID", id);
    // console.log(formData);
    axios.post("/api/InsertPictures", formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        setModalCentered(false);
        setSelectedFiles([]);
      }
    });
  };
  // insert End

  // delete start
  const deletePicture = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeletePictures/${id}`).then((res) => {
          if (res.data.status === 200) {
            setSelectedFiles([]);
            swal("Success", res.data.message, "success");
            // thisClicked.closest("tr").remove();
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  // delete end

  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageState, setImageState] = useState([]);
  useEffect(() => {
    axios.get(`/api/GetPictures/${id}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [selectedFiles, id]);

  var viewImages_HTMLTABLE = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewImages_HTMLTABLE = fetchData.map((item, i) => {
      return (
        <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
          <div className="card overflow-hidden">
            <div className="text-center">
              <div className="profile-photo">
                <img
                  style={{
                    with: "100px",
                    height: "250px",
                    objectFit: "contain",
                  }}
                  src={`http://${base_url}:${port}/images/variants_pics/${item.PicturesLocation}`}
                  className="d-block w-100 img-thumbnail"
                  alt=""
                />
              </div>
            </div>
            <div className="card-footer pt-0 pb-0 text-center">
              <div className="row">
                <div className="col-12 pt-3 pb-3">
                  <Link onClick={(e) => deletePicture(e, item.id)}>
                    <span>{t("delete")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <Fragment>
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <CBreadcrumbItem className="font-weight-bold" href="/branches">
          {t("Branches")}
        </CBreadcrumbItem>
      </CBreadcrumb>
      {/* <!-- Insert  Modal --> */}
      <Modal className="fade bd-example-modal-lg" show={modalCentered}>
        <Form
          onSubmit={savePictures}
          method="POST"
          encType="multipart/form-data"
        >
          <Modal.Header>
            <Modal.Title>{t("add_to_gallery")}</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="close"
            >
              <span>&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                <div className="form-group">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("images")}</strong>{" "}
                  </label>
                  {/* <div className="file-loading"> */}
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    onChange={handleImageChange}
                    required
                    multiple
                    data-overwrite-initial="false"
                    data-min-file-count="1"
                  />
                </div>
              </div>
              <div className="result">{renderPhotos(selectedFiles)}</div>
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
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("images")}</h4>
              </div>
              <div className="dropdown">
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 mr-2"
                  onClick={() => setModalCentered(true)}
                >
                  {t("add_to_gallery")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">{viewImages_HTMLTABLE}</div>
    </Fragment>
  );
};

export default Gallery;