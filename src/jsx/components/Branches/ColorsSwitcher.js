import React from "react";

const ColorSwitcher = (props) => {
  const { title, qrCode, setQrCode, value, arrayValue, type } = props;

  const ChangeColor = (color) => {
    setQrCode({ ...qrCode, [value]: color });
  };

  const inputHandle = (e) => {
    setQrCode({ ...qrCode, [value]: e.target.value });
  };
  const ChangeSelect = (e) => {
    setQrCode({ ...qrCode, [type]: e.target.value });
  };
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="title">{title}</div>
        {arrayValue !== "" ? (
          <div>
            <select onChange={(e) => ChangeSelect(e)}>
              {arrayValue?.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#ff5d00",
                height: "30px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => ChangeColor("#ff5d00")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#ffb600",
                height: "30px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => ChangeColor("#ffb600")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#46dfb9",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#46dfb9")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#00d38b",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#00d38b")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#71d3fd",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#71d3fd")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#0096e3",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#0096e3")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#a7b8c3",
                cursor: "pointer",
                height: "30px",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#a7b8c3")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#ff003a",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#ff003a")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#ff87a2",
                height: "30px",
                cursor: "pointer",

                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#ff87a2")}
            ></div>
            <div
              className="col-1 mr-1 mb-1"
              style={{
                backgroundColor: "#a800ec",
                height: "30px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => ChangeColor("#a800ec")}
            ></div>
            <input
              type="text"
              style={{
                width: "50%",
                height: "30px",
                borderRadius: "5px",
              }}
              onChange={(e) => inputHandle(e)}
              value={qrCode[value]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSwitcher;
