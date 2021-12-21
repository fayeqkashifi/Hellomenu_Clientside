import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

function Footer(props) {
  const { title, url } = props;

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
            backgroundColor: "#ff751d",
            color: "#f1fcfe",
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
