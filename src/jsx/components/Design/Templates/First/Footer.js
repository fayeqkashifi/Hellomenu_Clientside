import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

function Footer(props) {
  const { title } = props;

  return (
    <Box component="footer" sx={{ bgcolor: 'light',position:"sticky" }}  className="bottom-0 py-1">
      <Container maxWidth="sm" >
            <Button variant="contained" color="warning" className="col-12">{title}</Button>
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Footer;