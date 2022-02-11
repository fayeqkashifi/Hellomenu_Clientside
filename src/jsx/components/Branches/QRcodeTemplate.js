import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QRcodeTemplate(props) {
  const qrCode = new QRCodeStyling({
    width: 50,
    height: 50,
  });
  const { data } = props;
  const ref = useRef(null);

  useEffect(() => {
    qrCode.append(ref.current);
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
        color: data.bgcolor,
      },
    });
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "5px",
      }}
    >
      <div ref={ref} />
    </div>
  );
}
