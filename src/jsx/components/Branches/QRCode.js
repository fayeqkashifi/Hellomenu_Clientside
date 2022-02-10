import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  //   image: logo,
  dotsOptions: {
    color: "#4267b2",
    type: "rounded",
  },
  //   cornersSquareOptions: {
  //     type: "extra-rounded",
  //   },
  cornersDotOptions: { type: "dot" },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
});
export default function QRCode(props) {
  const [url, setUrl] = useState(props.BrancheName);
  const [fileExt, setFileExt] = useState("png");
  const ref = useRef(null);
  var [image, setImage] = useState([]);

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url,
      image: image.length === 0 ? "" : image,
    });
  }, [url, image]);

  const onUrlChange = (event) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = () => {
    qrCode.download({
      extension: fileExt,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImage(filesArray);
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };
  const renderPhotos = (source) => {
    return (
      <img
        src={source}
        alt=""
        key={source}
        style={{ width: "100px", height: "80px" }}
      />
    );
  };
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <div ref={ref} />

      <div className="form-group">
        <input
          type="file"
          name="file"
          className="form-control"
          onChange={handleImageChange}
          required
          data-overwrite-initial="false"
          data-min-file-count="1"
        />
      </div>
      {console.log(image)}
      {image.length !== 0 ? (
        <div className="result">{renderPhotos(image)}</div>
      ) : null}
      <div style={styles.inputWrapper}>
        <input value={url} onChange={onUrlChange} style={styles.inputBox} />
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
  },
};
