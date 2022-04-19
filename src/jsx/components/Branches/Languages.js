import React, { useState, useEffect } from "react";
import MySelect from "../Common/MySelect";
import axios from "axios";
import { localization as t } from "../Localization";
import { Option, MultiValue, animatedComponents } from "../Common/SelectOption";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";

const Languages = (props) => {
  const { selectedLang, setSelectedLang, setAlerts } = props;
  const [lang, setLang] = useState([]);
  useEffect(() => {
    axios
      .get("/api/getLanguages")
      .then((res) => {
        setLang(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      setLang([]);
    };
  }, []);

  const handleSelectEvent = (e) => {
    setSelectedLang(e);
  };
  const changeStatus = (e, value) => {
    let newLang = selectedLang.map((item) => {
      if (item.value === value) {
        item.status = e.target.checked === true ? 1 : 0;
      }
      return item;
    });
    let check = selectedLang.every((item) => item.status === 0);
    if (!check) {
      setSelectedLang(newLang);
    } else {
      let langs = selectedLang.map((item) => {
        if (item.value === value) {
          item.status = 1;
        }
        return item;
      });
      setSelectedLang(langs);

      setAlerts(
        true,
        "warning",
        "Please choose at least one Language of ordering."
      );
    }
  };
  const changeDefault = (event, value) => {
    let newLang = selectedLang.map((item) => {
      if (item.value === value) {
        item.default = 1;
      } else {
        item.default = 0;
      }
      return item;
    });
    setSelectedLang(newLang);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{t("languages_localisation")}</h3>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label> {t("languages")}</label>
          <MySelect
            options={lang.map((o) => {
              return {
                value: o.id,
                label: o.Language_name,
                default: 0,
                status: 1,
              };
            })}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option, MultiValue, animatedComponents }}
            onChange={handleSelectEvent}
            allowSelectAll={true}
            value={selectedLang}
          />
        </div>
        <div className="row m-2">
          <div
            className="col-xl-4 col-lg-4 col-sm-4 font-weight-bold d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            {t("languages")}
          </div>
          <div
            className="col-xl-4 col-lg-4 col-sm-4 font-weight-bold d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            {t("default_language")}
          </div>
          <div
            className="col-xl-4 col-lg-4 col-sm-4 font-weight-bold d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            {t("status")}
          </div>
        </div>
        {selectedLang?.map((item, i) => {
          return (
            <div className="row m-2" key={i}>
              <div
                className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                {item.label}
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center">
                <Radio
                  checked={item.default === 1 ? true : false}
                  onChange={(e) => changeDefault(e, item.value)}
                  value={item.value}
                  name="radio-buttons"
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center">
                <Switch
                  checked={item.status === 1 ? true : false}
                  onChange={(e) => changeStatus(e, item.value)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Languages;
