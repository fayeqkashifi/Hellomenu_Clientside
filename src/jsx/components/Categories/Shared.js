import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { base_url, port } from "../../../Consts";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import DefaultPic from "../../../images/hellomenu/category.svg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import Chip from "@mui/material/Chip";
import { CBreadcrumb } from "@coreui/react";

const Shared = (props) => {
  // for localization
  const { t } = useTranslation();
  // ID
  const id = props.history.location.state.id;
  const sub_id = props.history.location.state.sub_id;

  const [check, setCheck] = useState(true);
  const [modalCentered, setModalCentered] = useState(false);

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetSharedCatBranches/${sub_id}`).then((res) => {
      if (res.status === 200) {
        setFetchData(res.data);
        setLoading(false);
      }
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
    viewProducts_HTMLTABLE = (
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table  ">
                  <thead>
                    <tr className="card-title">
                      <th>{t("branch_name")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchData.map((item, i) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.BrancheName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <Link
          to={{
            pathname: `/branches/show`,
            state: { id: id },
          }}
          className="font-weight-bold"
        >
          {t("back_to_categories")}
        </Link>
      </CBreadcrumb>
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <Modal.Title>{t("share_with")} </Modal.Title>
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="close"
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>
        <Formik
        //   initialValues={initialValues}
        //   validationSchema={validationSchema}
        //   onSubmit={saveMenu}
        >
          {({ errors, status, touched }) => (
            <Form>
              <Modal.Body>
                <>
                  <div className="form-group">
                    <label> {t("branches")}</label>
                    <Select
                      isMulti
                      options={branches?.map((o, i) => {
                        return {
                          value: o.branchID,
                          label: o.BrancheName,
                        };
                      })}
                      name="branches"
                      //   onChange={handleSelectBranches}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </>
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

      {viewProducts_HTMLTABLE}
    </Fragment>
  );
};

export default Shared;
