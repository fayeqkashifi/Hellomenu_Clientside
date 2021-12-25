import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

function Footer(props) {
  const { title, url, theme, stock } = props;

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "light", position: "sticky", bottom: "0px" }}
      className="bottom-0 py-1"
    >
      <Container maxWidth="sm">
        {stock == "No Stock" || stock == 0 ? (
          <Link
            className="col-12 btn disabled"
            style={{
              textTransform: "capitalize",
              backgroundColor: theme?.button_background_color
                ? theme.button_background_color
                : "#ff751d",
              color: theme?.button_text_color
                ? theme.button_text_color
                : "#f1fcfe",
              fontSize: theme?.bTextSize ? theme.bTextSize + "rem" : "1rem",
            }}
            to={url}
          >
            {title}
          </Link>
        ) : (
          <Link
            className="col-12 btn"
            style={{
              textTransform: "capitalize",
              backgroundColor: theme?.button_background_color
                ? theme.button_background_color
                : "#ff751d",
              color: theme?.button_text_color
                ? theme.button_text_color
                : "#f1fcfe",
              fontSize: theme?.bTextSize ? theme.bTextSize + "rem" : "1rem",
            }}
            to={url}
          >
            {title}
          </Link>
        )}
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Footer;
