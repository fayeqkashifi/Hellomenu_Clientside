import React, { Fragment, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from "@coreui/react";
import Customization from "../Design/Templates/Dark/Customization";
import SubCategory from "../Categories/SubCategory";
import Product from "../Products/Product";
import Category from "../Categories/Category";
import Design from "../Design/Design";
import Inventory from "../Inventories/Inventory";
import PrivateRoute from "../PrivateRoute";
import ServiceArea from "../Services/ServiceArea";
import Unit from "../Units/Unit";
import Tables from "./Tables";
import Variants from "../Variants/Variants";
const Show = (props) => {
  const { t } = useTranslation();
  const id = props.history.location.state.id;
  const BrancheName = props.history.location.state.BrancheName;
  const { path, url } = useRouteMatch();
  console.log(path);
  console.log(url);
  const tabData = [
    {
      name: t("categories"),
      url: {
        pathname: `${url}`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("products"),
      url: {
        pathname: `${url}/products`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("design"),
      url: {
        pathname: `${url}/design`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("tables"),
      url: {
        pathname: `${url}/tables`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("inventory"),
      url: {
        pathname: `${url}/inventory`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("units"),
      url: {
        pathname: `${url}/unit`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("services"),
      url: {
        pathname: `${url}/service-area`,
        state: { id: id, BrancheName: BrancheName },
      },
    },
    {
      name: t("preview"),
      url: {
        pathname: ``,
      },
    },
    {
      name: t("public_link"),
      url: {
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
                          {tabData.map((data, i) =>
                            data.name === t("preview") ? (
                              <Nav.Item as="li" key={i}>
                                <Link
                                  to={data.url}
                                  onClick={(e) =>
                                    phone(e, `/standard-template/${btoa(id)}`)
                                  }
                                >
                                  <Nav.Link eventKey={data.name.toLowerCase()}>
                                    {data.name}
                                  </Nav.Link>
                                </Link>
                              </Nav.Item>
                            ) : (
                              <Nav.Item as="li" key={i}>
                                <Link
                                  to={data.url}
                                  target={
                                    data.name === t("public_link")
                                      ? "_blank"
                                      : ""
                                  }
                                >
                                  <Nav.Link eventKey={data.name.toLowerCase()}>
                                    {data.name}
                                  </Nav.Link>
                                </Link>
                              </Nav.Item>
                            )
                          )}
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

        <Switch>
          <PrivateRoute exact path={`${path}`} component={Category} />
          <PrivateRoute path={`${path}/sub-category`} component={SubCategory} />

          {/* <PrivateRoute path={`${path}/category`} component={Category} /> */}
          <PrivateRoute path={`${path}/design`} component={Design} />
          <PrivateRoute path={`${path}/products`} component={Product} />
          <PrivateRoute path={`${path}/variants`} component={Variants} />
          <PrivateRoute path={`${path}/service-area`} component={ServiceArea} />
          <PrivateRoute path={`${path}/unit`} component={Unit} />
          <PrivateRoute path={`${path}/inventory`} component={Inventory} />
          <PrivateRoute path={`${path}/tables`} component={Tables} />
          <PrivateRoute
            path={`/dark-template-customization`}
            component={Customization}
          />
        </Switch>
      </Router>
    </Fragment>
  );
};

export default Show;
