import { base_url, port } from "../../../../../../Consts";

export const SecondStyle = (custom, theme, isTablet, isMobile) => {
  return {
    spinner: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
    spinnerInCenter: {
      position: "fixed",
      top: "50%",
      left: "50%",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
    // profile
    activeMenu: {
      cursor: "pointer",
      border: "1px solid",
      margin: "10px",
      borderRadius: "10px",
      borderColor: "#33cd6b",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      backgroundColor: "#33cd6b",
      color: "#fff",
      fontSize: "1vw",
    },
    DeActiveMenu: {
      height: "50px",
      cursor: "pointer",
      border: "1px solid",
      borderRadius: "10px",
      margin: "10px",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderColor: "#ffffff",
      backgroundColor: "#ffffff",
      color: "#33cd6b",
      fontSize: "1vw",
    },

    // main public
    template: "second",
    showCartStyle: {
      minHeight: !isTablet && "80vh",
      maxWidth: !isTablet && "90%",
      marginLeft: !isTablet && "10%",
    },
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
      fontSize: isMobile ? "2vw" : "1vw",

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
      display: isTablet && "none",
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
      fontSize: "2vw",

      fontWeight: "bold",
    },
    searchFields: {
      visibility: isTablet ? "hidden" : "visible",
      width: "20%",
      // height: isMobile ? "20px" : "40px",
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
      fontSize: "1vw",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
    headerTotalDiv: {
      display: "none",
    },
    catesDiv: {
      display: !isTablet && "none",
      marginTop: isTablet && "25px",
    },
    headertoolbar: {
      overflowX: "auto",
      // zIndex: 9999999,
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
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",

      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    cateDeActive: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      marginRight: "10px",
      marginLeft: "10px",
      fontSize: isMobile ? "2vw" : "1vw",
    },
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

    // localization
    localeBackground: {
      fontSize: isMobile ? "2vw" : "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
      visibility: isTablet ? "hidden" : "visible",
    },
    toolbarHeader: {
      display: isTablet && "none",
      width: isTablet ? "100%" : "94%",
      float: "right",
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
      fontSize: isMobile ? "2vw" : "1vw",
    },
    branchStory: {
      width: isMobile ? "40px" : isTablet ? "60px" : "80px",
      height: isMobile ? "60px" : isTablet ? "90px" : "130px",
      borderRadius: "10px",
      border: "1px solid",
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
      width: isMobile ? "40px" : isTablet ? "60px" : "80px",
      height: isMobile ? "60px" : isTablet ? "90px" : "130px",
      borderRadius: "10px",
      border: "1px solid",
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
      border: "1px solid",
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
      border: "1px solid",
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
    sidebarMainDiv: {
      position: "relative",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
    },
    sidebarCard: {
      display: isTablet && "none",
      position: "fixed",
      top: 0,
      bottom: 0,
      marginLeft: "5px",
      marginTop: "1%",
      marginBottom: "5%",
      zIndex: 1,
      borderRadius: "15px",
      width: "6%",
      height: "94%",
    },
    container: {
      width: isTablet ? "100%" : "94%",
      float: "right",
    },
    sidebarPosition: "vertical",
    sidebarActive: {
      background: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      borderRadius: "10px",
      padding: "15px",
      fontSize: "2vw",
    },
    sidebarDeActive: {
      borderRadius: "10px",
      padding: "15px",
      fontSize: "2vw",
    },
    tabsStyle: {
      height: "inherit",
      width: "100%",
    },
    icon: {
      height: isTablet ? "15px" : "30px",
      width: isTablet ? "15px" : "30px",
      objectFit: "contain",
      margin: !isTablet && "5px",
    },
    textActive: {
      color: "white",
      fontSize: "0.7vw",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    textDeactive: {
      color: "black",
      fontSize: "0.7vw",
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
      width: "50vh",
      margin: isMobile || isTablet ? "10px" : "20px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
    },
    favIconDeactive: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    favIconActive: {
      color: custom?.menusActiveColor
        ? custom.menusActiveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    imageStyle: {
      height: isTablet ? "30vh" : "40vh",
      width: "100%",
      borderRadius: "10px",
      objectFit: "contain",
    },
    productName: {
      textTransform: "capitalize",
      textAlign: "center",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    productDiv: { width: "100%", textAlign: "center" },
    addIcon: {
      width: "100%",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    price: {
      textAlign: "center",
      fontSize: custom?.priceSize
        ? custom.priceSize + "rem"
        : isMobile
        ? "2vw"
        : "1vw",
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
      fontSize: isMobile ? "2vw" : "1vw",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#000",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    counterValue: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#33cd6b",
      fontSize: isMobile ? "2vw" : "1vw",
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
        : "1vw",
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
        : "1vw",
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
      fontSize: "1vw",
    },
    variantsImage: {
      height: "400px",
      width: "100%",
      borderRadius: "5px",
      objectFit: "contain",
    },
    variantsThumbs: {
      height: "70px",
      width: "100%",
      borderRadius: "5px",
      // objectFit: "contain",
    },
    varaintContainer: { paddingBottom: "100px" },

    // Image Slider Style
    divSilder: {
      width: isMobile ? "100%" : "30%",
      padding: "20px",
      display: isMobile && "flex",
      alignItems: isMobile && "center",
      justifyContent: isMobile && "center",
    },
    divDetails: {
      width: isMobile ? "100%" : "70%",
      padding: "20px",
    },
    maindivforSilder: {
      width: isMobile ? "40%" : "100%",
      height: isMobile ? "200px" : isTablet ? "350px" : "450px",
    },
    swiperMainImage: {
      height: isMobile ? "170px" : isTablet ? "300px" : "400px",
      width: "inherit",
      textAlign: "center",
      borderRadius: "10px",
      // objectFit: "contain",
    },
    ThumbsSwiper: {
      minHeight: isMobile ? "30px" : isTablet ? "45px" : "65px",
      cursor: "pointer",
      margin: isMobile || isTablet ? "2px" : "5px",
    },
    thumbsImage: {
      height: isMobile ? "25px" : isTablet ? "40px" : "60px",
      width: isMobile ? "15px" : isTablet ? "25px" : "40px",
      textAlign: "center",
      borderRadius: isMobile ? "2px" : "5px",
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
    logoText: {
      position: "fixed",
      top: 0,
      width: "100%",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      paddingLeft: "5%",
    },
    // footer home
    tooltipPlacement: isTablet ? "right" : "top",
    sidebarLinks: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      padding: isMobile ? "5px" : "20px",
      // fontSize: isMobile ? "0.1vw" : "2vw",
    },
    sidebarActiveLink: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
      padding: isMobile ? "5px" : "20px",
    },
    iconSize: {
      fontSize: isMobile ? "2vw" : "2vw",
    },
    footerStyle: {
      visibility: isMobile ? "hidden" : "visible",
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
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1vw",
      borderRadius: theme.ButtonShape == "R" ? 100 : 0,
    },
    // End

    // Counter
    divCounter: { marginTop: "0px", textAlign: "center", display: "grid" },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    // End

    // cart
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#33cd6b",
      fontSize: "2vw",
    },
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
      fontSize: "1vw",
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
      fontSize: "1vw",
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
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
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
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1vw",
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
        : "1vw",
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
      fontSize: isMobile ? "2vw" : "1vw",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#33cd6b",
    },
  };
};
