import { base_url, port } from "../../../../../../Consts";

export const SecondStyle = (custom, theme) => {
  return {
    // main public
    template: "second",
    // second main
    background: {
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage:
        theme.HomeScreenBackgroundURL &&
        `url(http://${base_url}:${port}/images/Themes/${theme.HomeScreenBackgroundURL})`,
      backgroundColor: custom?.bgColor
        ? custom.bgColor
        : theme.BackgroundColor
        ? theme.BackgroundColor
        : "#eee",
      minHeight: "100vh",
    },

    // header file style
    inputfield: {
      width: "50%",
      height: "35px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
    cartIcon: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
    },
    title: {
      marginLeft: 200,
      paddingBottom: "2px",
      marginBottom: "10px",
      borderBottomStyle: "solid",
      borderottomWidth: "3.1px",
      width: "fit-content",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
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
        color: custom?.menusDeactiveColor
          ? custom.menusDeactiveColor
          : theme.HighlightColor
          ? theme.HighlightColor
          : "#fff",
        backgroundColor: custom?.menusAcriveColor
          ? custom.menusAcriveColor
          : theme.TextColor
          ? theme.TextColor
          : "#33cd6b",
      },
    },
    // Header End

    // statusbar Style
    headerVideos: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      cursor: "pointer",
    },
    branchStory: {
      width: "80px",
      height: "130px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    productStory: {
      width: "80px",
      height: "130px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
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
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#aaa",
      margin: "3px",
    },
    fullScreenIcon: {
      width: "70px",
      height: "100px",
      overflow: "hidden",
    },
    branchStoryList: {
      width: "150px",
      height: "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    productStoryList: {
      width: "150px",
      height: "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    // statusbar End

    // vidoe Details
    reactPlayerStyle: {
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
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
      background: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
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
    cardStyleDetails: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
    },
    cardStyle: {
      width: "300px",
      margin: "20px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
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
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#aa3f32",
      fontWeight: "bold",
    },
    unitName: {
      display: "none",
    },
    // End

    // ReCounter Style
    counterDecrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    counterValue: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#33cd6b",
    },
    // End

    // Product Details Style
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
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    ingredientsDeActive: {
      cursor: "pointer",
      display: "inline-block",

      padding: "3px",
      margin: "2px",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "5px",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",
    },
    show_extras: custom?.show_extras,
    show_variants: custom?.show_variants,
    variantsDiv: {
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#33cd6b",
      borderRadius: "50px",
      padding: "5px",
    },
    variantActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#aa3f32",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#aa3f32",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    variantDeActive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "50px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    checkbox: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
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
          : theme.TextColor
          ? theme.TextColor
          : "#33cd6b",
      },
    },
    // End
    // footer
    footerStyle: {
      bgcolor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
    },
    buttonStyle: {
      display: theme.ShowButton == 1 ? "block" : "none",
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#33cd6b",
      color: custom?.button_text_color
        ? custom.button_text_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "0.75rem",
      borderRadius: theme.ButtonShape == "R" ? 100 : 0,
    },
    // End
    // Counter
    divCounter: { marginTop: "0px", textAlign: "center", display: "grid" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#33cd6b",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
    },
    // End

    // cart
    card: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
    },
    active: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: "0.5rem",
    },
    deactive: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      backgroundColor: "#fff",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: "0.25rem",
    },

    ordersText: {
      display: "none",
    },
    orderingOptions: 6,
    clearIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
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
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1rem",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#aa3f32",
      fontWeight: "bold",
    },
    cartDescription: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : "0.75rem",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    // End
    // order Details
    inputfieldDetails: {
      width: "100%",
      // height: "35px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
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
      marginTop: "1%",
      marginBottom: "1%",
      zIndex: 1,
      borderRadius: "30px",
    },
  };
};
