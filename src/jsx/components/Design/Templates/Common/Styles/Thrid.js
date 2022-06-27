import { base_url, port } from "../../../../../../Consts";

export const ThridStyle = (custom, theme, isTablet, isMobile) => {
  return {
    spinner: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#503e9d",
    },
    spinnerInCenter: {
      position: "fixed",
      top: "50%",
      left: "50%",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#503e9d",
    },
    // profile
    activeMenu: {
      cursor: "pointer",
      border: "1px solid",
      margin: "10px",
      borderRadius: "10px",
      borderColor: "#503e9d",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      backgroundColor: "#503e9d",
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
      color: "#503e9d",
      fontSize: "1vw",
    },

    // footer home
    tooltipPlacement: isMobile ? "right" : "top",
    iconSize: {
      fontSize: isMobile ? "2vw" : "2vw",
    },
    sidebarLinks: {
      // display: "inline-block",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      padding: isMobile ? "5px" : "20px",
    },
    sidebarActiveLink: {
      // display: "inline",
      padding: isMobile ? "5px" : "20px",

      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#503e9d",
    },
    // main public
    template: "thrid",
    // thrid main
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
        : "#f8f8f8",
      minHeight: "100vh",
    },
    varaintContainer: { paddingBottom: "100px" },

    // header
    cateActive: {
      cursor: "pointer",
      width: "fit-content",
      marginRight: "10px",
      borderRadius: "5px",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#503e9d",
      fontSize: "1vw",
    },
    cateDeActive: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      marginRight: "10px",
      fontSize: "1vw",
    },
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
    toolbarHeader: {
      display: isMobile && "none",
    },
    catesDiv: {
      display: !isMobile && "none",
      marginTop: isMobile && "25px",
    },
    title: {
      display: "none",
    },
    backIcon: { visibility: "hidden" },
    cartIcon: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
    },
    searchFields: {
      marginLeft: "20px",
      marginRight: "20px",
    },
    headerTotalDiv: {
      width: "250px",
      marginLeft: "10px",
      marginRight: "10px",
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
      fontWeight: "bold",
      borderRadius: "10px",
    },
    totalPriceIcon: {
      backgroundColor: "#503e9d",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",

      margin: "5px",
      fontSize: "1vw",
    },
    totalPriceDiv: {
      marginRight: "20px",
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
          : "#fbd460",
      },
    },
    // localization
    localeBackground: {
      fontSize: "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
      // zIndex: 99999999,
    },
    // header End

    // statubar Style
    headerVideos: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
      cursor: "pointer",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    branchStory: {
      width: isMobile ? "30px" : isTablet ? "50px" : "60px",
      height: isMobile ? "50px" : isTablet ? "70px" : "80px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    productStory: {
      width: isMobile ? "30px" : isTablet ? "50px" : "60px",
      height: isMobile ? "30px" : isTablet ? "70px" : "80px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
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
      width: isMobile ? "50px" : isTablet ? "100px" : "150px",
      height: isMobile ? "80px" : isTablet ? "100px" : "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    productStoryList: {
      width: isMobile ? "50px" : isTablet ? "100px" : "150px",
      height: isMobile ? "80px" : isTablet ? "100px" : "200px",
      borderRadius: "10px",
      border: "2px solid",
      borderColor: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      padding: "2px",
      margin: "3px",
      marginTop: "10px",
      objectFit: "contain",
      lineBreak: "anywhere",
      overflow: "hidden",
    },
    // statubar End

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
    tabsStyle: {
      height: "inherit",
      width: "100%",
      display: isMobile && "none",
    },
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
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
      borderRadius: isTablet ? "5px" : "40px",
      padding: isTablet ? "5px" : "20px",
      margin: isTablet ? "5px" : "10px",
    },
    sidebarDeActive: {
      borderRadius: isTablet ? "5px" : "30px",
      padding: isTablet ? "5px" : "15px",
      margin: isTablet ? "5px" : "10px",
    },
    icon: {
      height: isTablet ? "30px" : "50px",
      width: isTablet ? "30px" : "50px",
      objectFit: "contain",
      margin: "5px",
    },
    textActive: {
      color: "#000",
      fontWeight: "bold",
      textTransform: "capitalize",
      fontSize: "0.8vw",
    },
    textDeactive: {
      color: "#000",
      fontWeight: "bold",
      textTransform: "capitalize",
      fontSize: "0.8vw",
    },
    // end

    // Show card style
    cardStyleDetails: {
      display: "flex",
      flexDirection: "column",
      // borderRadius: "20px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#fff",
    },
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      // borderRadius: "5px",
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
        : "#fbd460",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },

    imageStyle: {
      height: "150px",
      width: "100%",
      borderRadius: "15px",
      objectFit: "contain",
    },
    productName: {
      textTransform: "capitalize",
      textAlign: "left",
      fontSize: "2vw",
    },
    productDiv: { width: "100%", textAlign: "left" },
    addIcon: {
      width: "100%",
      textAlign: "center",
      borderRadius: "50px",
      border: "1px solid #aaa",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    counterPosition: "last",
    priceDiv: {
      textAlign: "right",
      margin: "10px",
    },
    price: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1vw",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
      fontWeight: "bold",
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
    unitName: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1vw",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    // end

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
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#000",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    // End

    // Product Details style

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
        : "#fbd460",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
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
        : "#503e9d",
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
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
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
      borderColor: "#503e9d",
      backgroundColor: "#503e9d",
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
        : "#fbd460",
      fontSize: "1vw",
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
    recomandImage: {
      height: "200px",
      width: "100%",
      borderRadius: "5%",

      objectFit: "contain",
    },
    // Image Slider Style
    imageSilderMainDiv: { minHeight: "80vh", position: "sticky" },
    mainSwiper: {
      minHeight: "70vh",
      margin: "10px",
      padding: "10px",
    },
    swiperMainImage: {
      height: "400px",
      width: "100%",
      borderRadius: "10px",
      // objectFit: "contain",
    },
    ThumbsSwiper: { minHeight: "10vh", cursor: "pointer", margin: "10px" },
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
          : "#ff751d",
      },
    },
    // end

    // footer
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
        : "#fbd460",
      color: custom?.button_text_color
        ? custom.button_text_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1vw",
      borderRadius: theme.ButtonShape == "R" ? 100 : 0,
    },
    // End
    // counter
    divCounter: {},
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fbd460",
      fontSize: "2vw",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    // End

    // cart
    inputfieldDetails: {
      width: "100%",
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
        : "#fbd460",
    },
    inputfield: {
      width: "100%",
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
        : "#fbd460",
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
      borderColor: "#fbd460",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#fbd460",
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
        : "#fbd460",
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
      height: "200px",
      width: "150px",
      borderRadius: "15px",
      objectFit: "contain",
    },

    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize ? custom.pNameSize + "rem" : "2vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
    },
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "2vw",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#000",
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
  };
};
