import React, { Fragment, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import {Link, BrowserRouter as Router, Switch } from "react-router-dom"

import { useTranslation } from "react-i18next";
import Category from "../Categories/Category";
import ServiceArea from "../Services/ServiceArea";
import Unit from "../Units/Unit";
import Inventory from "../Inventories/Inventory";
import Design from "../Design/Design";
import Tables from "./Tables";
import PrivateRoute from "../../components/PrivateRoute";
import {
 
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from "@coreui/react";
import CreateRoute from "./CreateRoute]";
const Show = (props) => {
  const { t } = useTranslation();
  const id = props.history.location.state.id;
  const BrancheName = props.history.location.state.BrancheName;

  const tabData = [
    {
      name: t("categories"),
      url: {
        pathname: `/branches/category`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("design"),
      url: {
        pathname: `/branches/design`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("tables"),
      url: {
        pathname: `/branches/tables`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("inventory"),
      url: {
        pathname: `/branches/inventory`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("units"),
      url: {
        pathname: `/branches/unit`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("services"),
      url: {
        pathname: `/branches/service-area`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    { name: t("preview"),  url: {
      pathname: ``,
    },
  },
    { name: t("public_link"),  url: {
      pathname: `/standard-template/${btoa(id)}`,
    },
    },
  ];
  // to display public link inside phone
  const [visible, setVisible] = useState(false);

  const [destinationLink, setDestinationLink] = useState("");
  const phone = (e, srcLink) => {
    e.preventDefault();
    setDestinationLink(srcLink);
    setVisible(true);
  };
  return (
    <Fragment>
		<Router>

      <div className="row">
        <div className="col-xl-9 col-xxl-12">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header border-0 pb-2 d-lg-flex d-block">
                  <div>
                    <h4 className="card-title mb-2">{BrancheName}</h4>
                  </div>
                  <div className="card-action card-tabs mt-3 mt-3 mt-lg-0">
                    <Tab.Container
                      defaultActiveKey={tabData[0].name.toLowerCase()}
                    >
                      <Nav as="ul" className="nav-tabs">
                        {tabData.map((data, i) => (
                          data.name===t('preview')? 
                          <Nav.Item as="li" key={i}>
                            <Link to={data.url}  
                            onClick={(e) =>
                            phone(
                              e,
                              `/standard-template/${btoa(id)}`
                            )
                          }>
                              <Nav.Link eventKey={data.name.toLowerCase()}>
                                {data.name}
                              </Nav.Link>
                            </Link>
                          </Nav.Item>
                          :
                          <Nav.Item as="li" key={i}>
                            <Link to={data.url} target={data.name===t('public_link')? "_blank": ""}>
                              <Nav.Link eventKey={data.name.toLowerCase()}>
                                {data.name}
                              </Nav.Link>
                            </Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                    </Tab.Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <COffcanvas
        placement="end"
        className="fade bd-example-modal-lg"
        scroll
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>{t("display_mobile")}</COffcanvasTitle>
          <CCloseButton
            className="text-reset"
            onClick={() => setVisible(false)}
          />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div className="wrapper">
            <div className="iphone">
              <div className="power"></div>
              <div className="lock"></div>
              <div className="volume up"></div>
              <div className="volume down"></div>
              <div className="camera"></div>
              <div className="speaker"></div>
              <div className="screen">
                <iframe
                  src={destinationLink}
                  height="100%"
                  width="100%"
                  title="Devices"
                ></iframe>
              </div>
              <div className="button">
                <div className="square"></div>
              </div>
            </div>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      <CreateRoute />
      
		</Router>


    </Fragment>
  );
};

export default Show;
