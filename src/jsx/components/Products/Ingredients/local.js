import React, { useEffect } from "react";
import axios from "axios";
const IngredientLocale = (props) => {
  const { url, langs, setLangs } = props;

  useEffect(() => {
    try {
      axios.get(url).then((result) => {
        if (result.data.status === 200) {
          setLangs(result.data.fetchData);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onChange = (e, value) => {
    let newLang = langs.map((item) => {
      if (item.value === value) {
        item[e.target.name] = e.target.value;
      }
      return item;
    });
    setLangs(newLang);
  };
  return (
    <div>
      {langs?.map((item, i) => {
        return (
          <div className="row m-1" key={i}>
            <div
              className="col-xl-4 col-lg-4 col-sm-4 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              {item.label}
            </div>
            <div className="col-xl-8 col-lg-8 col-sm-8 d-flex align-items-center justify-content-center">
              <input
                type="text"
                className="form-control"
                name="translated"
                placeholder="Name..."
                value={item.translated ? item.translated : ""}
                onChange={(e) => onChange(e, item.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default IngredientLocale;
