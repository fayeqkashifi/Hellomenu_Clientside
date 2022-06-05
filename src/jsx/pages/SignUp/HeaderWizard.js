import React from "react";
const HeaderWizard = (props) => {
  const { first, second, thrid } = props;
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="md-stepper-horizontal orange">
          <div className={`md-step ${first}`}>
            <div className="md-step-circle">
              <span>1</span>
            </div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div className={`md-step ${second}`}>
            <div className="md-step-circle">
              <span>2</span>
            </div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div className={`md-step ${thrid}`}>
            <div className="md-step-circle">
              <span>3</span>
            </div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          {/* <div className={`md-step ${fourth}`}>
            <div className="md-step-circle">
              <span>4</span>
            </div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeaderWizard;
