export const SecondStyle = (custom) => {
  return {
    template: "second",
    background: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#eee",
    },
    cardStyle: {
      width: "300px",
      margin: "20px",
      display: "flex",
      flexDirection: "column",
    },
    favIconDeactive: {
      display: "none",
    },
    favIconActive: {
      display: "none",
    },
    imageStyle: {
      height: "250px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    productName: {
      textTransform: "capitalize",
      textAlign: "center",
      fontSize: "25px",
    },
    productDiv: { width: "100%", textAlign: "center" },
    addIcon: {
      width: "100%",
    },
    price: {
      textAlign: "center",
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.5rem",
      color: custom?.price_color ? custom.price_color : "#aa3f32",
      fontWeight: "bold",
    },
    description: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : "#000",
    },

    BadgeStyle: {
      "& .MuiBadge-badge": {
        color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#33cd6b",
      },
    },
    cartIcon: {
      color: "#000",
    },
    searchIcon: {
      color: "#000",
    },
    title: {
      marginLeft: 200,
      paddingBottom: "2px",
      marginBottom: "10px",
      borderBottomStyle: "solid",
      borderottomWidth: "3.1px",
      width: "fit-content",
      borderColor: "#33cd6b",
      color: "#000",
      fontSize: "3rem",
      fontWeight: "bold",
    },
    backIcon: { visibility: "hidden" },
    divCounter: { marginTop: "0px", textAlign: "center", display: "grid" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#33cd6b",
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
      color: "#33cd6b",
    },
    sidebarCard: {
      position: "fixed",
      top: 0,
      bottom: 0,
      marginLeft: "10%",
      marginTop: "5%",
      marginBottom: "5%",
      zIndex: 1,
      borderRadius: "30px",
    },
    sidebarMainDiv: {
      position: "relative",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
    },
    // footer
    footerStyle: {
      bgcolor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
    },
    // cart
    // cartMainDiv: {
    //   textAlign: "right",
    //   backgroundColor: "red",

    // },
    inputfield: {
      width: "100%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#33cd6b",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
    },
    buttonStyle: {
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : "#33cd6b",
      color: custom?.button_text_color ? custom.button_text_color : "#fff",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "0.75rem",
    },
    active: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: "#33cd6b",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#33cd6b",
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
        : "#33cd6b",
      backgroundColor: "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: "0.25rem",
    },

    ordersText: {
      display: "none",
    },
    orderingOptions: 6,
    clearIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f00",
    },
    cartImage: {
      height: "100px",
      width: "100%",
      borderRadius: "15%",
      objectFit: "contain",
    },
    cartMainDiv: {
      // display: "flex",
      // flexDirection: "column",
      // flexWrap: "wrap",
    },
    cartImageDiv: {
      display: "none",
    },
    cartProductDiv: {
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
    cartVariantDiv: {
      width: "100%",
    },
    cartCounterDiv: {
      width: "200px",
      height: "200px",
    },
    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "0.75rem",
      color: custom?.product_name_color ? custom.product_name_color : "#000",
    },
    // productDiv: { width: "60%", textAlign: "left" },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1rem",
      color: custom?.price_color ? custom.price_color : "#aa3f32",
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
        : "#33cd6b",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#33cd6b",
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
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#33cd6b",
      borderRadius: "50px",
      padding: "5px",
    },
    variantActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "#aa3f32",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#aa3f32",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    variantDeActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "#33cd6b",
      backgroundColor: "#33cd6b",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    checkbox: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#33cd6b",
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
  };
};
