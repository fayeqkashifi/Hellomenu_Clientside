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
  const {
    // ,
    locale,
    cart,
    setCart,
    setAlerts,
    style,
    extraValue,
    ingredients,
    branch,
    skuarray,
    activeSKU,
  } = useContext(TemplateContext);
  const { fetchData, recommend, setRecommend } = useContext(LanguagesContext);
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

  const addItem = (e) => {
    const recom = recommend.map((item) => {
      if (item.show) {
        const array = {
          value: item.value,
          qty: item.qty,
        };
        return array;
      }
    });
    const check = cart.every((val) => {
      return val.id !== fetchData.id;
    });
    let array = [];
    if (check) {
      array.push({
        id: fetchData.id,
        qty: fetchData.qty,
        // currency_code: item[0].currency_code,
        // price: orignalPrice,
        // stock: orignalStock,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        // totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      localStorage.setItem("cart", JSON.stringify(cart.concat(array)));
      setCart(cart.concat(array));
      setAlerts(true, "success", "Successfully added to cart");
    } else {
      let data = cart.filter((val) => {
        return val.id === fetchData.id;
      });
      array.push({
        id: data[0].id,
        qty: data[0].qty,
        // currency_code: data[0].currency_code,
        // price: orignalPrice,
        // stock: orignalStock,
        itemNote: note.itemNote,
        recommendations: recom.filter((item) => item !== undefined),
        ingredients: ingredients,
        extras: extraValue,
        // totalPrice: parseInt(price) + sum,
        variantSKU: skuarray,
        checkSKU: activeSKU,
      });
      const otherData = cart.filter((val) => {
        return val.id !== fetchData.id;
      });
      localStorage.setItem("cart", JSON.stringify(otherData.concat(array)));
      setCart(otherData.concat(array));
      setAlerts(true, "success", "Cart Updated");
    }
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
