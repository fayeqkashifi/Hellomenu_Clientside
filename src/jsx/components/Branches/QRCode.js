import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
const qrCode = new QRCodeStyling({
  width: 250,
  height: 250,

  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
});
export default function QRCode(props) {
  const { data, setQrCode, image, setSource } = props;
  const [fileExt, setFileExt] = useState("png");
  const ref = useRef(null);

  useEffect(() => {
    qrCode.append(ref.current);
    return () => {
      setFileExt([]);
    };
  }, []);
  useEffect(() => {
    qrCode.update({
      data: data.data,
      dotsOptions: {
        color: data.DotsColor,
        type: data.type,
      },
      cornersSquareOptions: {
        color: data.colorCornersSquare,
        type: data.cornersSquare,
      },
      cornersDotOptions: {
        color: data.cornersDotColor,
        type: data.cornersDot,
      },
      backgroundOptions: {
        color: data.bgColor,
      },
      image: image.length === 0 ? "" : image,
    });
    var raw = qrCode.getRawData(fileExt);
    raw.then((dataUri) => {
      setSource(URL.createObjectURL(dataUri));
    });
    return () => {
      setFileExt([]);
      setSource([]);
    };
  }, [image, data]);

  const onUrlChange = (event) => {
    event.preventDefault();
    setQrCode({ ...data, data: event.target.value });
  };

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = () => {
    qrCode.download({
      extension: fileExt,
    });
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <div ref={ref} />
      <div style={styles.inputWrapper}>
        <input
          value={data.data}
          onChange={onUrlChange}
          style={styles.inputBox}
        />
        <select onChange={onExtensionChange} value={fileExt}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>
      <button onClick={onDownloadClick} className="btn btn-success">
        Download
      </button>
    </div>
  );
}

const styles = {
  inputWrapper: {
    margin: "20px 0",
    display: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  inputBox: {
    flexGrow: 1,
    marginRight: 20,
    borderRadius: "5px",
    height: "30px",
  },
};
