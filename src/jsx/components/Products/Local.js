import React, { useEffect } from "react";
import axios from "axios";

const Local = (props) => {
  const { url, inputData, UnitName, changeBit, setLang, lang } = props;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        if (changeBit) {
          let newLang = res.data.fetchData.map((item) => {
            item.translated = "";
            item.unit = "";
            return item;
          });

          setLang(newLang);
        } else {
          setLang(res.data.fetchData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      setLang([]);
    };
  }, []);
  const onChange = (e, value) => {
    let newLang = lang.map((item) => {
      if (item.value === value) {
        item[e.target.name] = e.target.value;
      }
      return item;
    });
    setLang(newLang);
  };
  return (
    <div>
      {lang?.map((item, i) => {
        return (
          <div className="row m-1" key={i}>
            <div
              className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              {item.label}
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center">
              <input
                type="text"
                className="form-control"
                name="translated"
                placeholder="Translate Product Name..."
                disabled={item.default === 1 ? true : false}
                value={item.default === 1 ? inputData : item.translated}
                onChange={(e) => onChange(e, item.value)}
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center">
              <input
                type="text"
                className="form-control"
                name="unit"
                placeholder="Translate Unit Name..."
                disabled={item.default === 1 ? true : false}
                value={item.default === 1 ? UnitName : item.unit}
                onChange={(e) => onChange(e, item.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Local;
