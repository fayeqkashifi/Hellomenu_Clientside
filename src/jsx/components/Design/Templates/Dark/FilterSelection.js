import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Select from "react-select";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import QRCode from "qrcode.react";
import { base_url, port } from "../../../../../Consts";

const FilterSelection = () => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   axios.get(`/api/GetAreas`).then((res) => {
  //     if (res.data.status === 200) {
  //       setAreaLocation(res.data.fetchData);
  //       // console.log(res.data.fetchData);
  //     }
  //   });
  // }, []);
  const [branches, setBranches] = useState(
    localStorage.getItem("branches")
      ? JSON.parse(localStorage.getItem("branches"))
      : []
  );
  const handleSelect = (e) => {
    axios.get(`/api/getServiceArea/${e.value}`).then((res) => {
      if (res.data.status === 200) {
        setBranches(res.data.fetchData);
        localStorage.setItem("branches", JSON.stringify(res.data.fetchData));
      }
    });
    localStorage.setItem("defaultLocation", JSON.stringify(e));
  };
  const defaulValue = localStorage.getItem("defaultLocation")
    ? JSON.parse(localStorage.getItem("defaultLocation"))
    : null;

  const [selectedValue, setSelectedValue] = useState(
    localStorage.getItem("city")
      ? JSON.parse(localStorage.getItem("city"))
      : null
  );
  const [areaLocation, setAreaLocation] = useState(
    localStorage.getItem("location")
      ? JSON.parse(localStorage.getItem("location"))
      : []
  );

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
    axios.get(`/api/GetAreas/${value.id}`).then((res) => {
      if (res.data.status === 200) {
        setAreaLocation(res.data.fetchData);
        // console.log(res.data.fetchData);
        localStorage.setItem("location", JSON.stringify(res.data.fetchData));
      }
    });
    localStorage.setItem("city", JSON.stringify(value));
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
      <Backdrop open={true}>
        <div style={{ width: "90%", height: "90%" }}>
          <Grid container spacing={2} style={{ height: "100%" }}>
            <Grid item xs={12} lg={4} xl={4} sm={6} md={6}>
              <Card className="m-1" style={{ height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
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
                      defaultValue={defaulValue}
                      onChange={handleSelect}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={8} xl={8} sm={6} md={6}>
              <Card className="m-1" style={{ height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} style={{ height: "100%" }}>
                    {branches?.map((branch) => {
                      return (
                        <Grid
                          item
                          xs={6}
                          lg={3}
                          xl={3}
                          sm={12}
                          md={6}
                          key={branch?.BranchID}
                        >
                          <Card className="m-1 text-center">
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Link
                                to={{
                                  pathname: `/dark-template/${btoa(
                                    branch?.BranchID
                                  )}`,
                                  state: {
                                    deliveryFees: branch.deliveryFees,
                                  },
                                }}
                              >
                                <QRCode
                                  // id={btoa(item.id)}
                                  level={"H"}
                                  size={120}
                                  fgColor="#f50b65"
                                  value={`http://${base_url}:${port}/dark-template/${btoa(
                                    branch.BranchID
                                  )}`}
                                  className="primary"
                                />
                                <p>
                                  {" "}
                                  <strong> {branch.BrancheName}</strong>
                                </p>
                              </Link>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Backdrop>
    </div>
  );
};
export default FilterSelection;
