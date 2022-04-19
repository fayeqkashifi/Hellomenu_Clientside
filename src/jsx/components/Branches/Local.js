import React, { useState, useEffect } from "react";
import MySelect from "../Common/MySelect";
import axios from "axios";
import { localization as t } from "../Localization";
import { Option, MultiValue, animatedComponents } from "../Common/SelectOption";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import { Button, Modal } from "react-bootstrap";

const Local = (props) => {
  const { modalCentered, setModalCentered } = props;
  return (
    <Modal className="fade" size="lg" show={modalCentered}>
      <form
      //    onSubmit={saveServiceAreas}
      >
        <Modal.Header>
          <Modal.Title>{t("add_service_area")}</Modal.Title>
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row ">
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
              <div className="form-group">
                <div className="d-flex justify-content-between">
                  <label className="mb-1 ">
                    {" "}
                    <strong>{t("areas")}</strong>{" "}
                    <small>
                      (Please first choose the fields and then set the input
                      values.)
                    </small>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* {servicesAreas?.map((item, i) => {
            return (
              <div className="row m-1" key={i}>
                <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                  <label className="mb-1 ">
                    <strong>{item.label}</strong>
                  </label>
                </div>
                <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control"
                    placeholder="Delivery charges for this Area"
                    onChange={(e) => serviceAreaHandle(e, item.value)}
                    value={servicesAreas[i].areaName}
                  />
                </div>
              </div>
            );
          })} */}
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
      </form>
    </Modal>
  );
};

export default Local;
