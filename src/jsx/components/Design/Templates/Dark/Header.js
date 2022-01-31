import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Cart from "./Cart";
function Header(props) {
  const { t } = useTranslation();

  const history = useHistory();
  const [modalCentered, setModalCentered] = useState(false);

  const {
    menu,
    activeMenu,
    setProducts,
    setActiveMenu,
    custom,
    cart,
    branch,
    setCart,
    deliveryFees,
  } = props;
  const filterProducts = (menu) => {
    if (menu.sub_category_id === null) {
      setActiveMenu(menu.CategoryName + menu.category_id);
      axios
        .get(`/api/GetProductsBasedCategory/${menu.category_id}`)
        .then((res) => {
          if (res.data.status === 200) {
            setProducts(res.data.data);
          }
        });
    } else {
      setActiveMenu(menu.SubCategoryName + menu.sub_category_id);

      axios
        .get(`/api/GetProductsBasedOnSubCategory/${menu.sub_category_id}`)
        .then((res) => {
          if (res.data.status === 200) {
            setProducts(res.data.data);
          }
        });
    }
  };
  return (
    <React.Fragment>
      <Toolbar sx={{ position: "sticky" }} className="top-0">
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon
            fontSize="small"
            sx={{
              color: "#fff",
            }}
          />
        </IconButton>
        <Typography align="center" sx={{ flex: 1 }}></Typography>
        <IconButton onClick={() => setModalCentered(true)}>
          <Badge
            badgeContent={cart.length}
            sx={{
              "& .MuiBadge-badge": {
                color: custom?.menusDeactiveColor
                  ? custom.menusDeactiveColor
                  : "#fff",
                backgroundColor: custom?.menusAcriveColor
                  ? custom.menusAcriveColor
                  : "#f27d1e",
              },
            }}
            overlap="circular"
          >
            <AddShoppingCartIcon
              fontSize="small"
              sx={{
                color: "#fff",
              }}
            />
          </Badge>
        </IconButton>
      </Toolbar>

      {menu === 0 ? (
        " "
      ) : (
        <div>
          <Toolbar
            component="nav"
            variant="dense"
            sx={{
              // justifyContent: "space-between",
              overflowX: "auto",
              marginTop: "-25px",
            }}
          >
            {menu?.map((section, i) => (
              <Typography
                className="px-3"
                style={
                  activeMenu ===
                  (section.sub_category_id === null
                    ? section.CategoryName + section.category_id
                    : section.SubCategoryName + section.sub_category_id)
                    ? {
                        cursor: "pointer",
                        borderBottomStyle: "solid",
                        borderottomWidth: "2px",
                        width: "fit-content",
                        borderColor: custom?.menusAcriveColor
                          ? custom.menusAcriveColor
                          : "#f27d1e",

                        // color: "#f27d1e",
                      }
                    : {
                        cursor: "pointer",
                        color: custom?.menusDeactiveColor
                          ? custom.menusDeactiveColor
                          : "#fff",
                      }
                }
                key={i}
                variant="h6"
                sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
                onClick={() => filterProducts(section)}
              >
                {section.SubCategoryName === null
                  ? section.CategoryName
                  : section.SubCategoryName}
              </Typography>
            ))}
          </Toolbar>
        </div>
      )}
      <Modal
        className="fade bd-example-modal-lg"
        size="lg"
        show={modalCentered}
        onHide={() => setModalCentered(false)}
      >
        <Modal.Header
          style={{
            backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
            borderColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
          }}
        >
          <Modal.Title>
            <Typography variant="h6">{t("order_details")}</Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
          }}
        >
          <Cart
            custom={custom}
            checkBit={true}
            branch={branch}
            cart={cart}
            setCart={setCart}
            deliveryFees={deliveryFees}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default Header;
