import React, { Fragment, useState, useEffect } from "react";
import MySelect from "../Common/MySelect";

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    axios
      .get("/api/getLanguages")
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="col-xl-12 col-lg-12 col-sm-12 ">
      <MySelect
        options={languages.map((o) => {
          return { value: o.id, label: o.Language_name };
        })}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MultiValue, animatedComponents }}
        onChange={handleSelectEvent}
        allowSelectAll={true}
        // value={languages}
      />
    </div>
  );
};

export default Languages;
