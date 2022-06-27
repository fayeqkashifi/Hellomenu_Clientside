import React, { useContext, useState } from "react";

import { TemplateContext } from "../TemplateContext";
import {
  Link,
  BrowserRouter as Router,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import TrackOrder from "../Common/Orders/TrackOrder";
import PublicRoute from "../../../PublicRoute";
import Home from "./Home";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PageviewIcon from "@mui/icons-material/Pageview";
import Cart from "../Common/Orders/Cart";
import Profile from "../Common/Profile/Profile";
import MainDetails from "../MainDetails";
import Badge from "@mui/material/Badge";
import VideoList from "../Common/Story/VideoList";
import VideoDetails from "../Common/Story/VideoDetails";
import VideosShow from "../Common/Story/VideosShow";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";

const drawerWidth = 75;
export default function SecondMain(props) {
  const { style, locale, cart, isTablet, branch } = useContext(TemplateContext);
  const { path, url } = useRouteMatch();

  const geturl = document.location.href.split("/");

  const [urlCheck, setUrlCheck] = useState(
    geturl[5] !== undefined
      ? geturl[5] == "profile" ||
        geturl[5] == "track-order" ||
        geturl[5] == "cart"
        ? geturl[5]
        : "home"
      : "home"
  );
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const valueMenu = (
    <>
      <Tooltip title={locale?.home} placement={style?.tooltipPlacement} arrow>
        <Link
          to={`${url}`}
          style={
            urlCheck === "home" ? style?.sidebarActiveLink : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("home")}
        >
          <HomeIcon />
        </Link>
      </Tooltip>
      <Tooltip
        title={locale?.profile}
        placement={style?.tooltipPlacement}
        arrow
      >
        <Link
          to={`${url}/profile`}
          // style={style?.sidebarLinks}
          style={
            urlCheck === "profile"
              ? style?.sidebarActiveLink
              : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("profile")}
        >
          <PersonIcon />
        </Link>
      </Tooltip>
      <Tooltip title={locale?.cart} placement={style?.tooltipPlacement} arrow>
        <Link
          to={`${url}/cart`}
          style={
            urlCheck === "cart" ? style?.sidebarActiveLink : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("cart")}
        >
          <Badge
            badgeContent={cart.length}
            sx={style?.BadgeStyle}
            overlap="circular"
          >
            <ShoppingCartIcon />
          </Badge>
        </Link>
      </Tooltip>
      <Tooltip
        title={locale?.track_order}
        placement={style?.tooltipPlacement}
        arrow
      >
        <Link
          to={`${url}/track-order`}
          style={
            urlCheck === "track-order"
              ? style?.sidebarActiveLink
              : style?.sidebarLinks
          }
          onClick={() => setUrlCheck("track-order")}
        >
          <PageviewIcon />
        </Link>
      </Tooltip>
    </>
  );
  return (
    <Router>
      <div style={style?.content}>
        <div style={style?.background}>
          <Switch>
            <PublicRoute exact path={`${path}`} component={Home} />
            <PublicRoute path={`${path}/track-order`} component={TrackOrder} />
            <PublicRoute path={`${path}/cart`} component={Cart} />
            <PublicRoute path={`${path}/profile`} component={Profile} />
            <PublicRoute path={`${path}/details/:id`} component={MainDetails} />
            <PublicRoute path={`${path}/video-list`} component={VideoList} />
            <PublicRoute
              path={`${path}/video-details"`}
              component={VideoDetails}
            />
            <PublicRoute path={`${path}/video`} component={VideosShow} />
          </Switch>
        </div>
      </div>
      {isTablet ? (
        <div
          style={style?.logoText}
          className="d-flex align-items-center justify-content-left"
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            // sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon style={style?.iconSize} />
          </IconButton>
          <Typography style={style?.price}>{branch.BrancheName}</Typography>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <div className="text-center">
              {" "}
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            {valueMenu}
          </Drawer>
        </div>
      ) : (
        <Box component="footer" sx={style?.footerStyle} className="mt-5">
          {valueMenu}
        </Box>
      )}
    </Router>
  );
}
