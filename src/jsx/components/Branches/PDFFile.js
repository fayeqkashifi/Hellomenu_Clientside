import React, { useRef, useEffect } from "react";
import {
  Page,
  Text,
  Image,
  Canvas,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import LebronStretch from "../../../images/hellomenu/circle_menu_button.png";
// import QRCode from "qrcode.react";

const PDFFile = (props) => {
  const { inputFields } = props;
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#2d3134",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 40,
      fontFamily: "Times-Roman",
      fontWeight: "bolder",
      textAlign: "center",
      color: "#f50b65",
    },
    text: {
      margin: 12,
      fontSize: 30,
      textAlign: "center",
      textTransform: "uppercase",
      fontFamily: "Times-Roman",
      color: "#a7b8c3",
    },
    canvas: {
      backgroundColor: "#ffffff",
      height: 500,
      width: 500,
    },
  });
  const styles2 = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 40,
      fontFamily: "Times-Roman",
      fontWeight: "bolder",
      textAlign: "center",
      color: "#f50b65",
    },
    text: {
      margin: 12,
      fontSize: 30,
      textAlign: "center",
      textTransform: "uppercase",
      fontFamily: "Times-Roman",
      color: "#a7b8c3",
    },
    canvas: {
      backgroundColor: "#ffffff",
      height: 500,
      width: 500,
    },
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{inputFields.title}</Text>
          <Text style={styles.text}>{inputFields.header}</Text>
          <Image style={styles.image} src={LebronStretch} />

          <Text style={styles.text}> {inputFields.footer}</Text>
        </View>
      </Page>
      <Page size="A4" style={styles2.page}>
        <View style={styles2.section}>
          <Text style={styles2.title}>{inputFields.title}</Text>
          <Text style={styles2.text}>{inputFields.header}</Text>
          <Image style={styles2.image} src={LebronStretch} />

          <Text style={styles2.text}> {inputFields.footer}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
