export const DarkStyle = (custom) => {
  return {
    template: "dark",
    background: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
    },
    headertoolbar: {
      // justifyContent: "space-between",
      overflowX: "auto",
      // marginTop: "-15px",
    },
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "5%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
    },
    favIconDeactive: {
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    favIconActive: {
      color: custom?.menusActiveColor ? custom.menusActiveColor : "#ff751d",
    },
    imageStyle: {
      height: "150px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    xs: custom?.numberProductInRowMobile
      ? custom.numberProductInRowMobile === 1
        ? 12
        : custom.numberProductInRowMobile === 2
        ? 6
        : custom.numberProductInRowMobile === 3
        ? 4
        : custom.numberProductInRowMobile === 4 ||
          custom.numberProductInRowMobile === 5
        ? 3
        : custom.numberProductInRowMobile === 6
        ? 2
        : 6
      : 6,
    sm: custom?.numberProductInRowTablet
      ? custom.numberProductInRowTablet === 1
        ? 12
        : custom.numberProductInRowTablet === 2
        ? 6
        : custom.numberProductInRowTablet === 3
        ? 4
        : custom.numberProductInRowTablet === 4 ||
          custom.numberProductInRowTablet === 5
        ? 3
        : custom.numberProductInRowTablet === 6
        ? 2
        : 4
      : 4,
    md: custom?.numberProductInRowComputer
      ? custom.numberProductInRowComputer === 1
        ? 12
        : custom.numberProductInRowComputer === 2
        ? 6
        : custom.numberProductInRowComputer === 3
        ? 4
        : custom.numberProductInRowComputer === 4 ||
          custom.numberProductInRowComputer === 5
        ? 3
        : custom.numberProductInRowComputer === 6
        ? 2
        : 3
      : 3,
    productName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
      color: custom?.product_name_color ? custom.product_name_color : "#fff",
    },
    productDiv: { width: "60%", textAlign: "left" },
    price: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
      color: custom?.price_color ? custom.price_color : "#fff",
      fontWeight: "bold",
    },
    description: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : "#fff",
    },
    categories: {
      fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },

    BadgeStyle: {
      "& .MuiBadge-badge": {
        color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#f27d1e",
      },
    },
    cateActive: {
      cursor: "pointer",
      borderBottomStyle: "solid",
      borderottomWidth: "2px",
      width: "fit-content",
      marginRight: "10px",
      marginLeft: "10px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#f27d1e",

      color: "#f27d1e",
    },
    cateDeActive: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
      marginRight: "10px",
      marginLeft: "10px",
    },
    cardHeader: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
      borderColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
    },
    cardBody: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
    },
    cartIcon: {
      color: "#fff",
    },
    backIcon: {
      color: "#fff",
    },
    searchIcon: { visibility: "hidden" },
    title: { visibility: "hidden" },
    addIcon: {
      width: "40%",
    },
    divCounter: { marginTop: "-5px", marginRight: "15px", textAlign: "center" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
    },
    counterDecrementIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },
    counterValue: {
      color: "#fff",
    },
    // footer
    buttonStyle: {
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : "#ff751d",
      color: custom?.button_text_color ? custom.button_text_color : "#f1fcfe",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1rem",
    },
    footerStyle: {
      bgcolor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
    },
    // cart
    inputfield: {
      width: "100%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#ff751d",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
    },
    active: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: "black",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "black",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    deactive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#ff751d",
      backgroundColor: "#2d3134",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    clearIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },

    cartImage: {
      height: "100px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
      color: custom?.product_name_color ? custom.product_name_color : "#fff",
    },
    // productDiv: { width: "60%", textAlign: "left" },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
      color: custom?.price_color ? custom.price_color : "#fff",
      fontWeight: "bold",
    },
    cartDescription: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : "#fff",
    },
  };
};
