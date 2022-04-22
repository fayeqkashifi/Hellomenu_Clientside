import React, { useContext } from "react";
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
import { TemplateContext } from "../TemplateContext";

export default function Drawer(props) {
  const { style, locale } = useContext(TemplateContext);

  const { modalCentered, setModalCentered } = props;

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
                {locale?.order_details}
              </Typography>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={style?.cardBody}>
            <Cart checkBit={true} />
          </Modal.Body>
        </Modal>
      ) : (
        <COffcanvas
          placement="end"
          scroll
          visible={modalCentered}
          onHide={() => setModalCentered(false)}
        >
          <COffcanvasHeader>
            <COffcanvasTitle>
              {locale?.cart}
              <br></br>
            </COffcanvasTitle>
            <CCloseButton
              className="text-reset"
              onClick={() => setModalCentered(false)}
            />
          </COffcanvasHeader>
          <COffcanvasBody>
            <Cart checkBit={true} />
          </COffcanvasBody>
        </COffcanvas>
      )}
    </div>
  );
}
