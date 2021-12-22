import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

function Footer(props) {
  const { title, url, theme } = props;

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "light", position: "sticky" }}
      className="bottom-0 py-1"
    >
      <Container maxWidth="sm">
        <Link
          className="col-12 btn "
          style={{
            textTransform: "capitalize",
            backgroundColor: theme?.button_background_color
              ? theme.button_background_color
              : "#ff751d",
            color: theme?.button_text_color
              ? theme.button_text_color
              : "#f1fcfe",
          }}
          to={url}
        >
          {title}
        </Link>
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Footer;
