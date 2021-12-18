import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";

var hold = 1;
export default function Main(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const [branch, setBranch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(0);
  const [themeCustomization, setThemeCustomization] = useState([]);

  useEffect(() => {
    axios.get(`/api/GetTempBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setThemeCustomization(res.data.fetchData?.Customization);

        // console.log(res.data.fetchData[0].Customization);
      }
    });
    axios.get(`/api/GetBranchForShow/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setBranch(res.data.data);
      }
    });
    axios.get(`/api/GetCategories/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setCategories(res.data.fetchData);
      }
    });
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
        setActiveSubCategory(res.data.fetchData[0].sub_id);

        axios
          .get(
            `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_id}`
          )
          .then((res) => {
            if (res.data.status === 200) {
              setProducts(res.data.data);
            }
          });
        setLoading(false);
      }
    });
  }, []);
  const [changeState, setChangeState] = useState(true);
  const fetchMoreData = () => {
    if (hold < subcategories.length) {
      axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
        if (res.data.status === 200) {
          setActiveSubCategory(res.data.fetchData[hold].sub_id);
          // console.log(res.data.fetchData[hold].sub_id);

          axios
            .get(
              `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[hold].sub_id}`
            )
            .then((res) => {
              if (res.data.status === 200) {
                if (res.data.data.length === 0) {
                  hold = hold + 1;
                  // console.log(res.data.data);
                  fetchMoreData();
                } else {
                  hold = hold + 1;
                  setProducts(products.concat(res.data.data));
                }
              }
            });

          setSubCategories(res.data.fetchData);
        }
      });
    } else {
      setChangeState(false);
    }
    // console.log(hold);
  };
  // design start
  const theme = createTheme({
    palette: {
      warning: {
        // button background
        main: themeCustomization?.button_background_color
          ? themeCustomization.button_background_color
          : "#ff751d",
      },
    },
    typography: {
      fontFamily: themeCustomization?.font
        ? themeCustomization.font
        : "sans-serif",
      subtitle1: {
        fontSize: themeCustomization?.product_discription_font_size
          ? themeCustomization.product_discription_font_size
          : 10,
        color: themeCustomization?.product_discription_color
          ? themeCustomization.product_discription_color
          : "#777",
      },
      // price
      body1: {
        fontSize: themeCustomization?.price_font_size
          ? themeCustomization.price_font_size
          : 12,
        color: themeCustomization?.price_color
          ? themeCustomization.price_color
          : "#111",
      },
      // product Names
      button: {
        fontSize: themeCustomization?.product_name_font_size
          ? themeCustomization.product_name_font_size
          : 12,
        color: themeCustomization?.product_name_color
          ? themeCustomization.product_name_color
          : "#111",
      },
      // categories and sub categories
      overline: {
        fontSize: themeCustomization?.categories_and_sub_categoies_font_size
          ? themeCustomization.categories_and_sub_categoies_font_size
          : 12,
        color: themeCustomization?.categories_and_sub_categoies_color
          ? themeCustomization.categories_and_sub_categoies_color
          : "#ff751d",
      },
      // branch Name
      h6: {
        fontSize: themeCustomization?.branch_name_font_size
          ? themeCustomization.branch_name_font_size
          : 14,
        color: themeCustomization?.branch_name_color
          ? themeCustomization.branch_name_color
          : "#ff751d",
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            // button
            props: { variant: "contained" },
            style: {
              fontSize: themeCustomization?.button_text_font_size
                ? themeCustomization.button_text_font_size
                : 12,
              color: themeCustomization?.button_text_color
                ? themeCustomization.button_text_color
                : "#f1fcfe",
            },
          },
        ],
      },
    },
  });
  // design end

  var viewShow_HTMLTABLE = "";
  if (loading) {
    return (
      <div
        className="spinner-border text-primary "
        role="status"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewShow_HTMLTABLE = products?.map((item, i) => {
      return (
        <Grid
          item
          xs={
            themeCustomization?.number_of_products_in_each_row == 1
              ? 12
              : themeCustomization?.number_of_products_in_each_row == 2
              ? 6
              : themeCustomization?.number_of_products_in_each_row == 3
              ? 4
              : themeCustomization?.number_of_products_in_each_row == 4
              ? 3
              : themeCustomization?.number_of_products_in_each_row == 5
              ? 3
              : themeCustomization?.number_of_products_in_each_row == 6
              ? 2
              : 6
          }
          // sm={2} md={2}
          key={i}
        >
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: "100px", objectFit: "contain" }}
              image={`http://${base_url}:${port}/images/products/${item.image}`}
              alt="Image"
            />
            <Link
              to={{
                pathname: `/template-first/product/${btoa(item.id)}`,
                state: { themes: themeCustomization },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="button" display="block" gutterBottom>
                  {item.ProductName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {item.preparationTime}
                  {" Minutes"}
                </Typography>
                <Typography variant="button" gutterBottom>
                  {item.price + " " + getSymbolFromCurrency(item.currency_code)}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Grid>
      );
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          title={branch[0]?.BrancheName}
          subcategories={subcategories}
          activeSubCategory={activeSubCategory}
          setProducts={setProducts}
          setActiveSubCategory={setActiveSubCategory}
        />

        <main>
          <Grid container spacing={4} className="text-center">
            {viewShow_HTMLTABLE}
          </Grid>
        </main>
        <InfiniteScroll
          dataLength={products.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={changeState}
          loader={
            <Typography
              variant="subtitle1"
              gutterBottom
              className="text-center pt-5"
            >
              <b>{t("loading")}</b>
            </Typography>
          }
          endMessage={
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ textAlign: "center " }}
            >
              <b>{t("yay_you_have_seen_it_all")}</b>
            </Typography>
          }
        ></InfiniteScroll>
      </Container>
    </ThemeProvider>
  );
}
