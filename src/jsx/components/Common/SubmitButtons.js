import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const SubmitButtons = (props) => {
  const history = useHistory();

  return (
    <>
      <LoadingButton
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className="m-1"
        onClick={() => history.goBack()}
      >
        {props.left}
      </LoadingButton>
      <LoadingButton
        loading={props.isSubmitting}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="outlined"
        type="submit"
      >
        {props.right}{" "}
      </LoadingButton>
    </>
  );
};

export default SubmitButtons;
