import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import getSymbolFromCurrency from "currency-symbol-map";
import FormGroup from "@mui/material/FormGroup";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import RecCounter from "./Counter/RecCounter";
import { TemplateContext } from "../TemplateContext";
import { LanguagesContext } from "../LanguagesContext";
const Recommend = (props) => {
  const { locale, style, branch } = useContext(TemplateContext);
  const { recommend, setRecommend } = useContext(LanguagesContext);
  const { note, setNote } = props;
  let [sum, setSum] = useState(0);

  const extraHandlers = (e, price, id, qty) => {
    if (e.target.checked) {
      setSum((sum += parseInt(price)));
      setRecommend((fetchData) =>
        fetchData.map((item) =>
          id == item.value ? { ...item, show: true } : item
        )
      );
    } else {
      setSum((sum -= parseInt(price) * qty));
      setRecommend((fetchData) =>
        fetchData.map((item) =>
          id == item.value ? { ...item, qty: 1, show: false } : item
        )
      );
    }
  };

  const changeHandle = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div>
      {style?.show_recommendation == 0 || recommend.length === 0 ? (
        ""
      ) : (
        <>
          <Typography style={style?.cartPrice}>
            {locale?.recommendation}
          </Typography>
          <FormGroup>
            {recommend?.map((item, i) => {
              return (
                <Grid container spacing={2} key={i}>
                  <Grid item xs={8} sm={8} md={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            item.show == undefined
                              ? false
                              : item.show
                              ? true
                              : false
                          }
                          color="default"
                          onChange={(e) => {
                            extraHandlers(e, item.price, item.value, item.qty);
                          }}
                          sx={style?.checkbox}
                        />
                      }
                      label={
                        <Typography style={style?.cartDescription}>
                          {item.label +
                            " ( +" +
                            (item.price * item.qty).toFixed(2) +
                            " " +
                            getSymbolFromCurrency(branch.currency_code) +
                            " )"}
                        </Typography>
                      }
                    />
                  </Grid>
                  {item?.show ? (
                    <Grid item xs={4} sm={4} md={4}>
                      <RecCounter item={item} sum={sum} setSum={setSum} />
                    </Grid>
                  ) : (
                    " "
                  )}
                </Grid>
              );
            })}
          </FormGroup>
        </>
      )}
      <div className="mr-2 mb-2">
        <TextareaAutosize
          // aria-label="empty textarea"
          onChange={(e) => changeHandle(e)}
          name="itemNote"
          minRows={3}
          placeholder="Note"
          style={style?.inputfieldDetails}
        />
      </div>
    </div>
  );
};

export default Recommend;
