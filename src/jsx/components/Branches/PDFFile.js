import React from "react";
import {
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import LebronStretch from "../../../images/hellomenu/circle_menu_button.png";
import QRCode from "./QRCode";

const styles = StyleSheet.create({
  page: {
    //   width:"100%",
    //   height:"100%",
    // flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  //   image: {
  //     marginVertical: 15,
  //     marginHorizontal: 100,
  //   },
});

const PDFFile = (props) => {
  const { BrancheName, data } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{BrancheName}</Text>
          {/* <Image style={styles.image} src={<QRCode data={data} />} /> */}
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
