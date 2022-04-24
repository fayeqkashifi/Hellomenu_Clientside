import { base_url, port } from "../../../../../../Consts";

export const DarkStyle = (custom, theme) => {
  return {
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
      visibility: "hidden",
    },
    inputfield: {
      width: "100%",
      height: "35px",
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
      fontSize: 12,
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
      zIndex: 9999999,
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
        : "#ff751d",
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
        : "#ff751d",
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
        : theme.CardColor
        ? theme.CardColor
        : "#2d3134",
    },
    favIconDeactive: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    favIconActive: {
      color: custom?.menusActiveColor
        ? custom.menusActiveColor
        : theme.TextColor
        ? theme.TextColor
        : "#ff751d",
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
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
    },
    productDiv: { width: "60%", textAlign: "left" },
    price: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
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
      width: "40%",
    },
    // end Show Card Style

    // ReCounter Style
    counterDecrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
    },
    counterIncrementIcon: {
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.TextColor
        ? theme.TextColor
        : "#f27d1e",
    },
    counterValue: {
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
    },
    // End

    // product dtails Style
    cartPrice: {
      fontSize: custom?.priceSize ? custom.priceSize + "rem" : "1.25rem",
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
        : "0.75rem",

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
        : "0.75rem",
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
    imageSilderMainDiv: { maxHeight: "80vh", position: "sticky" },
    mainSwiper: {
      maxHeight: "70vh",
      margin: "10px",
      padding: "10px",
    },
    swiperMainImage: {
      height: "400px",
      width: "100%",
      borderRadius: "10px",
      // objectFit: "contain",
    },
    ThumbsSwiper: { maxHeight: "10vh", cursor: "pointer", margin: "10px" },
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
      fontSize: custom?.bTextSize ? custom.bTextSize + "rem" : "1rem",
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
      // zIndex: 999999,
    },
    // End

    // Drawer Style
    categories: {
      fontSize: custom?.menusSize ? custom.menusSize + "rem" : "1rem",
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
    divCounter: { marginTop: "-5px", marginRight: "15px", textAlign: "center" },
    addToCartIcon: {
      cursor: "pointer",
      color: custom?.menusDeactiveColor
        ? custom.menusDeactiveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#fff",
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
      color: custom?.menusAcriveColor
        ? custom.menusAcriveColor
        : theme.HighlightColor
        ? theme.HighlightColor
        : "#f27d1e",
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
      color: custom?.product_name_color
        ? custom.product_name_color
        : theme.TextColor
        ? theme.TextColor
        : "#fff",
    },
    // End
  };
};
