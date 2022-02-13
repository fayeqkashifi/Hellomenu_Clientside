import React, { Fragment, useState, useRef } from "react";
import ColorSwitcher from "./ColorsSwitcher";

import QRCode from "./QRCode";
import QRcodeTemplate from "./QRcodeTemplate";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDFFile from "./PDFFile";
import { base_url, port } from "../../../Consts";

const QRcodeStyle = (props) => {
  const BrancheName = props.history.location.state.BrancheName;
  const id = props.history.location.state.id;
  let [qrCode, setQrCode] = useState({
    data: `http://${base_url}:${port}/public/${btoa(id)}`,
    type: "rounded",
    cornersSquare: "dot",
    bgColor: "#ffffff",
    colorCornersSquare: "#000000",
    DotsColor: "#000000",
    cornersDotColor: "#000000",
  });
  var [image, setImage] = useState([]);
  const [source, setSource] = useState(null);

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
        alt=" "
        key={source}
        style={{ width: "100px", height: "80px" }}
      />
    );
  };
  const [inputFields, setInputFields] = useState({
    title: "HELLO MENU",
    header: "SCAN THE QR CODE TO VIEW IT ON YOUR SMART PHONE",
    footer: BrancheName,
  });
  const handelChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Generators</h4>
            </div>
            <div className="card-body ">
              <div className="my-2">
                <strong> SELECT QR STYLE</strong>
              </div>
              <div className="row">
                <div
                  className="col-4 border"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "rounded",
                      cornersSquare: "dot",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#000000",
                      DotsColor: "#f00000",
                      cornersDotColor: "#000000",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "rounded",
                      cornersSquare: "dot",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#000000",
                      DotsColor: "#f00000",
                      cornersDotColor: "#000000",
                    }}
                  />
                </div>
                <div
                  className="col-4 border"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "classy",
                      cornersSquare: "extra-rounded",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#000000",
                      DotsColor: "#000000",
                      cornersDotColor: "#000000",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "classy",
                      cornersSquare: "extra-rounded",
                      bgColor: "#fffff",
                      colorCornersSquare: "#000000",
                      DotsColor: "#000000",
                      cornersDotColor: "#000000",
                    }}
                  />
                </div>
                <div
                  className="col-4 border"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "square",
                      cornersSquare: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#00FF00",
                      DotsColor: "#000f00",
                      cornersDotColor: "#000000",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "square",
                      cornersSquare: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#00FF00",
                      DotsColor: "#000f00",
                      cornersDotColor: "#000000",
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="col-4 border"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "classy-rounded",
                      cornersDot: "dot",
                      cornersSquare: "extra-rounded",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#000f00",
                      cornersDotColor: "#4267b2",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "classy-rounded",
                      cornersSquare: "extra-rounded",

                      cornersDot: "dot",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#000f00",
                      cornersDotColor: "#4267b2",
                    }}
                  />
                </div>
                <div
                  className="col-4 border "
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "dots",
                      cornersSquare: "dot",
                      cornersDot: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#00f000",
                      cornersDotColor: "#f00000",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "dots",
                      cornersSquare: "dot",
                      cornersDot: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#00f000",
                      cornersDotColor: "#f00000",
                    }}
                  />
                </div>
                <div
                  className="col-4 border"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQrCode({
                      data: BrancheName,
                      type: "extra-rounded",
                      cornersSquare: "square",
                      cornersDot: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#ff0000",
                      cornersDotColor: "#f00000",
                    })
                  }
                >
                  <QRcodeTemplate
                    data={{
                      data: BrancheName,
                      type: "extra-rounded",
                      cornersSquare: "square",
                      cornersDot: "square",
                      bgColor: "#ffffff",
                      colorCornersSquare: "#0f0000",
                      DotsColor: "#ff0000",
                      cornersDotColor: "#f00000",
                    }}
                  />
                </div>
                <div className="form-group mt-2">
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
                {image.length !== 0 ? (
                  <div className="result">{renderPhotos(image)}</div>
                ) : null}
              </div>
              <div className="my-2">
                <strong>SELECT QR COLOR</strong>
              </div>
              {/* <ColorSwitcher
                title="Background Color"
                qrCode={qrCode}
                setQrCode={setQrCode}
                value="bgColor"
                arrayValue=""
              /> */}
              <ColorSwitcher
                title="Dots Color"
                qrCode={qrCode}
                setQrCode={setQrCode}
                value="DotsColor"
                arrayValue={[
                  "rounded",
                  "classy",
                  "square",
                  "classy-rounded",
                  "dots",
                  "extra-rounded",
                ]}
                type="type"
              />
              <ColorSwitcher
                title="Corners Dot Color"
                qrCode={qrCode}
                setQrCode={setQrCode}
                value="cornersDotColor"
                arrayValue={["dot", "square", "extra-rounded"]}
                type="cornersSquare"
              />
              <ColorSwitcher
                title="Corners Square Color"
                qrCode={qrCode}
                setQrCode={setQrCode}
                value="colorCornersSquare"
                arrayValue={["dot", "square"]}
                type="cornersDot"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Downloader</h4>
            </div>
            <div className="card-body">
              <QRCode
                data={qrCode}
                setQrCode={setQrCode}
                image={image}
                setSource={setSource}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Print templates</h4>
            </div>
            <PDFViewer
              className="my-1"
              style={{ width: "100%", height: "80%" }}
            >
              <PDFFile inputFields={inputFields} source={source} />
            </PDFViewer>

            <div className="form-group mt-1">
              <input
                type="text"
                name="title"
                value={inputFields.title}
                className="form-control"
                onChange={handelChange}
              />
            </div>
            <div className="form-group mt-1">
              <input
                type="text"
                name="header"
                value={inputFields.header}
                className="form-control"
                onChange={handelChange}
              />
            </div>
            <div className="form-group mt-1">
              <input
                type="text"
                name="footer"
                value={inputFields.footer}
                className="form-control"
                onChange={handelChange}
              />
            </div>

            <PDFDownloadLink
              document={<PDFFile inputFields={inputFields} source={source} />}
              fileName="print.pdf"
            >
              {({ loading }) =>
                loading ? (
                  <div className="spinner-border text-primary" role="status">
                    : <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button className="btn btn-primary">Download</button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default QRcodeStyle;
