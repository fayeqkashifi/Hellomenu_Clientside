import React, { useContext } from "react";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  recDecrementQuantity,
  recIncrementQuantity,
} from "../../Functionality";
import { TemplateContext } from "../../TemplateContext";
import { LanguagesContext } from "../../LanguagesContext";
const RecCounter = (props) => {
  const { style, locale, setAlerts } = useContext(TemplateContext);
  const { recommend, setRecommend } = useContext(LanguagesContext);
  let { item, sum, setSum } = props;

  const handleDecrement = (qty, id, price) => {
    recDecrementQuantity(qty, id, recommend).then((data) => {
      if (data !== null) {
        setRecommend(data);
        item.qty = qty - 1;
        setSum((sum -= parseInt(price)));
      }
    });
  };
  const handelIncrement = (qty, id, price, stock) => {
    recIncrementQuantity(qty, id, stock, recommend).then((data) => {
      if (data !== null) {
        setRecommend(data);
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
