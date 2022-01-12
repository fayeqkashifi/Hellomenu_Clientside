import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Select from "react-select";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";

const FilterSelection = () => {
  const [areaLocation, setAreaLocation] = useState([]);
  const [branches, setBranches] = useState([]);
  const history = useHistory();
  const { t } = useTranslation();

  // useEffect(() => {
  //   axios.get(`/api/GetAreas`).then((res) => {
  //     if (res.data.status === 200) {
  //       setAreaLocation(res.data.fetchData);
  //       // console.log(res.data.fetchData);
  //     }
  //   });
  // }, []);

  const handleSelect = (e) => {
    axios.get(`/api/getServiceArea/${e.value}`).then((res) => {
      if (res.data.status === 200) {
        setBranches(res.data.fetchData);
        // history.push(`/dark-template/${btoa(res.data.fetchData[0]?.BranchID)}`);
      }
    });
  };

  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = (value) => {
    setValue("");
    setValue(value);
  };

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
    axios.get(`/api/GetAreas/${value.id}`).then((res) => {
      if (res.data.status === 200) {
        setAreaLocation(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
    });
  };
  const loadOptions = (inputValue) => {
    return axios
      .get(`/api/GetCities`, {
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id: inputValue,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Backdrop sx={{ color: "#22252a" }} open={true}>
        <div style={{ width: "50%" }}>
          <p>Please Select You Area!</p>
          <div className="form-group">
            <label>
              <strong>{t("city")}</strong>
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              value={selectedValue}
              getOptionLabel={(e) => e.cityName}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <strong>{t("location")}</strong>
            </label>
            <Select
              options={areaLocation.map((o, i) => {
                return { value: o.id, label: o.areaName };
              })}
              onChange={handleSelect}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            {branches?.map((branch) => {
              return (
                <p key={branch.BranchID} style={{ color: "#fff" }}>
                  <Link to={`/dark-template/${btoa(branch?.BranchID)}`}>
                    <strong style={{ color: "#fff" }}>
                      {" "}
                      {branch.BrancheName}
                    </strong>
                  </Link>
                </p>
              );
            })}
          </div>
        </div>
      </Backdrop>
    </div>
  );
};
export default FilterSelection;
