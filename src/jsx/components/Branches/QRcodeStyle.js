import React, { Fragment } from "react";

import QRCode from "./QRCode";
const QRcodeStyle = (props) => {
  const BrancheName = props.history.location.state.BrancheName;
  console.log(BrancheName);
  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Restaurant QR Generators</h4>
            </div>
            <div className="card-body ">
              <div>SELECT QR STYLE</div>
              <div> SELECT QR COLOR</div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">QR Downloader</h4>
            </div>
            <div className="card-body ">
              <QRCode BrancheName={BrancheName} />
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Menu Print template</h4>
            </div>
            <div className="card-body ">body</div>
            <div className="card-footer">text</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default QRcodeStyle;
