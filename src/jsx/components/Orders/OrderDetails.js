import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CBreadcrumb } from "@coreui/react";
import CustomAlert from "../CustomAlert";
import { Button, Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactWhatsapp from "react-whatsapp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { localization as t } from "../Localization";
import ItemCard from "./Card";

const OrderDetails = (props) => {
  let message = "";

  const id = props.history.location.state.id;
  const [order, setOrder] = useState([]);
  const [check, setCheck] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);

  // useEffect(() => {
  //   dataLoad();
  //   return () => {
  //     setSum(0);
  //   };
  // }, [check]);
  const initialValues = {
    discardReason: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      discardReason: Yup.string().required("Reason is required"),
    });
  };
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const discardOrder = (data) => {
    axios
      .post(`/api/discardOrder/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "error", res.data.message);
          setCheck(!check);
          setModalCentered(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const completedOrder = () => {
    axios
      .get(`/api/completedOrder/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setAlerts(true, "success", res.data.message);
          setCheck(!check);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {alert.open ? (
        <CustomAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <Link
          to={{
            pathname: `/orders`,
          }}
          className="font-weight-bold"
        >
          {t("orders")}
        </Link>
        {"  ->   "}
        <div className="font-weight-bold">{t("details")}</div>
      </CBreadcrumb>
      <ItemCard setOrder={setOrder} order={order} id={id} />
      {order.status === 1 ? null : (
        <div className="text-right m-1">
          <Button variant="success" className="m-1" onClick={completedOrder}>
            {t("complete_order")}{" "}
          </Button>
          <Button
            variant="danger"
            className="m-1"
            onClick={() => setModalCentered(true)}
          >
            {t("discard_order")}{" "}
          </Button>
        </div>
      )}
      {modalCentered && (
        <Modal className="fade" show={modalCentered}>
          <Modal.Header>
            <Modal.Title>Discard Order</Modal.Title>
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
            onSubmit={discardOrder}
          >
            {({ errors, touched, values }) => (
              <Form>
                <Modal.Body>
                  <div className="form-group">
                    <label> Reason </label>
                    <Field
                      as="textarea"
                      name="discardReason"
                      className={
                        "form-control" +
                        (errors.discardReason && touched.discardReason
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Reason..."
                    />
                    <ErrorMessage
                      name="discardReason"
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
                  <p className="d-none">
                    {
                      (message = `*Order Number*: ${order.id} \n*Status*:* Discarded* \n*Reason*: ${values?.discardReason} \n`)
                    }
                  </p>
                  {values?.discardReason === "" ? (
                    <Button variant="primary" type="submit">
                      {t("save")}{" "}
                    </Button>
                  ) : (
                    <ReactWhatsapp
                      className="btn btn-primary"
                      type="submit"
                      // style={buttonStyle}
                      number={order.phoneNumber}
                      message={message}
                      max="4096"
                      onClick={() => discardOrder()}
                    >
                      <WhatsAppIcon fontSize="small" /> {t("send_order")}
                    </ReactWhatsapp>
                  )}
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </Fragment>
  );
};
export default OrderDetails;
