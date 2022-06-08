import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import { Modal } from "react-bootstrap";
import { localization as t } from "../Localization";
import axios from "axios";

const OrderStatus = (props) => {
  const { item } = props;
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const dataLoad = async () => {
    try {
      const result = await axios.get(`/api/getOrderStatus`);
      if (result.data.status === 200) {
        setData(result.data.fetchData);
      } else {
        throw Error("Due to an error, the data cannot be retrieved.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setData([]);
    };
  }, []);
  return (
    <>
      <Chip
        onClick={() => setModalShow(true)}
        key={item.status_id}
        label={item.label}
        color={
          item.status_id === 1
            ? "default"
            : item.status_id === 2
            ? "primary"
            : item.status_id === 3
            ? "secondary"
            : item.status_id === 4
            ? "info"
            : item.status_id === 5
            ? "warning"
            : item.status_id === 6
            ? "success"
            : "error"
        }
        variant="outlined"
        size="small"
      />
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={data}
        item={item}
      />
    </>
  );
};
function MyVerticallyCenteredModal(props) {
  const { data, item } = props;
  const [check, setCheck] = useState(false);

  const ChangeStatus = (statusId, itemId, label) => {
    const formData = new FormData();
    formData.append("order_status_id", statusId);
    formData.append("order_id", itemId);
    axios
      .post(`/api/changeOrderStatus`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          item.status_id = statusId;
          item.status = label;
          setCheck(!check);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("change_status")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="col-xl-12 col-xxl-12 col-lg-12col-sm-12 d-flex align-items-center justify-content-center"
          key={check}
        >
          {data?.map((itemMap) => {
            return (
              <Chip
                key={itemMap.id}
                onClick={() => ChangeStatus(itemMap.id, item.id, itemMap.label)}
                label={itemMap.label}
                color={
                  itemMap.id === 1
                    ? "default"
                    : itemMap.id === 2
                    ? "primary"
                    : itemMap.id === 3
                    ? "secondary"
                    : itemMap.id === 4
                    ? "info"
                    : itemMap.id === 5
                    ? "warning"
                    : itemMap.id === 6
                    ? "success"
                    : "error"
                }
                className="mr-2"
                variant={itemMap.id === item.status_id ? "" : "outlined"}
                // size="small"
              />
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default OrderStatus;
