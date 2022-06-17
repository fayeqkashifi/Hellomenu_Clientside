import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { base_url, port } from "../../../../../../Consts";
import Typography from "@mui/material/Typography";
import DefaultPic from "../../../../../../images/hellomenu/category.svg";
import {
  getProductsBasedOnBranchId,
  getProductBasedOnCategory,
  getProductBasedOnSubCategory,
} from "../../Functionality";
import AllOutIcon from "@mui/icons-material/AllOut";
import { TemplateContext } from "../../TemplateContext";
import axios from "axios";

const SideBar = () => {
  const {
    style,
    categories,
    activeCategory,
    setProducts,
    setActiveCategory,
    selectedLang,
    locale,
    branch,
  } = useContext(TemplateContext);

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filterProducts = (menu) => {
    if (menu !== "All") {
      if (menu.sub_category_id === null) {
        getProductBasedOnCategory(
          menu.category_id,
          1,
          selectedLang.id,
          source
        ).then((data) => {
          if (data !== undefined) {
            setProducts(data.data);
            // setChangeState(true);
            // setLastPage(data.last_page);
            // setPage(2);
            setActiveCategory(
              menu.CategoryName + "~~~cate~~~" + menu.category_id
            );
          }
        });
      } else {
        getProductBasedOnSubCategory(
          menu.sub_category_id,
          1,
          selectedLang.id,
          source
        ).then((res) => {
          if (res !== undefined) {
            setProducts(res.data);
            setActiveCategory(
              menu.SubCategoryName + "~~~sub~~~" + menu.sub_category_id
            );
            // setChangeState(true);
            // setLastPage(res.last_page);
            // setPage(2);
          }
        });
      }
    } else {
      getProductsBasedOnBranchId(branch.id, 1, selectedLang.id, source).then(
        (data) => {
          if (data !== undefined) {
            setProducts(data.data);
            // setChangeState(true);
            // setLastPage(data.last_page);
            // setPage(2);
            setActiveCategory("All~~~1");
          }
        }
      );
    }
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <Box sx={style?.sideBarBox}>
      <Tabs
        orientation={style?.sidebarPosition}
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="menu"
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 1 },
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
              {locale?.all}
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
