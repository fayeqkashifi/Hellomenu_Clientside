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
    <div
      className={`d-flex flex-row align-items-center justify-content-center`}
    >
      <div>
        <IconButton
          onClick={() => handleDecrement(item.qty, item.value, item.price)}
        >
          <RemoveRoundedIcon style={style?.counterDecrementIcon} />
        </IconButton>
      </div>
      <div>
        <IconButton>
          <Typography style={style?.counterValue}>{item.qty}</Typography>
        </IconButton>
      </div>

      <div>
        <IconButton
          onClick={() =>
            handelIncrement(item.qty, item.value, item.price, item.stock)
          }
        >
          <AddRoundedIcon style={style?.counterIncrementIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default RecCounter;
