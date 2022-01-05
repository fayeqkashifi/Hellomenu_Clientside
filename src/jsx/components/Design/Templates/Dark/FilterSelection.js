import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Select from "react-select";
import axios from "axios";
import { useHistory } from "react-router-dom";

const FilterSelection = () => {
  const [areaLocation, setAreaLocation] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get(`/api/GetAreas`).then((res) => {
      if (res.data.status === 200) {
        setAreaLocation(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
    });
  }, []);
  const handleSelect = (e) => {
    axios.get(`/api/getServiceArea/${e.value}`).then((res) => {
      if (res.data.status === 200) {
        history.push(`/dark-template/${btoa(res.data.fetchData[0]?.BranchID)}`);
      }
    });
  };
  return (
    <div>
      <Backdrop sx={{ color: "#22252a" }} open={true}>
        <div style={{ width: "50%" }}>
          <p>Please Select You Area!</p>
          <div>
            <Select
              options={areaLocation.map((o, i) => {
                return { value: o.id, label: o.areaName };
              })}
              onChange={handleSelect}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>
      </Backdrop>
    </div>
  );
};
export default FilterSelection;
