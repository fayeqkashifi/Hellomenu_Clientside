export const DarkStyle = (custom) => {
  return {
    // Main public
    template: "dark",
    // darkMain file style
    background: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
      minHeight: "100vh",
    },
    varaintContainer: { paddingBottom: "100px" },
    // Header file style
    backIcon: {
      color: "#fff",
    },
    title: { visibility: "hidden" },
    searchFields: {
      visibility: "hidden",
    },
    inputfield: {
      width: "100%",
      height: "35px",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#ff751d",
    },
    BadgeStyle: {
      "& .MuiBadge-badge": {
        color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#f27d1e",
      },
    },
    cartIcon: {
      color: "#fff",
    },
    headerTotalDiv: {
      display: "none",
    },
    headertoolbar: {
      overflowX: "auto",
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
    // end Header

    // statusbar style
    headerVideos: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#ff751d",
      cursor: "pointer",
    },
    branchStory: {
      width: "150px",
      height: "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#ff751d",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    productStory: {
      width: "150px",
      height: "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : "#fff",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    imageVideo: {
      height: "70px",
      width: "50px",
      objectFit: "contain",
      borderRadius: "5px",
      border: "1px solid",
      borderColor: custom?.menusAcriveColor ? custom.menusAcriveColor : "#aaa",
      margin: "3px",
    },
    // statusbar End

    // vidoeDetails
    reactPlayerStyle: {
      borderRadius: "10px",
      border: "2px solid",
      borderColor: "#fff",
      margin: "3px",
      padding: "2px",
      lineBreak: "anywhere",
      overflow: "hidden",
    },

    // Show Card Style
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
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
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
      borderRadius: "15px",
      objectFit: "contain",
    },

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
    unitName: {
      display: "none",
    },
    addIcon: {
      width: "40%",
    },
    // end Show Card Style

    // ReCounter Style
    counterDecrementIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },
    counterValue: {
      color: "#fff",
    },
    // End

    // product dtails Style
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
    preparation_time: custom?.preparation_time,
    show_ingredients: custom?.show_ingredients,
    ingredientsActive: {
      cursor: "pointer",
      display: "inline-block",
      padding: "3px",
      margin: "2px",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "5px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#f27d1e",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    ingredientsDeActive: {
      display: "inline-block",
      cursor: "pointer",
      padding: "3px",
      margin: "2px",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "5px",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    show_extras: custom?.show_extras,
    show_variants: custom?.show_variants,
    variantsDiv: {
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
      borderRadius: "50px",
      padding: "5px",
    },
    variantActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "black",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "black",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    variantDeActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: "#22252a",
      backgroundColor: "#22252a",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    checkbox: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#ff751d",
    },
    variantsImage: {
      height: "400px",
      width: "100%",
      borderRadius: "5%",
      objectFit: "contain",
    },
    recomandImage: {
      height: "200px",
      width: "100%",
      borderRadius: "15px",

      objectFit: "contain",
    },

    // Image Slider Style
    imageSilderMainDiv: { minHeight: "60vh", position: "sticky" },
    mainSwiper: {
      minHeight: "55vh",
      margin: "10px",
      padding: "10px",
    },
    swiperMainImage: {
      height: "400px",
      width: "100%",
      borderRadius: "10px",
      // objectFit: "contain",
    },
    ThumbsSwiper: { minHeight: "5vh", cursor: "pointer", margin: "10px" },
    thumbsImage: {
      height: "60px",
      width: "40px",
      textAlign: "center",
      borderRadius: "10px",
      ":hover": {
        border: "1px solid",
        borderColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#ff751d",
      },
    },
    // End

    // footer
    buttonStyle: {
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : "#ff751d",
      color: custom?.footerStyle ? custom.button_text_color : "#f1fcfe",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1rem",
    },
    footerStyle: {
      bgcolor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
      zIndex: 999999,
    },
    // End

    // Drawer Style
    categories: {
      fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },

    cardHeader: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
      borderColor: custom?.cardBgColor ? custom.cardBgColor : "#2d3134",
    },
    cardBody: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#22252a",
    },
    // End
    
    // Counter Style
    divCounter: { marginTop: "-5px", marginRight: "15px", textAlign: "center" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
    },
    // End

    // cart
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
    cartImageDiv: {
      width: "20%",
    },
    cartProductDiv: {
      width: "30%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
    cartVariantDiv: {
      width: "35%",
    },
    cartCounterDiv: {
      width: "15%",
    },
    cartNoteDiv: {
      width: "50%",
    },
    cartTotalDiv: {
      width: "50%",
      textAlign: "right",
    },
    clearIcon: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#f27d1e",
    },
    cartImage: {
      height: "100px",
      width: "100%",
      borderRadius: "15px",
      objectFit: "contain",
    },
    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1rem",
      color: custom?.product_name_color ? custom.product_name_color : "#fff",
    },
    // End
  };
};
