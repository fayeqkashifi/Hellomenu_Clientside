import React, { useContext, useState } from "react";
import Footer from "../Common/Layout/Footer";
import { TemplateContext } from "../TemplateContext";
import "./style.css";
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
import VideosShow from "../Common/Story/VideosShow";
import Tooltip from "@mui/material/Tooltip";
import profile from "../../../../../images/hellomenu/logo.svg";
import { base_url, port } from "../../../../../Consts";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
const drawerWidth = 75;

export default function Main() {
  const { path, url } = useRouteMatch();
  const { style, locale, branch, cart, isMobile, isTablet } =
    useContext(TemplateContext);
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
      <Tooltip title={locale?.home} placement={style?.tooltipPlacement}>
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
      <Tooltip title={locale?.profile} placement={style?.tooltipPlacement}>
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
      <Tooltip title={locale?.cart} placement={style?.tooltipPlacement}>
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
      <Tooltip title={locale?.track_order} placement={style?.tooltipPlacement}>
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
      <div style={style?.sidebar}>
        {isMobile || isTablet ? (
          <Box sx={{ display: "flex" }} style={style?.logoText}>
            <CssBaseline />
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography style={style?.price}>{branch.BrancheName}</Typography>
            </Toolbar>
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
              <div className="text-right">
                {" "}
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              {valueMenu}
            </Drawer>
          </Box>
        ) : (
          <>
            <div style={style?.logoText}>
              <img
                src={
                  branch.branchImages === null
                    ? profile
                    : `http://${base_url}:${port}/images/branches/${
                        JSON.parse(branch.branchImages)[0]
                      }`
                }
                alt="logo"
                style={style?.logoImage}
              />
              {valueMenu}
            </div>
          </>
        )}
      </div>
      <div style={style?.content}>
        <div style={style?.background}>
          <Switch>
            <PublicRoute exact path={`${path}`} component={Home} />
            <PublicRoute path={`${path}/track-order`} component={TrackOrder} />
            <PublicRoute path={`${path}/cart`} component={Cart} />
            <PublicRoute path={`${path}/profile`} component={Profile} />
            <PublicRoute path={`${path}/details/:id`} component={MainDetails} />
            <PublicRoute path={`${path}/video-list`} component={VideoList} />

            <PublicRoute path={`${path}/video`} component={VideosShow} />
          </Switch>
        </div>
      </div>
      <Footer />
    </Router>
  );
}
