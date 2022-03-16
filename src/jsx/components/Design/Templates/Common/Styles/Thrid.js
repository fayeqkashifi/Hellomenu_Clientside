export const ThridStyle = (custom) => {
  return {
    template: "thrid",
    background: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#f8f8f8",
      minHeight: "100vh",
    },
    // header
    title: {
      display: "none",
    },
    backIcon: { visibility: "hidden" },
    cartIcon: {
      color: "#000",
    },
    searchIcon: {
      display: "none",
    },
    searchFields: {
      marginLeft: "20px",
      marginRight: "20px",
    },
    headerTotalDiv: {
      marginLeft: "20px",
      marginRight: "20px",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontWeight: "bold",
      borderRadius: "10%",
    },
    totalPriceIcon: {
      backgroundColor: "#503e9d",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",

      margin: "5px",
    },
    totalPriceDiv: {
      marginRight: "20px",
    },
    // header End
    // card

    cardStyle: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "5%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
    },
    cardIconButton: {
      backgroundColor: "#fbd460",
      color: "#000",
    },
    favIconDeactive: {
      display: "none",
    },
    favIconActive: {
      display: "none",
    },
    shoppingIcon: {
      color: "#000",
    },
    imageStyle: {
      height: "150px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    productName: {
      textTransform: "capitalize",
      textAlign: "left",
      fontSize: "20px",
    },
    productDiv: { width: "100%", textAlign: "left" },
    addIcon: {
      width: "100%",
      textAlign: "center",
      borderRadius: "50px",
      border: "1px solid #aaa",
    },
    counterPosition: "last",
    description: {
      display: "none",
    },
    priceDiv: {
      textAlign: "right",
      margin: "10px",
    },
    price: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1rem",
      color: custom?.price_color ? custom.price_color : "#000",
      fontWeight: "bold",
    },
    BadgeStyle: {
      "& .MuiBadge-badge": {
        color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#fbd460",
      },
    },
    unitName: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "0.75rem",
      color: custom?.price_color ? custom.price_color : "#000",
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
    // counter
    divCounter: {},
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fbd460",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
    },
    counterDecrementIcon: {
      color: "#000",
    },
    counterIncrementIcon: {
      color: "#000",
    },
    counterValue: {
      color: "#000",
    },
    // sideBar
    sidebarPosition: "horizontal",
    sideBarBox: {
      flexGrow: 1,
      // display: "flex",
      width: "100%",
      // height: "100%",
    },
    sidebarActive: {
      background: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
      borderRadius: "40px",
      padding: "20px",
      maring: "40px",
    },
    sidebarDeActive: {
      borderRadius: "40px",
      padding: "20px",
      maring: "40px",
    },
    icon: {
      height: "50px",
      width: "50px",
      objectFit: "contain",
      margin: "5px",
    },
    textActive: {
      color: "#000",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    textDeactive: {
      color: "#000",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    // General
    inputfield: {
      width: "100%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
    },
    card: {
      display: "grid",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
    },
    buttonStyle: {
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : "#fbd460",
      color: custom?.button_text_color ? custom.button_text_color : "#fff",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "0.75rem",
    },
    active: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: "#fbd460",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
      fontSize: "0.5rem",
    },
    deactive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
      backgroundColor: "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: "0.25rem",
    },

    ordersText: {
      display: "none",
    },
    orderingOptions: 6,
    clearIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "rgb(223, 71, 89)",
    },
    cartImage: {
      height: "100px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    // cartMainDiv: {
    // display: "flex",
    // flexDirection: "column",
    // flexWrap: "wrap",
    // },
    cartImageDiv: {
      width: "100%",
    },
    cartProductDiv: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
    cartVariantDiv: {
      width: "100%",
    },
    cartCounterDiv: {
      width: "100%",
    },
    cartNoteDiv: {
      width: "100%",
    },
    cartTotalDiv: {
      width: "100%",
      textAlign: "right",
    },
    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "0.75rem",
      color: custom?.product_name_color ? custom.product_name_color : "#000",
    },
    // productDiv: { width: "60%", textAlign: "left" },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1rem",
      color: custom?.price_color ? custom.price_color : "#000",
      fontWeight: "bold",
    },
    cartDescription: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : "#000",
    },
    // product details
    detailsCard: {
      // height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "5%",
      backgroundColor: custom?.BgColor ? custom.BgColor : "#fff",
    },
    preparation_time: custom?.preparation_time,
    show_ingredients: custom?.show_ingredients,
    ingredientsActive: {
      cursor: "pointer",

      padding: "3px",
      margin: "2px",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "5px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#fbd460",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    ingredientsDeActive: {
      cursor: "pointer",
      padding: "3px",
      margin: "2px",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "5px",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : "#000",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    show_extras: custom?.show_extras,
    show_variants: custom?.show_variants,
    variantsDiv: {
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#503e9d",
      borderRadius: "50px",
      padding: "5px",
    },
    variantActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "#fbd460",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#fbd460",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    variantDeActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "#503e9d",
      backgroundColor: "#503e9d",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    checkbox: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#fbd460",
    },
    variantsImage: {
      height: "400px",
      width: "100%",
      borderRadius: "5%",
      objectFit: "contain",
    },
    variantsThumbs: {
      height: "70px",
      width: "100%",
      borderRadius: "5%",
      // objectFit: "contain",
    },
    varaintContainer: { paddingBottom: "100px" },
    recomandImage: {
      height: "200px",
      width: "100%",
      borderRadius: "5%",

      objectFit: "contain",
    },
    // footer
    footerStyle: {
      bgcolor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
    },
  };
};
