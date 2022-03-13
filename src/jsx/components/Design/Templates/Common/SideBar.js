import React, { useState } from "react";

import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { base_url, port } from "../../../../../Consts";
import Typography from "@mui/material/Typography";
import DefaultPic from "../../../../../images/hellomenu/category.svg";
import {
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../Functionality";
import AllOutIcon from "@mui/icons-material/AllOut";
const SideBar = (props) => {
  const {
    style,
    categories,
    activeCategory,
    setProducts,
    setActiveCategory,
    branchId,
  } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filterProducts = (menu) => {
    if (menu !== "All") {
      if (menu.sub_category_id === null) {
        getProductBasedOnCategory(menu.category_id, 1).then((data) => {
          setProducts(data.data);
          // setChangeState(true);
          // setLastPage(data.last_page);
          // setPage(2);
          setActiveCategory(
            menu.CategoryName + "~~~cate~~~" + menu.category_id
          );
        });
      } else {
        getProductBasedOnSubCategory(menu.sub_category_id, 1).then((res) => {
          setProducts(res.data);
          setActiveCategory(
            menu.SubCategoryName + "~~~sub~~~" + menu.sub_category_id
          );
          // setChangeState(true);
          // setLastPage(res.last_page);
          // setPage(2);
        });
      }
    } else {
      getProductsBasedOnBranchId(branchId, 1).then((data) => {
        setProducts(data.data);
        // setChangeState(true);
        // setLastPage(data.last_page);
        // setPage(2);
        setActiveCategory("All~~~1");
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
        <Tab
          style={
            activeCategory === "All~~~1"
              ? style?.sidebarActive
              : style?.sidebarDeActive
          }
          sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
          onClick={() => filterProducts("All")}
          icon={
            <AllOutIcon
              style={style?.icon}
              sx={
                activeCategory === "All~~~1"
                  ? style?.textActive
                  : style?.textDeactive
              }
            />
          }
          label={
            <Typography
              style={
                activeCategory === "All~~~1"
                  ? style?.textActive
                  : style?.textDeactive
              }
            >
              All
            </Typography>
          }
        ></Tab>
        {categories?.map((section, i) => (
          <Tab
            key={i}
            onClick={() => filterProducts(section)}
            style={
              activeCategory ===
              (section.sub_category_id === null
                ? section.CategoryName + "~~~cate~~~" + section.category_id
                : section.SubCategoryName +
                  "~~~sub~~~" +
                  section.sub_category_id)
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
                    ? section.CategoryName + "~~~" + section.category_id
                    : section.SubCategoryName + "~~~" + section.sub_category_id)
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
