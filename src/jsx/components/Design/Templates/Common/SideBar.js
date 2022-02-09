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
  const { style, categories, activeCategory, setProducts, setActiveCategory } =
    props;
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
    <Box sx={style?.sideBarBox}>
      <Tabs
        orientation={style?.sidebarPosition}
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
                ? style?.sidebarActive
                : style?.sidebarDeActive
            }
            icon={
              <img
                style={style?.icon}
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
                    ? style?.textActive
                    : style?.textDeactive
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
  );
};
export default SideBar;
