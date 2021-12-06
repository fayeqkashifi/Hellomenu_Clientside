import  React, {useState  } from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Header(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);

  const { title, setMode, mode,categories ,subcategories , setSubCategories, activeSubCategory} = props;
  const handleChange = () => {
    mode === "dark" ? setMode("light") : setMode("dark");
  };
  const filterCategory = (cateId) => {
    axios.get(`/api/GetSubCategories/${cateId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
      }
    });
    setActiveCategory(cateId);
  };
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" ,position:"sticky"}}  className="top-0 ">
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Typography
          component="h2"
          variant="h6"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <ShoppingBasketOutlinedIcon />
        </IconButton>
        <IconButton sx={{ ml: 1 }} onClick={handleChange} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
      {categories===0 ? ' ' :
      <div>
      <Typography variant="overline" display="block" gutterBottom>
        {t('public_categories')}:
      </Typography>
      <Toolbar
        component="nav"
        variant="dense"
        className="border"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {categories?.map((section,i) => (
          <Link
            color={activeCategory === section.id ? "#f27d1e" : " "}
            noWrap
            key={i}
            underline="hover"
            variant="body2"
            // className="active"
            onClick={() => filterCategory(section.id)}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.CategoryName }
          </Link>
        ))}
      </Toolbar>
      </div>
      }
      {subcategories===0 ? ' ' :
      <div>
          <Typography variant="overline" display="block" gutterBottom>
          {t('sub_categories')}: 
        </Typography>
        <Toolbar
          component="nav"
          variant="dense"
          className="border mb-2"

          sx={{ justifyContent: "space-between", overflowX: "auto" }}
        >
          {subcategories?.map((section,i) => (
            <Link
              color={activeSubCategory === section.sub_id ? "#f27d1e" : " "}
              noWrap
              key={i}
              underline="hover"
              variant="body2"
              sx={{ p: 1, flexShrink: 0 }}
            >
              {section.SubCategoryName }
            </Link>
          ))}
        </Toolbar>
      </div>
      }
    </React.Fragment>
  );
}

export default Header;
