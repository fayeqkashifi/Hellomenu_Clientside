export const SecondStyle = (custom) => {
  return {
    // main public
    template: "second",
    // second main
    background: {
      backgroundColor: custom?.bgColor ? custom.bgColor : "#eee",
      minHeight: "100vh",
    },

    // header file style
    inputfield: {
      width: "50%",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#000",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#33cd6b",
    },
    cartIcon: {
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
    searchFields: {
      visibility: "hidden",
    },
    headerTotalDiv: {
      display: "none",
    },
    backIcon: { visibility: "hidden" },
    BadgeStyle: {
      "& .MuiBadge-badge": {
        color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : "#33cd6b",
      },
    },
    // Header End

    // statusbar Style
    headerVideos: {
      color: custom?.menusAcriveColor ? custom.menusAcriveColor : "#33cd6b",
      cursor: "pointer",
    },
    branchStory: {
      width: "150px",
      height: "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : "#33cd6b",
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

    // vidoe Details
    reactPlayerStyle: {
      borderRadius: "10px",
      border: "2px solid",
      borderColor: "#fff",
      margin: "3px",
      padding: "2px",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    // end

    // sideBar
    sidebarPosition: "vertical",
    sideBarBox: {
      flexGrow: 1,
      display: "flex",
      // width: "10%",
      height: "100%",
    },
    sidebarActive: {
      background: "#33cd6b",
      borderRadius: "10px",
      padding: "15px",
      maring: "20px",
    },
    sidebarDeActive: {
      borderRadius: "10px",
      padding: "15px",
      maring: "20px",
    },
    icon: {
      height: "50px",
      width: "50px",
      objectFit: "contain",
      margin: "5px",
    },
    textActive: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    textDeactive: {
      color: "black",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    // end

    // Show Card Style
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
      borderRadius: "15px",
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
    unitName: {
      display: "none",
    },
    // End

    // ReCounter Style
    counterDecrementIcon: {
      color: "#000",
    },
    counterIncrementIcon: {
      color: "#000",
    },
    counterValue: {
      color: "#33cd6b",
    },
    // End

    // Product Details Style
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
    footerStyle: {
      bgcolor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
    },
    buttonStyle: {
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : "#33cd6b",
      color: custom?.button_text_color ? custom.button_text_color : "#fff",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "0.75rem",
    },
    // End
    // Counter
    divCounter: { marginTop: "0px", textAlign: "center", display: "grid" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor ? custom.menusDeactiveColor : "#33cd6b",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
    },
    // End

    // cart
    card: {
      display: "grid",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor ? custom.cardBgColor : "#fff",
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
    // End
    // sideBar
    sidebarMainDiv: {
      position: "relative",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
    },
    sidebarCard: {
      position: "fixed",
      top: 0,
      bottom: 0,
      marginLeft: "5px",
      marginTop: "5%",
      marginBottom: "5%",
      zIndex: 1,
      borderRadius: "30px",
    },
  };
};
