import { base_url, port } from "../../../../../../Consts";

export const DarkStyle = (custom, theme, isTablet, isMobile) => {
  return {
    // profile
    activeMenu: {
      cursor: "pointer",
      border: "1px solid",
      margin: "10px",
      borderRadius: "10px",
      borderColor: "#f27d1e",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      backgroundColor: "#f27d1e",
      color: "#fff",
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
      color: "#f27d1e",
    },
    // SideBar
    sidebar:
      isMobile || isTablet
        ? {
            backgroundColor: "inherit",
            position: "fixed",
            overflow: "auto",
            textAlign: "center",
          }
        : {
            margin: 0,
            padding: 0,
            width: "4%",
            backgroundColor: custom?.cardBgColor
              ? custom.cardBgColor
              : theme.CardColor
              ? theme.CardColor
              : "#2d3134",
            position: "fixed",
            height: "100vh",
            overflow: "auto",
            textAlign: "center",
          },
    sidebarLinks: {
      display: "block",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      // padding: "5%",
      textDecoration: "none",
      fontSize: isMobile ? "5vw" : "3vw",
    },
    sidebarActiveLink: {
      display: "block",
      // padding: "5%",
      textDecoration: "none",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#2d3134",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      fontSize: isMobile ? "5vw" : "3vw",
    },
    content: {
      marginLeft: isMobile || isTablet ? "0%" : "4%",
    },

    logoText: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile ? "5vw" : "3vw",
      marginTop: "12px",
      // padding: "10px",
    },
    logoImage: {
      width: "50px",
      width: "50px",
      objectFit: "contain",
    },

    // Main public
    template: "dark",
    // darkMain file style

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
        : "#22252a",
      minHeight: "100vh",
    },
    varaintContainer: { paddingBottom: "100px" },
    // Header file style
    backIcon: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    title: { visibility: "hidden" },
    searchFields: {
      width: isMobile ? "70%" : "20%",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile ? "2vw" : "1vw",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
    },
    inputfield: {
      width: "100%",
      // height: "45px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: 12,
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
    },
    inputfieldDetails: {
      width: "100%",
      // height: "35px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile ? "2vw" : "1vw",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
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
          : "#f27d1e",
      },
    },
    cartIcon: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    headerTotalDiv: {
      display: "none",
    },
    headertoolbar: {
      overflowX: "auto",
      // zIndex: 9999999,
    },
    // localization
    localeBackground: {
      fontSize: isMobile ? "2vw" : "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
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
        : "#f27d1e",

      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    cateDeActive: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      marginRight: "10px",
      marginLeft: "10px",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    // end Header

    // statusbar style
    headerVideos: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
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
        : "#ff751d",
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
      width: isMobile ? "50px" : isTablet ? "100px" : "150px",
      height: isMobile ? "80px" : isTablet ? "100px" : "200px",
      borderRadius: "10px",
      border: "1px solid",
      borderColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
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

    // vidoeDetails
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
      : 12,
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
    cardStyleDetails: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
    },
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColorz
        ? theme.CardColor
        : "#2d3134",
    },
    favIconDeactive: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    favIconActive: {
      color: custom?.menusActiveColor
        ? custom.menusActiveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
      fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    imageStyle: {
      height: isMobile ? "50px" : isTablet ? "100px" : "150px",

      width: "100%",
      borderRadius: "15px",
      objectFit: "contain",
    },

    productName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize
        ? custom.pNameSize + "rem"
        : isMobile
        ? "2vw"
        : "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
    },
    productDiv: {
      width: isMobile ? "100%" : isTablet ? "50%" : "60%",
      textAlign: "left",
    },
    price: {
      fontSize: custom?.priceSize
        ? custom.priceSize + "rem"
        : isMobile || isTablet
        ? "2vw"
        : "1vw",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
      fontWeight: "bold",
    },
    unitName: {
      display: "none",
    },
    addIcon: {
      width: isMobile ? "100%" : isTablet ? "50%" : "40%",
      // fontSize: isMobile || isTablet ? "2vw" : "1vw",
    },
    // end Show Card Style

    // ReCounter Style
    counterDecrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    counterValue: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    // End

    // product dtails Style
    cartPrice: {
      fontSize: custom?.priceSize
        ? custom.priceSize + "rem"
        : isMobile || isTablet
        ? "2vw"
        : "1vw",
      color: custom?.price_color
        ? custom.price_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
      fontWeight: "bold",
    },
    cartDescription: {
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : isMobile || isTablet
        ? "1vw"
        : "0.5vw",

      color: custom?.product_discription_color
        ? custom.product_discription_color
        : theme.TextColor
        ? theme.TextColor
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
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      textDecoration: "line-through",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : isMobile || isTablet
        ? "1vw"
        : "0.5vw",
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
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: custom?.pDiscriptionSize
        ? custom.pDiscriptionSize + "rem"
        : isMobile || isTablet
        ? "1vw"
        : "0.5vw",
    },
    show_extras: custom?.show_extras,
    show_variants: custom?.show_variants,
    variantsDiv: {
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
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
        : theme.TextColor
        ? theme.TextColor
        : "black",
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
      borderColor: "#22252a",
      backgroundColor: "#22252a",
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
        : "#ff751d",
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
    imageSilderMainDiv: { position: "sticky" },
    mainSwiper: {
      margin: "10px",
      padding: "10px",
    },
    swiperMainImage: {
      height: "400px",
      width: "100%",
      borderRadius: "10px",
    },
    ThumbsSwiper: { maxHeight: "100px", cursor: "pointer", margin: "10px" },
    thumbsImage: {
      // objectFit: "contain",
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
    // End

    // footer
    buttonStyle: {
      display: theme.ShowButton == 1 ? "block" : "none",
      textTransform: "capitalize",
      backgroundColor: custom?.button_background_color
        ? custom.button_background_color
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#ff751d",
      color: custom?.footerStyle
        ? custom.button_text_color
        : theme.TextColor
        ? theme.TextColor
        : "#f1fcfe",
      fontSize: custom?.bTextSize
        ? custom.bTextSize + "rem"
        : isMobile || isTablet
        ? "2vw"
        : "1vw",
      borderRadius: theme.ButtonShape == "R" ? 100 : 0,
    },
    footerStyle: {
      bgcolor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
      position: "fixed",
      bottom: 0,
      width: "100%",
      textAlign: "center",
      // zIndex: 99999999,
    },
    // End

    // Drawer Style
    categories: {
      fontSize: custom?.menusSize
        ? custom.menusSize + "rem"
        : isMobile || isTablet
        ? "2vw"
        : "1vw",
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
    },

    cardHeader: {
      backgroundColor: custom?.bgColor
        ? custom.bgColor
        : theme.CardColor
        ? theme.CardColor
        : "#22252a",
      borderColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
    },
    cardBody: {
      backgroundColor: custom?.bgColor
        ? custom.bgColor
        : theme.CardColor
        ? theme.CardColor
        : "#22252a",
    },
    // End

    // Counter Style
    divCounter: { marginTop: "-6px", marginRight: "15px", textAlign: "center" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
      fontSize: isMobile ? "2vw" : "1vw",
    },
    counterRemovIcon: {
      color: "rgb(223, 71, 89)",
      fontSize: isMobile ? "2vw" : "1vw",
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
        : "#2d3134",
    },
    active: {
      cursor: "pointer",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      borderColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "black",
      backgroundColor: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "black",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
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
        : "#ff751d",
      backgroundColor: custom?.cardBgColor
        ? custom.cardBgColor
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },

    clearIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#f27d1e",
    },
    cartImage: {
      height: "200px",
      width: "150px",
      borderRadius: "15px",
      objectFit: "contain",
    },
    cartProductName: {
      textTransform: "capitalize",
      fontSize: custom?.pNameSize
        ? custom.pNameSize + "rem"
        : isMobile || isTablet
        ? "2vw"
        : "1vw",
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
    },
    // End
  };
};
