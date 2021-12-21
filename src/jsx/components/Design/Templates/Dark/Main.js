import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { base_url, port } from "../../../../../Consts";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
var hold = 1;
export default function Main(props) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const branchId = atob(props.match.params.id);
  const [branch, setBranch] = useState([]);
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
    axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setSubCategories(res.data.fetchData);
        setActiveSubCategory(res.data.fetchData[0]?.sub_id);
        axios
          .get(
            `/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0]?.sub_id}`
          )
          .then((res) => {
            if (res.data.status === 200) {
              setProducts(res.data.data);
              // console.log(res.data.data);
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
      mode: "dark",
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
          : "#fff",
      },
      // price
      body1: {
        fontSize: themeCustomization?.price_font_size
          ? themeCustomization.price_font_size
          : 16,
        color: themeCustomization?.price_color
          ? themeCustomization.price_color
          : "#fff",
      },
      // product Names
      button: {
        fontSize: themeCustomization?.product_name_font_size
          ? themeCustomization.product_name_font_size
          : 14,
        color: themeCustomization?.product_name_color
          ? themeCustomization.product_name_color
          : "#fff",
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
          : "#fff",
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
        <Grid item xs={6} sm={4} md={3} key={i}>
          <Card
            sx={{
              // height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "5%",
              backgroundColor: "#2d3134",
            }}
          >
            <div className="px-2 pt-2">
              <FavoriteBorderIcon />
              {/* <FavoriteIcon sx={{ color: "#ff751d" }} /> */}
            </div>

            <Link
              to={{
                pathname: `/dark-template/product/${btoa(item.id)}`,
                // state: { themeCustomization: themeCustomization },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <div className="text-center">
                  <img
                    style={{
                      height: "150px",
                      width: "100%",
                      borderRadius: "15%",
                      // objectFit: "contain",
                    }}
                    src={`http://${base_url}:${port}/images/products/${item.image}`}
                    alt="Image"
                  />
                </div>
                <div className="mt-2">
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography
                        variant="button"
                        style={{ textTransform: "capitalize" }}
                        // className="font-weight-bold"
                      >
                        {item.ProductName}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <AddIcon sx={{ color: "#fff" }} />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="body1"
                    gutterBottom
                    className="font-weight-bold"
                  >
                    {getSymbolFromCurrency(item.currency_code) +
                      "  " +
                      item.price}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.Description}
                  </Typography>
                </div>
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

        <Container className="mt-3 d-flex justify-content-center">
          <Grid container spacing={2} className="d-flex justify-content-center">
            {viewShow_HTMLTABLE}
          </Grid>
        </Container>
        <InfiniteScroll
          dataLength={products.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={changeState}
          loader={
            <p className="text-center pt-5">
              <b>{t("loading")}</b>
            </p>
          }
          endMessage={
            <p style={{ textAlign: "center " }}>
              <b>{t("yay_you_have_seen_it_all")}</b>
            </p>
          }
        ></InfiniteScroll>
      </Container>
      <Footer title="Checkout Order" />
    </ThemeProvider>
  );
}
