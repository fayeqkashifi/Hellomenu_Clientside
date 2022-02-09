import * as React from "react";
import {
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from "@coreui/react";
import { Modal } from "react-bootstrap";
import Cart from "../Common/Cart";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export default function Drawer(props) {
  const { t } = useTranslation();

  const {
    modalCentered,
    setModalCentered,
    cart,
    setCart,
    style,
    branchId,
    deliveryFees,
  } = props;

  return (
    <div>
      {style?.template === "dark" ? (
        <Modal
          className="fade bd-example-modal-lg"
          size="lg"
          show={modalCentered}
          onHide={() => setModalCentered(false)}
        >
          <Modal.Header style={style?.cardHeader}>
            <Modal.Title>
              <Typography style={style?.categories}>
                {t("order_details")}
              </Typography>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={style?.cardBody}>
            <Cart
              style={style}
              checkBit={true}
              branchId={branchId}
              cart={cart}
              setCart={setCart}
              deliveryFees={deliveryFees}
            />
          </Modal.Body>
        </Modal>
      ) : (
        <COffcanvas
          placement="end"
          // className="fade bd-example-modal-lg"
          // style={{ width: "70px" }}
          scroll
          visible={modalCentered}
          onHide={() => setModalCentered(false)}
        >
          <COffcanvasHeader>
            <COffcanvasTitle>
              CART
              <br></br>
            </COffcanvasTitle>
            <CCloseButton
              className="text-reset"
              onClick={() => setModalCentered(false)}
            />
          </COffcanvasHeader>
          <COffcanvasBody>
            <Cart
              style={style}
              checkBit={true}
              branchId={branchId}
              cart={cart}
              setCart={setCart}
              deliveryFees={deliveryFees}
            />
          </COffcanvasBody>
        </COffcanvas>
      )}
    </div>
  );
}
