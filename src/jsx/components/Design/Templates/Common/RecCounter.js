import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CustomAlert from "../../../CustomAlert";
import IconButton from "@mui/material/IconButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { recDecrementQuantity, recIncrementQuantity } from "../Functionality";
const RecCounter = (props) => {
  const { style, setFetchData, item, fetchData, setSum, locale } = props;
  let { sum } = props;
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };
  const handleDecrement = (qty, id, price) => {
    recDecrementQuantity(qty, id, fetchData).then((data) => {
      if (data !== null) {
        setFetchData(data);
        item.qty = qty - 1;
        setSum((sum -= parseInt(price)));
      }
    });
  };
  const handelIncrement = (qty, id, price, stock) => {
    recIncrementQuantity(qty, id, stock, fetchData).then((data) => {
      if (data !== null) {
        setFetchData(data);
        item.qty = qty + 1;
        setSum((sum += parseInt(price)));
      } else {
        setAlerts(
          true,
          "warning",
          locale?.more_than_that_isnot_available_because_itis_out_of_stock
        );
      }
    });
  };

  return (
    <div className="row">
      {alert.open ? (
        <CustomAlert
          vertical="top"
          horizontal="right"
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}

      <div className={`row`}>
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4">
          <Typography variant="h6" gutterBottom>
            <IconButton
              onClick={() => handleDecrement(item.qty, item.value, item.price)}
            >
              <Typography style={style?.counterDecrementIcon}>
                <RemoveRoundedIcon />
              </Typography>
            </IconButton>
          </Typography>
        </div>
        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4 mt-1">
          {" "}
          <IconButton>
            <Typography style={style?.counterValue}>{item.qty}</Typography>
          </IconButton>
        </div>

        <div className="col-xs-4 col-md-4 col-lg-4 col-xlg-4 col-sm-4">
          <IconButton
            onClick={() =>
              handelIncrement(item.qty, item.value, item.price, item.stock)
            }
          >
            <Typography style={style?.counterIncrementIcon}>
              <AddRoundedIcon />
            </Typography>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default RecCounter;
