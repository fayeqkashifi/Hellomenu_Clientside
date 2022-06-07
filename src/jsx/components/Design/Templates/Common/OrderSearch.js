import React, { useState, useEffect } from "react";
import "./TrackStyle.css";
import axios from "axios";

const OrderSearch = (props) => {
  const { setOrder } = props;
  const [value, setValue] = useState();

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const Search = () => {
    if (value != undefined) {
      console.log(value);
      axios.get(`/api/findOrder/${value}`).then((result) => {
        console.log(result);
        if (result.data.status === 200) {
          setOrder(result.data.fetchData);
          console.log(result.data.fetchData);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      });
    } else {
      console.log("test");
    }
  };

  return (
    <div className="py-5 text-center">
      <input onChange={onChange} value={value} />
      <button onClick={Search}>Search</button>
    </div>
  );
};

export default OrderSearch;
