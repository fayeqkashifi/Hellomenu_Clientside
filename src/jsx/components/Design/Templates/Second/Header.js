import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useHistory } from "react-router-dom";

function Header(props) {
  const history = useHistory();
  const { title } = props;
  return (
    <React.Fragment>
      <Toolbar>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Typography
          component="h2"
          variant="h6"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <ShoppingBasketOutlinedIcon />
        </IconButton>
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
