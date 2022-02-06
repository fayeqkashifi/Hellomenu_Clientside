import React, { useState } from "react";

import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { base_url, port } from "../../../../../Consts";
import Typography from "@mui/material/Typography";
import DefaultPic from "../../../../../images/hellomenu/category.svg";
import {
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
const SideBar = (props) => {
  const { categories, activeCategory, setProducts, setActiveCategory } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filterProducts = (menu) => {
    if (menu.sub_category_id === null) {
      setActiveCategory(menu.CategoryName + "-" + menu.category_id);
      getProductBasedOnCategory(menu.category_id).then((data) => {
        setProducts(data);
      });
    } else {
      setActiveCategory(menu.SubCategoryName + "-" + menu.sub_category_id);
      getProductBasedOnSubCategory(menu.sub_category_id).then((res) => {
        setProducts(res);
      });
    }
  };
  return (
    // <Card>
    <Box
      sx={{
        flexGrow: 1,
        // zIndex: 9999,
        // top: "0px",
        // left: "0px",

        // positions: "absolute",
        // marginLeft:"1000"
        //   bgcolor: "background.paper",
        display: "flex",
        // width: "10%",
        height: "100%",
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="Vertical tabs example"
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 1 },
            // borderRight: "red solid 2px",
            // backgroundSize: 100,
          },
        }}
      >
        {categories?.map((section, i) => (
          <Tab
            key={i}
            onClick={() => filterProducts(section)}
            style={
              activeCategory ===
              (section.sub_category_id === null
                ? section.CategoryName + "-" + section.category_id
                : section.SubCategoryName + "-" + section.sub_category_id)
                ? {
                    background: "#33cd6b",
                    borderRadius: "10px",
                    padding: "15px",
                    maring: "20px",
                  }
                : {
                    borderRadius: "10px",
                    padding: "15px",
                    maring: "20px",
                  }
            }
            icon={
              <img
                style={{
                  height: "50px",
                  width: "50px",
                  objectFit: "contain",
                  margin: "5px",
                }}
                src={
                  section.CategoryIcon !== null
                    ? `http://${base_url}:${port}/images/catagories/${section.CategoryIcon}`
                    : section.CategoryIcon !== null
                    ? `http://${base_url}:${port}/images/sub_catagories/${section.SubCategoryIcon}`
                    : DefaultPic
                }
              />
            }
            label={
              <Typography
                style={
                  activeCategory ===
                  (section.sub_category_id === null
                    ? section.CategoryName + "-" + section.category_id
                    : section.SubCategoryName + "-" + section.sub_category_id)
                    ? {
                        color: "white",
                        fontSize: 14,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }
                    : {
                        color: "black",
                        fontSize: 14,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }
                }
              >
                {section.SubCategoryName === null
                  ? section.CategoryName
                  : section.SubCategoryName}
              </Typography>
            }
          />
        ))}
      </Tabs>
    </Box>
    // </Card>
  );
};
export default SideBar;
